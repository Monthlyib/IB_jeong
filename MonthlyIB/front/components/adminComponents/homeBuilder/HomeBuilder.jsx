"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styles from "./HomeBuilder.module.css";
import {
  BLOCK_LIBRARY,
  HOME_LAYOUT_OPTIONS,
  createDefaultBlock,
  createDefaultHomeLayout,
  createEmptyColumn,
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

const ROWS_DROPPABLE_ID = "builder-rows";
const ROW_DRAGGABLE_PREFIX = "row:";
const BLOCK_DRAGGABLE_PREFIX = "block:";
const PALETTE_DRAG_MIME = "application/monthlyib-home-builder-palette";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const isLockedBlock = (block) => block?.type === "existingHero";

const isLockedRow = (row) =>
  row?.columns?.some((column) => column.blocks?.some((block) => isLockedBlock(block)));

const getMinimumInsertIndex = (column) =>
  column?.blocks?.[0] && isLockedBlock(column.blocks[0]) ? 1 : 0;

const normalizeInsertIndex = (column, insertIndex, maxLength = column?.blocks?.length ?? 0) =>
  clamp(insertIndex, getMinimumInsertIndex(column), maxLength);

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
  const minimumInsertIndex = getMinimumInsertIndex(targetColumn);

  if (source.rowId === target.rowId && source.columnId === target.columnId && sourceIndex < insertIndex) {
    insertIndex -= 1;
  }

  insertIndex = clamp(insertIndex, minimumInsertIndex, targetColumn.blocks.length);

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

const createColumnDroppableId = (rowId, columnId) => `column:${rowId}:${columnId}`;

const parseColumnDroppableId = (droppableId) => {
  const parts = droppableId.split(":");
  if (parts.length !== 3 || parts[0] !== "column") {
    return null;
  }
  return {
    rowId: parts[1],
    columnId: parts[2],
  };
};

const getBlockIdFromDraggableId = (draggableId) =>
  draggableId.startsWith(BLOCK_DRAGGABLE_PREFIX)
    ? draggableId.slice(BLOCK_DRAGGABLE_PREFIX.length)
    : null;

const getRowIdFromDraggableId = (draggableId) =>
  draggableId.startsWith(ROW_DRAGGABLE_PREFIX)
    ? draggableId.slice(ROW_DRAGGABLE_PREFIX.length)
    : null;

const readPaletteDragType = (event) => {
  const raw = event.dataTransfer?.getData(PALETTE_DRAG_MIME);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed?.kind === "palette" ? parsed.type : null;
  } catch (_error) {
    return null;
  }
};

