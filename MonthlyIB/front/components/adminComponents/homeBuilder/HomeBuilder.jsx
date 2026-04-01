"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import styles from "./HomeBuilder.module.css";
import {
  BLOCK_LIBRARY,
  HOME_LAYOUT_OPTIONS,
  createDefaultBlock,
  createDefaultHomeLayout,
  createEmptyColumn,
  createId,
  createRow,
  getColumnCountForLayout,
  getPaletteAvailability,
  normalizeHomeLayout,
} from "@/components/homeComponents/layout/homeLayoutDefaults";
import HomeBlockContent from "@/components/homeComponents/layout/HomeBlockContent";
import {
  adminGetHomeLayout,
  adminPublishHomeLayout,
  adminResetHomeLayoutDraft,
  adminSaveHomeLayoutDraft,
  adminUploadHomeLayoutMedia,
} from "@/apis/homeLayoutAPI";
import { useUserInfo } from "@/store/user";

const EditorComponents = dynamic(
  () => import("@/components/boardComponents/EditorComponents"),
  { ssr: false }
);

const cloneLayout = (layout) => JSON.parse(JSON.stringify(layout));

const findRowIndex = (rows, rowId) => rows.findIndex((row) => row.id === rowId);

const findColumn = (layout, rowId, columnId) => {
  const row = layout.rows.find((item) => item.id === rowId);
  const column = row?.columns.find((item) => item.id === columnId);
  return { row, column };
};

const findBlockLocation = (layout, blockId) => {
  for (const row of layout.rows) {
    for (const column of row.columns) {
      const blockIndex = column.blocks.findIndex((block) => block.id === blockId);
      if (blockIndex !== -1) {
        return {
          rowId: row.id,
          columnId: column.id,
          blockIndex,
          block: column.blocks[blockIndex],
        };
      }
    }
  }
  return null;
};

const DRAG_SCROLL_EDGE = 120;
const DRAG_SCROLL_MAX_STEP = 28;
const DRAG_PREVIEW_SCALE = 0.84;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const isLockedBlock = (block) => block?.type === "existingHero";

const isLockedRow = (row) =>
  row?.columns?.some((column) => column.blocks?.some((block) => isLockedBlock(block)));

const adjustRowColumns = (row, nextLayout) => {
  const nextCount = getColumnCountForLayout(nextLayout);
  const nextColumns = cloneLayout({ rows: [row] }).rows[0].columns;

  if (nextColumns.length < nextCount) {
    while (nextColumns.length < nextCount) {
      nextColumns.push(createEmptyColumn());
    }
  } else if (nextColumns.length > nextCount) {
    const overflowColumns = nextColumns.splice(nextCount);
    nextColumns[nextColumns.length - 1].blocks.push(
      ...overflowColumns.flatMap((column) => column.blocks)
    );
  }

  return {
    ...row,
    layout: nextLayout,
    columns: nextColumns,
  };
};

const moveRow = (layout, sourceRowId, targetRowId) => {
  if (!sourceRowId || !targetRowId || sourceRowId === targetRowId) {
    return layout;
  }

  const next = cloneLayout(layout);
  const rows = next.rows;
  const sourceIndex = findRowIndex(rows, sourceRowId);
  const targetIndex = findRowIndex(rows, targetRowId);

  if (sourceIndex === -1 || targetIndex === -1) {
    return layout;
  }

  const [sourceRow] = rows.splice(sourceIndex, 1);
  rows.splice(targetIndex, 0, sourceRow);
  return next;
};

const moveBlock = (layout, source, target) => {
  if (!source || !target) {
    return layout;
  }

  const next = cloneLayout(layout);
  const sourceColumn = findColumn(next, source.rowId, source.columnId).column;
  const targetColumn = findColumn(next, target.rowId, target.columnId).column;

  if (!sourceColumn || !targetColumn) {
    return layout;
  }

  const sourceIndex = sourceColumn.blocks.findIndex((block) => block.id === source.blockId);
  if (sourceIndex === -1) {
    return layout;
  }

  const [movingBlock] = sourceColumn.blocks.splice(sourceIndex, 1);
  let insertIndex = typeof target.blockIndex === "number" ? target.blockIndex : targetColumn.blocks.length;

  if (source.rowId === target.rowId && source.columnId === target.columnId && sourceIndex < insertIndex) {
    insertIndex -= 1;
  }

  if (insertIndex < 0) {
    insertIndex = 0;
  }

  targetColumn.blocks.splice(insertIndex, 0, movingBlock);
  return next;
};

const deleteBlockFromLayout = (layout, rowId, columnId, blockId) => {
  const next = cloneLayout(layout);
  const column = findColumn(next, rowId, columnId).column;
  if (!column) {
    return layout;
  }
  column.blocks = column.blocks.filter((block) => {
    if (block.id !== blockId) {
      return true;
    }
    return isLockedBlock(block);
  });
  return next;
};

const HomeBuilder = () => {
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const [layout, setLayout] = useState(createDefaultHomeLayout());
  const [publishedLayout, setPublishedLayout] = useState(createDefaultHomeLayout());
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [selectedColumnTarget, setSelectedColumnTarget] = useState(null);
  const [draftMeta, setDraftMeta] = useState({
    draftUpdatedAt: null,
    publishedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draggingRowId, setDraggingRowId] = useState(null);
  const [draggingBlockId, setDraggingBlockId] = useState(null);
  const [blockDropPreview, setBlockDropPreview] = useState(null);
  const dragPreviewRef = useRef(null);

  // 왼쪽 패널 탭: "palette" | "inspector"
  const [leftTab, setLeftTab] = useState("palette");

  // 블록 선택 시 자동으로 속성 탭으로 전환
  useEffect(() => {
    if (selectedBlockId) {
      setLeftTab("inspector");
    }
  }, [selectedBlockId]);

  useEffect(() => {
    if (userInfo?.authority && userInfo.authority !== "ADMIN") {
      router.replace("/");
      return;
    }

    if (userInfo?.authority === "ADMIN") {
      const load = async () => {
        try {
          const response = await adminGetHomeLayout(userInfo);
          const draft = normalizeHomeLayout(response?.data?.draft || createDefaultHomeLayout());
          const published = normalizeHomeLayout(
            response?.data?.published || createDefaultHomeLayout()
          );
          setLayout(draft);
          setPublishedLayout(published);
          setDraftMeta({
            draftUpdatedAt: response?.data?.draftUpdatedAt || null,
            publishedAt: response?.data?.publishedAt || null,
          });

          const firstBlockId =
            draft.rows?.[0]?.columns?.[0]?.blocks?.[0]?.id || null;
          setSelectedBlockId(firstBlockId);
          setSelectedColumnTarget({
            rowId: draft.rows?.[0]?.id,
            columnId: draft.rows?.[0]?.columns?.[0]?.id,
          });
        } catch (error) {
          console.error("Failed to load home builder:", error);
          alert("홈 빌더 데이터를 불러오지 못했습니다.");
        } finally {
          setLoading(false);
        }
      };

      load();
    }
  }, [router, userInfo]);

  useEffect(() => {
    return () => {
      if (dragPreviewRef.current?.isConnected) {
        dragPreviewRef.current.remove();
      }
      dragPreviewRef.current = null;
    };
  }, []);

  const selectedBlockLocation = useMemo(
    () => findBlockLocation(layout, selectedBlockId),
    [layout, selectedBlockId]
  );
  const selectedBlock = selectedBlockLocation?.block || null;
  const selectedBlockLocked = isLockedBlock(selectedBlock);
  const draggingBlockLocation = useMemo(
    () => (draggingBlockId ? findBlockLocation(layout, draggingBlockId) : null),
    [layout, draggingBlockId]
  );
  const palette = useMemo(() => getPaletteAvailability(layout), [layout]);

  const updateSelectedBlock = (nextProps) => {
    if (!selectedBlockLocation) {
      return;
    }

    setLayout((current) => {
      const next = cloneLayout(current);
      const row = next.rows.find((item) => item.id === selectedBlockLocation.rowId);
      const column = row?.columns.find((item) => item.id === selectedBlockLocation.columnId);
      const block = column?.blocks.find((item) => item.id === selectedBlockLocation.block.id);
      if (!block) {
        return current;
      }
      block.props = {
        ...(block.props || {}),
        ...nextProps,
      };
      return next;
    });
  };

  const addRow = (layoutType) => {
    const nextRow = createRow(layoutType);
    setLayout((current) => ({
      rows: [...normalizeHomeLayout(current).rows, nextRow],
    }));
    setSelectedColumnTarget({
      rowId: nextRow.id,
      columnId: nextRow.columns[0].id,
    });
  };

  const addBlockToColumn = (type, rowId, columnId) => {
    const paletteItem = BLOCK_LIBRARY.find((item) => item.type === type);
    if (!paletteItem) {
      return;
    }

    if (paletteItem.unique && palette.some((item) => item.type === type && item.disabled)) {
      alert("이 블록은 한 번만 배치할 수 있습니다.");
      return;
    }

    const nextBlock = createDefaultBlock(type);
    setLayout((current) => {
      const next = cloneLayout(current);
      const column = findColumn(next, rowId, columnId).column;
      if (!column) {
        return current;
      }
      column.blocks.push(nextBlock);
      return next;
    });
    setSelectedBlockId(nextBlock.id);
    setSelectedColumnTarget({ rowId, columnId });
  };

  const deleteSelectedBlock = () => {
    if (!selectedBlockLocation || selectedBlockLocked) {
      return;
    }

    setLayout((current) =>
      deleteBlockFromLayout(
        current,
        selectedBlockLocation.rowId,
        selectedBlockLocation.columnId,
        selectedBlockLocation.block.id
      )
    );
    setSelectedBlockId(null);
  };

  const deleteRow = (rowId) => {
    setLayout((current) => {
      const nextRows = normalizeHomeLayout(current).rows.filter((row) => {
        if (row.id !== rowId) {
          return true;
        }
        return isLockedRow(row);
      });
      return {
        rows: nextRows,
      };
    });
    if (selectedBlockLocation?.rowId === rowId) {
      setSelectedBlockId(null);
    }
  };

  const updateRowLayout = (rowId, nextLayout) => {
    setLayout((current) => {
      const next = cloneLayout(current);
      next.rows = next.rows.map((row) =>
        row.id === rowId && !isLockedRow(row) ? adjustRowColumns(row, nextLayout) : row
      );
      return next;
    });
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      const response = await adminSaveHomeLayoutDraft(layout, userInfo);
      setLayout(normalizeHomeLayout(response?.data?.draft || layout));
      setPublishedLayout(
        normalizeHomeLayout(response?.data?.published || publishedLayout)
      );
      setDraftMeta({
        draftUpdatedAt: response?.data?.draftUpdatedAt || null,
        publishedAt: response?.data?.publishedAt || null,
      });
      alert("홈 초안을 저장했습니다.");
    } catch (error) {
      console.error("Failed to save draft:", error);
      alert("초안 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      setSaving(true);
      const response = await adminPublishHomeLayout(userInfo);
      const draft = normalizeHomeLayout(response?.data?.draft || layout);
      const published = normalizeHomeLayout(response?.data?.published || draft);
      setLayout(draft);
      setPublishedLayout(published);
      setDraftMeta({
        draftUpdatedAt: response?.data?.draftUpdatedAt || null,
        publishedAt: response?.data?.publishedAt || null,
      });
      alert("홈 레이아웃을 게시했습니다.");
    } catch (error) {
      console.error("Failed to publish layout:", error);
      alert("게시에 실패했습니다. 미완성 블록이 있는지 확인하세요.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDraft = async () => {
    try {
      setSaving(true);
      const response = await adminResetHomeLayoutDraft(userInfo);
      const draft = normalizeHomeLayout(response?.data?.draft || createDefaultHomeLayout());
      setLayout(draft);
      setPublishedLayout(
        normalizeHomeLayout(response?.data?.published || publishedLayout)
      );
      setDraftMeta({
        draftUpdatedAt: response?.data?.draftUpdatedAt || null,
        publishedAt: response?.data?.publishedAt || null,
      });
      setSelectedBlockId(draft.rows?.[0]?.columns?.[0]?.blocks?.[0]?.id || null);
      alert("게시된 레이아웃 기준으로 초안을 되돌렸습니다.");
    } catch (error) {
      console.error("Failed to reset draft:", error);
      alert("초안 되돌리기에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadMedia = async (event, kind) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setUploading(true);
      const response = await adminUploadHomeLayoutMedia(file, userInfo);
      if (kind === "image") {
        updateSelectedBlock({
          fileUrl: response?.data?.fileUrl || "",
          alt: selectedBlock?.props?.alt || file.name,
        });
      } else {
        updateSelectedBlock({
          fileUrl: response?.data?.fileUrl || "",
          sourceType: "uploadedFile",
        });
      }
    } catch (error) {
      console.error("Failed to upload media:", error);
      alert("미디어 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handlePaletteDragStart = (event, type) => {
    setBlockDropPreview(null);
    event.dataTransfer.setData(
      "application/monthlyib-home",
      JSON.stringify({ kind: "palette", type })
    );
  };

  const syncDragPreview = (event, element) => {
    if (!element || typeof document === "undefined") {
      return;
    }

    if (dragPreviewRef.current?.isConnected) {
      dragPreviewRef.current.remove();
    }

    const rect = element.getBoundingClientRect();
    const clone = element.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";
    clone.style.width = `${rect.width}px`;
    clone.style.pointerEvents = "none";
    clone.style.opacity = "0.96";
    clone.style.transform = `scale(${DRAG_PREVIEW_SCALE})`;
    clone.style.transformOrigin = "top left";
    clone.style.boxShadow = "0 18px 42px rgba(32, 20, 49, 0.24)";
    clone.style.zIndex = "9999";
    document.body.appendChild(clone);
    dragPreviewRef.current = clone;
    event.dataTransfer.setDragImage(
      clone,
      Math.min(72, (rect.width * DRAG_PREVIEW_SCALE) / 2),
      Math.min(44, (rect.height * DRAG_PREVIEW_SCALE) / 2)
    );
  };

  const handleDragEnd = () => {
    setDraggingRowId(null);
    setDraggingBlockId(null);
    setBlockDropPreview(null);
    if (dragPreviewRef.current?.isConnected) {
      dragPreviewRef.current.remove();
    }
    dragPreviewRef.current = null;
  };

  const autoScrollByPointer = (clientY) => {
    if (typeof window === "undefined") {
      return;
    }

    if (clientY < DRAG_SCROLL_EDGE) {
      const ratio = (DRAG_SCROLL_EDGE - clientY) / DRAG_SCROLL_EDGE;
      window.scrollBy({ top: -Math.ceil(ratio * DRAG_SCROLL_MAX_STEP), behavior: "auto" });
      return;
    }

    const distanceToBottom = window.innerHeight - clientY;
    if (distanceToBottom < DRAG_SCROLL_EDGE) {
      const ratio = (DRAG_SCROLL_EDGE - distanceToBottom) / DRAG_SCROLL_EDGE;
      window.scrollBy({ top: Math.ceil(ratio * DRAG_SCROLL_MAX_STEP), behavior: "auto" });
    }
  };

  const handleWorkspaceDragOver = (event) => {
    autoScrollByPointer(event.clientY);
  };

  const getBlockInsertIndex = (event, blockIndex) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const isLowerHalf = event.clientY >= rect.top + rect.height / 2;
    return isLowerHalf ? blockIndex + 1 : blockIndex;
  };

  const updateBlockPreview = (event, rowId, columnId, blockIndex = null) => {
    const payload = readDragPayload(event);
    if (!payload || payload.kind !== "block") {
      return;
    }

    const column = findColumn(layout, rowId, columnId).column;
    const nextIndex =
      typeof blockIndex === "number"
        ? getBlockInsertIndex(event, blockIndex)
        : (column?.blocks?.length ?? 0);

    setBlockDropPreview({
      rowId,
      columnId,
      blockIndex: nextIndex,
    });
  };

  const getRenderableBlocks = (rowId, columnId, blocks) => {
    const previewActive =
      draggingBlockId &&
      blockDropPreview?.rowId === rowId &&
      blockDropPreview?.columnId === columnId;
    const hasDropPreview = Boolean(draggingBlockId && blockDropPreview);
    const draggingInColumn =
      draggingBlockLocation?.rowId === rowId &&
      draggingBlockLocation?.columnId === columnId;

    const visibleBlocks = draggingInColumn && hasDropPreview
      ? blocks.filter((block) => block.id !== draggingBlockId)
      : blocks;

    const items = visibleBlocks.map((block) => ({
      kind: "block",
      key: block.id,
      block,
    }));

    if (!previewActive) {
      return items;
    }

    let insertIndex = blockDropPreview.blockIndex ?? visibleBlocks.length;
    if (
      draggingInColumn &&
      typeof draggingBlockLocation?.blockIndex === "number" &&
      draggingBlockLocation.blockIndex < insertIndex
    ) {
      insertIndex -= 1;
    }

    insertIndex = clamp(insertIndex, 0, visibleBlocks.length);
    items.splice(insertIndex, 0, {
      kind: "placeholder",
      key: `placeholder-${rowId}-${columnId}-${insertIndex}`,
    });

    return items;
  };

  const handleRowDragStart = (event, rowId) => {
    const currentRow = layout.rows.find((row) => row.id === rowId);
    if (isLockedRow(currentRow)) {
      event.preventDefault();
      return;
    }
    const rowPreviewElement =
      event.currentTarget?.closest?.(`.${styles.canvasRow}`) || event.currentTarget;
    syncDragPreview(event, rowPreviewElement);
    setBlockDropPreview(null);
    setDraggingRowId(rowId);
    setDraggingBlockId(null);
    event.dataTransfer.setData(
      "application/monthlyib-home",
      JSON.stringify({ kind: "row", rowId })
    );
  };

  const handleBlockDragStart = (event, rowId, columnId, blockId) => {
    const currentBlock = findBlockLocation(layout, blockId)?.block;
    if (isLockedBlock(currentBlock)) {
      event.preventDefault();
      return;
    }
    syncDragPreview(event, event.currentTarget);
    setBlockDropPreview(null);
    setDraggingBlockId(blockId);
    setDraggingRowId(null);
    event.dataTransfer.setData(
      "application/monthlyib-home",
      JSON.stringify({ kind: "block", rowId, columnId, blockId })
    );
  };

  const readDragPayload = (event) => {
    try {
      return JSON.parse(
        event.dataTransfer.getData("application/monthlyib-home")
      );
    } catch (error) {
      return null;
    }
  };

  const handleDropOnRow = (event, targetRowId) => {
    event.preventDefault();
    const payload = readDragPayload(event);
    if (payload?.kind !== "row") {
      return;
    }
    const sourceRow = layout.rows.find((row) => row.id === payload.rowId);
    const targetRow = layout.rows.find((row) => row.id === targetRowId);
    if (isLockedRow(sourceRow) || isLockedRow(targetRow)) {
      return;
    }
    setBlockDropPreview(null);
    setLayout((current) => moveRow(current, payload.rowId, targetRowId));
  };

  const handleDropOnColumn = (event, rowId, columnId) => {
    event.preventDefault();
    const payload = readDragPayload(event);
    if (!payload) {
      return;
    }

    if (payload.kind === "palette") {
      setBlockDropPreview(null);
      addBlockToColumn(payload.type, rowId, columnId);
      return;
    }

    if (payload.kind === "block") {
      const column = findColumn(layout, rowId, columnId).column;
      const targetIndex = blockDropPreview?.rowId === rowId &&
        blockDropPreview?.columnId === columnId
        ? blockDropPreview.blockIndex
        : (column?.blocks?.length ?? 0);

      setLayout((current) =>
        moveBlock(current, payload, {
          rowId,
          columnId,
          blockIndex: targetIndex,
        })
      );
      setBlockDropPreview(null);
      setSelectedBlockId(payload.blockId);
      setSelectedColumnTarget({ rowId, columnId });
    }
  };

  const handleDropOnBlock = (event, rowId, columnId, blockIndex) => {
    event.preventDefault();
    const payload = readDragPayload(event);
    if (!payload || payload.kind !== "block") {
      return;
    }

    const targetIndex =
      blockDropPreview?.rowId === rowId && blockDropPreview?.columnId === columnId
        ? blockDropPreview.blockIndex
        : getBlockInsertIndex(event, blockIndex);

    setLayout((current) =>
      moveBlock(current, payload, {
        rowId,
        columnId,
        blockIndex: targetIndex,
      })
    );
    setBlockDropPreview(null);
    setSelectedBlockId(payload.blockId);
  };

  if (!userInfo?.authority) {
    return null;
  }

  if (userInfo.authority !== "ADMIN") {
    return null;
  }

  if (loading) {
    return (
      <main className={styles.builderPage}>
        <section className={styles.builderHero}>
          <div className={styles.builderHeroCopy}>
            <span className={styles.builderEyebrow}>Home Builder</span>
            <h1>홈 빌더를 불러오는 중입니다</h1>
            <p>현재 저장된 초안과 게시본 레이아웃을 준비하고 있습니다.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.builderPage} onDragOverCapture={handleWorkspaceDragOver}>
      <section className={styles.builderHero}>
        <div className={styles.builderHeroCopy}>
          <span className={styles.builderEyebrow}>Monthly IB Home Builder</span>
          <h1>홈 레이아웃 편집기</h1>
          <p>
            행과 열을 추가하고, 모듈을 드래그해 홈 화면을 조합하세요.
            저장은 초안만 갱신하고, 게시 버튼을 눌러야 실제 홈에 반영됩니다.
          </p>
        </div>
        <div className={styles.builderHeroMeta}>
          <div className={styles.metaCard}>
            <span>Rows</span>
            <strong>{layout.rows.length}</strong>
          </div>
          <div className={styles.metaCard}>
            <span>Last Published</span>
            <strong>{draftMeta.publishedAt ? "게시됨" : "미게시"}</strong>
          </div>
        </div>
      </section>

      <section className={styles.builderActionsBar}>
        <div className={styles.builderActionsCopy}>
          <h2>작업 도구</h2>
          <p>초안 저장, 게시, 게시본 되돌리기를 여기서 먼저 실행한 뒤 캔버스를 편집하세요.</p>
        </div>
        <div className={styles.toolbarButtons}>
          <button
            type="button"
            className={styles.plainButton}
            onClick={handleResetDraft}
            disabled={saving}
          >
            게시본으로 되돌리기
          </button>
          <button
            type="button"
            className={`${styles.plainButton} ${styles.saveButton}`}
            onClick={handleSaveDraft}
            disabled={saving}
          >
            {saving ? "저장 중..." : "초안 저장"}
          </button>
          <button
            type="button"
            className={`${styles.plainButton} ${styles.saveButton}`}
            onClick={handlePublish}
            disabled={saving}
          >
            게시
          </button>
        </div>
      </section>

      <section className={styles.builderSurface}>
        {/* ── 왼쪽 통합 패널 ── */}
        <aside className={styles.panel}>
          {/* 탭 */}
          <div className={styles.panelTabs}>
            <button
              type="button"
              className={`${styles.panelTab} ${leftTab === "palette" ? styles.active : ""}`}
              onClick={() => setLeftTab("palette")}
            >
              모듈 팔레트
            </button>
            <button
              type="button"
              className={`${styles.panelTab} ${leftTab === "inspector" ? styles.active : ""}`}
              onClick={() => setLeftTab("inspector")}
            >
              속성
              {selectedBlock && (
                <span className={styles.panelTabBadge}>●</span>
              )}
            </button>
          </div>

          {/* 팔레트 탭 */}
          {leftTab === "palette" && (
            <>
              <div className={styles.panelHeader}>
                <div>
                  <h2>행 추가</h2>
                  <p>열 구성을 선택해 새 행을 추가합니다.</p>
                </div>
              </div>
              <div className={styles.rowActions}>
                {HOME_LAYOUT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => addRow(option.value)}
                  >
                    {option.label} 행 추가
                  </button>
                ))}
              </div>

              <div className={styles.panelHeader}>
                <div>
                  <h2>모듈</h2>
                  <p>열을 선택한 뒤 클릭하거나 캔버스로 드래그하세요.</p>
                </div>
              </div>
              <div className={styles.paletteList}>
                {palette.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    draggable={!item.disabled}
                    disabled={item.disabled}
                    className={styles.paletteButton}
                    onDragStart={(event) => handlePaletteDragStart(event, item.type)}
                    onClick={() => {
                      if (!selectedColumnTarget) {
                        alert("먼저 블록을 넣을 열을 선택하세요.");
                        return;
                      }
                      addBlockToColumn(
                        item.type,
                        selectedColumnTarget.rowId,
                        selectedColumnTarget.columnId
                      );
                    }}
                  >
                    <span>{item.label}</span>
                    <small>{item.description}</small>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* 속성 탭 */}
          {leftTab === "inspector" && (
            <>
              {!selectedBlock ? (
                <div className={styles.inspectorHint}>
                  블록을 하나 선택하면 제목, 설명, 링크, 파일 업로드, 버튼 스타일 등
                  관련 속성이 여기에 표시됩니다.
                </div>
              ) : selectedBlockLocked ? (
                <div className={styles.inspectorBody}>
                  <div className={styles.inspectorHint}>
                    기존 히어로는 홈의 고정 핵심 섹션이라 빌더에서 위치나 내용을 변경할 수 없습니다.
                    상단 메인 화면은 실제 홈 컴포넌트에서만 관리됩니다.
                  </div>
                  <Link href="/" className={styles.plainButton}>
                    실제 홈 보기
                  </Link>
                </div>
              ) : (
                <div className={styles.inspectorBody}>
                  {(selectedBlock.type === "existingSearch" ||
                    selectedBlock.type === "existingGuideLinks" ||
                    selectedBlock.type === "existingMemberActivity" ||
                    selectedBlock.type === "existingReviewCarousel") && (
                    <div className={styles.inspectorGroup}>
                      <label>섹션 제목</label>
                      <input
                        type="text"
                        value={selectedBlock.props?.title || ""}
                        onChange={(event) => updateSelectedBlock({ title: event.target.value })}
                      />
                    </div>
                  )}

                  {selectedBlock.type === "richText" && (
                    <>
                      <div className={styles.inspectorGroup}>
                        <label>텍스트 블록 제목</label>
                        <input
                          type="text"
                          value={selectedBlock.props?.title || ""}
                          onChange={(event) => updateSelectedBlock({ title: event.target.value })}
                        />
                      </div>
                      <div className={`${styles.inspectorGroup} ${styles.editorWrap}`}>
                        <label>본문</label>
                        <EditorComponents
                          styleName=""
                          content={selectedBlock.props?.html || "<p></p>"}
                          setContent={(value) => updateSelectedBlock({ html: value })}
                        />
                      </div>
                    </>
                  )}

                  {selectedBlock.type === "image" && (
                    <>
                      <div className={styles.inspectorGroup}>
                        <label>이미지 업로드</label>
                        <div className={styles.uploadRow}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleUploadMedia(event, "image")}
                          />
                        </div>
                        <div className={styles.uploadStatus}>
                          {uploading ? "업로드 중..." : selectedBlock.props?.fileUrl || "업로드된 파일이 없습니다."}
                        </div>
                      </div>
                      <div className={styles.inspectorGroup}>
                        <label>대체 텍스트</label>
                        <input
                          type="text"
                          value={selectedBlock.props?.alt || ""}
                          onChange={(event) => updateSelectedBlock({ alt: event.target.value })}
                        />
                      </div>
                      <div className={styles.inspectorGroup}>
                        <label>캡션</label>
                        <textarea
                          value={selectedBlock.props?.caption || ""}
                          onChange={(event) => updateSelectedBlock({ caption: event.target.value })}
                        />
                      </div>
                      <div className={styles.inspectorGroup}>
                        <label>이미지 링크</label>
                        <input
                          type="text"
                          value={selectedBlock.props?.linkUrl || ""}
                          onChange={(event) => updateSelectedBlock({ linkUrl: event.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {selectedBlock.type === "video" && (
                    <>
                      <div className={styles.inspectorGroup}>
                        <label>영상 소스</label>
                        <select
                          value={selectedBlock.props?.sourceType || "embedUrl"}
                          onChange={(event) =>
                            updateSelectedBlock({ sourceType: event.target.value })
                          }
                        >
                          <option value="embedUrl">URL 임베드</option>
                          <option value="uploadedFile">파일 업로드</option>
                        </select>
                      </div>

                      {selectedBlock.props?.sourceType !== "uploadedFile" ? (
                        <div className={styles.inspectorGroup}>
                          <label>임베드 URL</label>
                          <input
                            type="text"
                            value={selectedBlock.props?.embedUrl || ""}
                            onChange={(event) => updateSelectedBlock({ embedUrl: event.target.value })}
                            placeholder="https://youtu.be/... 또는 https://player.vimeo.com/..."
                          />
                        </div>
                      ) : (
                        <div className={styles.inspectorGroup}>
                          <label>영상 파일 업로드</label>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(event) => handleUploadMedia(event, "video")}
                          />
                          <div className={styles.uploadStatus}>
                            {uploading ? "업로드 중..." : selectedBlock.props?.fileUrl || "업로드된 영상이 없습니다."}
                          </div>
                        </div>
                      )}

                      <div className={styles.inspectorGroup}>
                        <label>캡션</label>
                        <textarea
                          value={selectedBlock.props?.caption || ""}
                          onChange={(event) => updateSelectedBlock({ caption: event.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {selectedBlock.type === "button" && (
                    <>
                      <div className={styles.inspectorGroup}>
                        <label>버튼 라벨</label>
                        <input
                          type="text"
                          value={selectedBlock.props?.label || ""}
                          onChange={(event) => updateSelectedBlock({ label: event.target.value })}
                        />
                      </div>
                      <div className={styles.inspectorGroup}>
                        <label>링크</label>
                        <input
                          type="text"
                          value={selectedBlock.props?.href || ""}
                          onChange={(event) => updateSelectedBlock({ href: event.target.value })}
                        />
                      </div>
                      <div className={styles.inspectorGroup}>
                        <label>버튼 스타일</label>
                        <select
                          value={selectedBlock.props?.variant || "primary"}
                          onChange={(event) => updateSelectedBlock({ variant: event.target.value })}
                        >
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                          <option value="ghost">Ghost</option>
                        </select>
                      </div>
                    </>
                  )}

                  {selectedBlock.type === "spacer" && (
                    <div className={styles.inspectorGroup}>
                      <label>공백 높이(px)</label>
                      <input
                        type="number"
                        min={12}
                        max={320}
                        value={selectedBlock.props?.height || 48}
                        onChange={(event) =>
                          updateSelectedBlock({
                            height: Number(event.target.value || 48),
                          })
                        }
                      />
                    </div>
                  )}

                  <div className={styles.inspectorHint}>
                    저장은 초안만 변경합니다. 실제 홈 반영은 상단의 게시 버튼을 눌러야 합니다.
                    <br />
                    Draft: {draftMeta.draftUpdatedAt || "없음"}
                    <br />
                    Published: {draftMeta.publishedAt || "없음"}
                  </div>

                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={deleteSelectedBlock}
                  >
                    현재 블록 삭제
                  </button>

                  <Link href="/" className={styles.plainButton}>
                    실제 홈 보기
                  </Link>
                </div>
              )}
            </>
          )}
        </aside>

        {/* ── 캔버스 패널 ── */}
        <section className={styles.canvasPanel}>
          <div className={styles.canvasHeader}>
            <div>
              <h2>캔버스 미리보기</h2>
              <p>블록을 클릭하면 왼쪽 속성 탭에서 수정할 수 있습니다.</p>
            </div>
            <span className={styles.canvasScaleBadge}>패널 폭 기준 미리보기</span>
          </div>

          <div className={styles.canvasViewportWrap}>
            <div className={styles.canvasScaleWrap}>
              <div className={styles.canvasRows}>
                {layout.rows.map((row) => {
                  const rowLocked = isLockedRow(row);
                  return (
                  <div
                    key={row.id}
                    className={styles.canvasRow}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleDropOnRow(event, row.id)}
                  >
                    <div
                      className={`${styles.rowHeader} ${!rowLocked ? styles.rowHeaderDraggable : ""} ${
                        draggingRowId === row.id ? styles.rowDragging : ""
                      }`}
                      draggable={!rowLocked}
                      onDragStart={(event) => handleRowDragStart(event, row.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className={styles.rowHeaderLeft}>
                        <div className={styles.dragHandle}>↕</div>
                        <div className={styles.rowMeta}>
                          <span>Row</span>
                          <strong>{HOME_LAYOUT_OPTIONS.find((item) => item.value === row.layout)?.label}</strong>
                        </div>
                      </div>
                      <div className={styles.rowHeaderRight}>
                        <select
                          value={row.layout}
                          disabled={rowLocked}
                          onClick={(event) => event.stopPropagation()}
                          onChange={(event) => updateRowLayout(row.id, event.target.value)}
                        >
                          {HOME_LAYOUT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className={styles.dangerButton}
                          disabled={rowLocked}
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteRow(row.id);
                          }}
                        >
                          {rowLocked ? "고정 행" : "행 삭제"}
                        </button>
                      </div>
                    </div>

                    <div className={`${styles.rowGrid} ${styles[`rowGrid_${row.layout}`]}`}>
                      {row.columns.map((column, columnIndex) => (
                        <div
                          key={column.id}
                          className={`${styles.canvasColumn} ${
                            selectedColumnTarget?.columnId === column.id ? styles.canvasColumnActive : ""
                          } ${
                            blockDropPreview?.rowId === row.id &&
                            blockDropPreview?.columnId === column.id
                              ? styles.canvasColumnPreview
                              : ""
                          }`}
                          onClick={() => setSelectedColumnTarget({ rowId: row.id, columnId: column.id })}
                          onDragOver={(event) => {
                            event.preventDefault();
                            updateBlockPreview(event, row.id, column.id);
                          }}
                          onDrop={(event) => handleDropOnColumn(event, row.id, column.id)}
                        >
                          <div className={styles.columnHeader}>
                            <div>
                              <strong>{columnIndex + 1}열</strong>
                              <span>{column.blocks.length} blocks</span>
                            </div>
                            <button
                              type="button"
                              className={styles.columnAction}
                              onClick={() => setSelectedColumnTarget({ rowId: row.id, columnId: column.id })}
                            >
                              선택
                            </button>
                          </div>

                          <div className={styles.columnBlocks}>
                            {getRenderableBlocks(row.id, column.id, column.blocks).length === 0 ? (
                              <div className={styles.emptyColumn}>
                                여기에 모듈을 드롭하거나 왼쪽 팔레트에서 추가하세요.
                              </div>
                            ) : (
                              getRenderableBlocks(row.id, column.id, column.blocks).map((item, blockIndex) => {
                                if (item.kind === "placeholder") {
                                  return (
                                  <div
                                    key={item.key}
                                    className={styles.blockDropPlaceholder}
                                  >
                                    <span>여기에 배치</span>
                                  </div>
                                  );
                                }

                                const actualBlockIndex =
                                  findBlockLocation(layout, item.block.id)?.blockIndex ?? blockIndex;

                                return (
                                <div
                                  key={item.block.id}
                                  className={`${styles.canvasBlock} ${
                                    selectedBlockId === item.block.id ? styles.canvasBlockSelected : ""
                                  } ${!isLockedBlock(item.block) ? styles.canvasBlockDraggable : ""} ${
                                    draggingBlockId === item.block.id ? styles.blockDragging : ""
                                  }`}
                                  draggable={!isLockedBlock(item.block)}
                                  onDragStart={(event) =>
                                    handleBlockDragStart(event, row.id, column.id, item.block.id)
                                  }
                                  onDragEnd={handleDragEnd}
                                  onDragOver={(event) => {
                                    event.preventDefault();
                                    updateBlockPreview(event, row.id, column.id, actualBlockIndex);
                                  }}
                                  onDrop={(event) =>
                                    handleDropOnBlock(event, row.id, column.id, actualBlockIndex)
                                  }
                                  onClick={() => {
                                    setSelectedBlockId(item.block.id);
                                    setSelectedColumnTarget({ rowId: row.id, columnId: column.id });
                                  }}
                                >
                                  <div className={styles.blockHeader}>
                                    <div>
                                      <span>{item.block.type}</span>
                                      <strong>
                                        {BLOCK_LIBRARY.find((blockItem) => blockItem.type === item.block.type)?.label || item.block.type}
                                      </strong>
                                    </div>
                                    <button
                                      type="button"
                                      className={styles.dangerButton}
                                      disabled={isLockedBlock(item.block)}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setLayout((current) =>
                                          deleteBlockFromLayout(current, row.id, column.id, item.block.id)
                                        );
                                        if (selectedBlockId === item.block.id) {
                                          setSelectedBlockId(null);
                                        }
                                      }}
                                    >
                                      {isLockedBlock(item.block) ? "고정 블록" : "삭제"}
                                    </button>
                                  </div>
                                  <div className={styles.blockPreview}>
                                    <div className={styles.blockPreviewInner}>
                                      <HomeBlockContent block={item.block} previewMode compactPreview />
                                    </div>
                                  </div>
                                </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default HomeBuilder;