const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(frame);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
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
  const [nativePaletteTarget, setNativePaletteTarget] = useState(null);

  // 왼쪽 패널 탭: "palette" | "inspector"
  const [leftTab, setLeftTab] = useState("palette");

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

  const selectedBlockLocation = useMemo(
    () => findBlockLocation(layout, selectedBlockId),
    [layout, selectedBlockId]
  );
  const selectedBlock = selectedBlockLocation?.block || null;
  const selectedBlockLocked = isLockedBlock(selectedBlock);
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

  const insertPaletteBlock = (layoutState, type, rowId, columnId, blockIndex = null) => {
    const next = cloneLayout(layoutState);
    const column = findColumn(next, rowId, columnId).column;
    if (!column) {
      return { layout: layoutState, insertedBlockId: null };
    }

    const nextBlock = createDefaultBlock(type);
    const insertIndex =
      typeof blockIndex === "number"
        ? normalizeInsertIndex(column, blockIndex)
        : column.blocks.length;

    column.blocks.splice(insertIndex, 0, nextBlock);
    return { layout: next, insertedBlockId: nextBlock.id };
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

  const handlePaletteDragStart = (event, item) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData(
      PALETTE_DRAG_MIME,
      JSON.stringify({ kind: "palette", type: item.type })
    );
    event.dataTransfer.setData("text/plain", item.type);
  };

  const handlePaletteDragEnd = () => {
    setNativePaletteTarget(null);
  };

  const handleColumnPaletteDragOver = (event, rowId, columnId) => {
    const paletteType = readPaletteDragType(event);
    if (!paletteType) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";

    if (
      nativePaletteTarget?.rowId !== rowId ||
      nativePaletteTarget?.columnId !== columnId
    ) {
      setNativePaletteTarget({ rowId, columnId });
    }
  };

  const handleColumnPaletteDrop = (event, rowId, columnId) => {
    const paletteType = readPaletteDragType(event);
    if (!paletteType) {
      return;
    }

    event.preventDefault();
    setNativePaletteTarget(null);

    const paletteItem = palette.find((item) => item.type === paletteType);
    if (!paletteItem) {
      return;
    }

    if (paletteItem.disabled) {
      alert("이 블록은 한 번만 배치할 수 있습니다.");
      return;
    }

    let insertedBlockId = null;
    setLayout((current) => {
      const result = insertPaletteBlock(current, paletteType, rowId, columnId);
      insertedBlockId = result.insertedBlockId;
      return result.layout;
    });
    setSelectedBlockId(insertedBlockId);
    setSelectedColumnTarget({ rowId, columnId });
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "ROW") {
      const sourceRowId = getRowIdFromDraggableId(draggableId);
      const targetRow = layout.rows[destination.index];
      const sourceRow = layout.rows[source.index];

      if (!sourceRowId || !targetRow || isLockedRow(sourceRow) || isLockedRow(targetRow)) {
        return;
      }

      setLayout((current) => moveRow(current, sourceRowId, targetRow.id));
      return;
    }

    if (type !== "BLOCK") {
      return;
    }

    const targetLocation = parseColumnDroppableId(destination.droppableId);
    if (!targetLocation) {
      return;
    }

    const blockId = getBlockIdFromDraggableId(draggableId);
    const sourceLocation = parseColumnDroppableId(source.droppableId);
    const currentBlock = blockId ? findBlockLocation(layout, blockId)?.block : null;

    if (!blockId || !sourceLocation || isLockedBlock(currentBlock)) {
      return;
    }

    setLayout((current) =>
      moveBlock(
        current,
        {
          rowId: sourceLocation.rowId,
          columnId: sourceLocation.columnId,
          blockId,
        },
        {
          rowId: targetLocation.rowId,
          columnId: targetLocation.columnId,
          blockIndex: destination.index,
        }
      )
    );
    setSelectedBlockId(blockId);
    setSelectedColumnTarget(targetLocation);
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
    <main className={styles.builderPage}>
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

      <DragDropContext onDragEnd={handleDragEnd}>
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
                    onDragStart={(event) => handlePaletteDragStart(event, item)}
                    onDragEnd={handlePaletteDragEnd}
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
            <span className={styles.canvasScaleBadge}>확대 미리보기</span>
          </div>

          <div className={styles.canvasViewportWrap}>
            <div className={styles.canvasScaleWrap}>
              <StrictModeDroppable
                droppableId={ROWS_DROPPABLE_ID}
                type="ROW"
                renderClone={(provided, _snapshot, rubric) => {
                  const row = layout.rows[rubric.source.index];
                  if (!row) {
                    return null;
                  }
                  const rowLocked = isLockedRow(row);
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={provided.draggableProps.style}
                      className={`${styles.canvasRow} ${styles.dragClone}`}
                    >
                      <div className={`${styles.rowHeader} ${!rowLocked ? styles.rowHeaderDraggable : ""}`}>
                        <div className={styles.rowHeaderLeft}>
                          <div
                            className={styles.dragHandle}
                            {...(!rowLocked ? provided.dragHandleProps : {})}
                          >
                            ↕
                          </div>
                          <div className={styles.rowMeta}>
                            <span>Row</span>
                            <strong>
                              {HOME_LAYOUT_OPTIONS.find((item) => item.value === row.layout)?.label}
                            </strong>
                          </div>
                        </div>
                        <div className={styles.rowHeaderRight}>
                          <select value={row.layout} disabled>
                            {HOME_LAYOUT_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <button type="button" className={styles.dangerButton} disabled>
                            {rowLocked ? "고정 행" : "행 삭제"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }}
              >
                {(rowsProvided) => (
                  <div
                    className={styles.canvasRows}
                    ref={rowsProvided.innerRef}
                    {...rowsProvided.droppableProps}
                  >
                    {layout.rows.map((row, rowIndex) => {
                      const rowLocked = isLockedRow(row);
                      return (
                        <Draggable
                          key={row.id}
                          draggableId={`${ROW_DRAGGABLE_PREFIX}${row.id}`}
                          index={rowIndex}
                          isDragDisabled={rowLocked}
                        >
                          {(rowProvided, rowSnapshot) => (
                            <div
                              ref={rowProvided.innerRef}
                              {...rowProvided.draggableProps}
                              style={rowProvided.draggableProps.style}
                              className={`${styles.canvasRow} ${
                                rowSnapshot.isDragging ? styles.rowDragging : ""
                              }`}
                            >
                              <div
                                className={`${styles.rowHeader} ${
                                  !rowLocked ? styles.rowHeaderDraggable : ""
                                }`}
                              >
                                <div className={styles.rowHeaderLeft}>
                                  <div
                                    className={styles.dragHandle}
                                    {...(!rowLocked ? rowProvided.dragHandleProps : {})}
                                  >
                                    ↕
                                  </div>
                                  <div className={styles.rowMeta}>
                                    <span>Row</span>
                                    <strong>
                                      {
                                        HOME_LAYOUT_OPTIONS.find((item) => item.value === row.layout)
                                          ?.label
                                      }
                                    </strong>
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
                                  <StrictModeDroppable
                                    key={column.id}
                                    droppableId={createColumnDroppableId(row.id, column.id)}
                                    type="BLOCK"
                                    renderClone={(provided, _snapshot, rubric) => {
                                      const block = column.blocks[rubric.source.index];
                                      if (!block) {
                                        return null;
                                      }
                                      return (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...(!isLockedBlock(block)
                                            ? provided.dragHandleProps
                                            : {})}
                                          style={provided.draggableProps.style}
                                          className={`${styles.canvasBlock} ${styles.dragClone}`}
                                        >
                                          <div className={styles.blockHeader}>
                                            <div>
                                              <span>{block.type}</span>
                                              <strong>
                                                {BLOCK_LIBRARY.find(
                                                  (blockItem) => blockItem.type === block.type
                                                )?.label || block.type}
                                              </strong>
                                            </div>
                                            <button
                                              type="button"
                                              className={styles.dangerButton}
                                              disabled
                                            >
                                              {isLockedBlock(block) ? "고정 블록" : "삭제"}
                                            </button>
                                          </div>
                                          <div className={styles.blockPreview}>
                                            <div className={styles.blockPreviewInner}>
                                              <HomeBlockContent block={block} previewMode />
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }}
                                  >
                                    {(columnProvided, columnSnapshot) => (
                                      <div
                                        ref={columnProvided.innerRef}
                                        {...columnProvided.droppableProps}
                                        className={`${styles.canvasColumn} ${
                                          selectedColumnTarget?.columnId === column.id
                                            ? styles.canvasColumnActive
                                            : ""
                                        } ${
                                          columnSnapshot.isDraggingOver ||
                                          (nativePaletteTarget?.rowId === row.id &&
                                            nativePaletteTarget?.columnId === column.id)
                                            ? styles.canvasColumnPreview
                                            : ""
                                        }`}
                                        onDragOver={(event) =>
                                          handleColumnPaletteDragOver(event, row.id, column.id)
                                        }
                                        onDrop={(event) =>
                                          handleColumnPaletteDrop(event, row.id, column.id)
                                        }
                                        onClick={() =>
                                          setSelectedColumnTarget({ rowId: row.id, columnId: column.id })
                                        }
                                      >
                                        <div className={styles.columnHeader}>
                                          <div>
                                            <strong>{columnIndex + 1}열</strong>
                                            <span>{column.blocks.length} blocks</span>
                                          </div>
                                          <button
                                            type="button"
                                            className={styles.columnAction}
                                            onClick={() =>
                                              setSelectedColumnTarget({
                                                rowId: row.id,
                                                columnId: column.id,
                                              })
                                            }
                                          >
                                            선택
                                          </button>
                                        </div>

                                        <div className={styles.columnBlocks}>
                                          {column.blocks.length === 0 ? (
                                            <div className={styles.emptyColumn}>
                                              여기에 모듈을 드롭하거나 왼쪽 팔레트에서 추가하세요.
                                            </div>
                                          ) : null}

                                          {column.blocks.map((block, blockIndex) => (
                                            <Draggable
                                              key={block.id}
                                              draggableId={`${BLOCK_DRAGGABLE_PREFIX}${block.id}`}
                                              index={blockIndex}
                                              isDragDisabled={isLockedBlock(block)}
                                            >
                                              {(blockProvided, blockSnapshot) => (
                                                <div
                                                  ref={blockProvided.innerRef}
                                                  {...blockProvided.draggableProps}
                                                  {...(!isLockedBlock(block)
                                                    ? blockProvided.dragHandleProps
                                                    : {})}
                                                  style={blockProvided.draggableProps.style}
                                                  className={`${styles.canvasBlock} ${
                                                    selectedBlockId === block.id
                                                      ? styles.canvasBlockSelected
                                                      : ""
                                                  } ${
                                                    !isLockedBlock(block)
                                                      ? styles.canvasBlockDraggable
                                                      : ""
                                                  } ${
                                                    blockSnapshot.isDragging
                                                      ? styles.blockDragging
                                                      : ""
                                                  }`}
                                                  onClick={() => {
                                                    setSelectedBlockId(block.id);
                                                    setSelectedColumnTarget({
                                                      rowId: row.id,
                                                      columnId: column.id,
                                                    });
                                                  }}
                                                >
                                                  <div className={styles.blockHeader}>
                                                    <div>
                                                      <span>{block.type}</span>
                                                      <strong>
                                                        {BLOCK_LIBRARY.find(
                                                          (blockItem) => blockItem.type === block.type
                                                        )?.label || block.type}
                                                      </strong>
                                                    </div>
                                                    <button
                                                      type="button"
                                                      className={styles.dangerButton}
                                                      disabled={isLockedBlock(block)}
                                                      onClick={(event) => {
                                                        event.stopPropagation();
                                                        setLayout((current) =>
                                                          deleteBlockFromLayout(
                                                            current,
                                                            row.id,
                                                            column.id,
                                                            block.id
                                                          )
                                                        );
                                                        if (selectedBlockId === block.id) {
                                                          setSelectedBlockId(null);
                                                        }
                                                      }}
                                                    >
                                                      {isLockedBlock(block) ? "고정 블록" : "삭제"}
                                                    </button>
                                                  </div>
                                                  <div className={styles.blockPreview}>
                                                    <div className={styles.blockPreviewInner}>
                                                      <HomeBlockContent block={block} previewMode />
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                            </Draggable>
                                          ))}
                                          {columnProvided.placeholder}
                                        </div>
                                      </div>
                                    )}
                                  </StrictModeDroppable>
                                ))}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {rowsProvided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </div>
          </div>
        </section>
      </section>
      </DragDropContext>
    </main>
  );
};

export default HomeBuilder;
