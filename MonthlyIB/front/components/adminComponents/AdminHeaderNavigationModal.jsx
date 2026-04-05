"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styles from "./AdminStyle.module.css";
import {
  createHeaderNavigationDraftMenu,
  normalizeHeaderNavigationConfig,
  reindexHeaderNavigationMenus,
} from "@/utils/headerNavigationUtils";

const HEADER_TOP_DROPPABLE_ID = "header-top-level";
const HEADER_CHILD_DROPPABLE_PREFIX = "header-child:";
const HEADER_TOP_DRAGGABLE_PREFIX = "header-top:";
const HEADER_CHILD_DRAGGABLE_PREFIX = "header-child-item:";

const createChildDroppableId = (menuKey) =>
  `${HEADER_CHILD_DROPPABLE_PREFIX}${menuKey}`;

const createTopDraggableId = (menuKey) => `${HEADER_TOP_DRAGGABLE_PREFIX}${menuKey}`;
const createChildDraggableId = (menuKey, childKey) =>
  `${HEADER_CHILD_DRAGGABLE_PREFIX}${menuKey}:${childKey}`;

const parseChildDroppableId = (droppableId) =>
  droppableId.startsWith(HEADER_CHILD_DROPPABLE_PREFIX)
    ? droppableId.slice(HEADER_CHILD_DROPPABLE_PREFIX.length)
    : null;

const reorderItems = (items, startIndex, endIndex) => {
  const nextItems = [...items];
  const [moved] = nextItems.splice(startIndex, 1);
  nextItems.splice(endIndex, 0, moved);
  return nextItems;
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

const TopMenuPreviewChip = ({
  menu,
  isActive = false,
  isHidden = false,
  isDragging = false,
  provided = {},
  onClick,
}) => (
  <button
    ref={provided.innerRef}
    type="button"
    className={`${styles.headerNavPreviewMenu} ${
      isActive ? styles.headerNavPreviewMenuActive : ""
    } ${isHidden ? styles.headerNavPreviewMenuHidden : ""} ${
      isDragging ? styles.headerNavPreviewMenuDragging : ""
    }`}
    {...(provided.draggableProps || {})}
    {...(provided.dragHandleProps || {})}
    onClick={onClick}
  >
    <span className={styles.headerNavPreviewMenuText}>{menu.label || "새 메뉴"}</span>
    {menu.children?.length ? (
      <span className={styles.headerNavPreviewMenuArrow}>▾</span>
    ) : null}
  </button>
);

const ChildMenuPreviewRow = ({ child, isHidden = false, isDragging = false, provided = {} }) => (
  <div
    ref={provided.innerRef}
    className={`${styles.headerNavPreviewChildItem} ${
      isHidden ? styles.headerNavPreviewMenuHidden : ""
    } ${isDragging ? styles.headerNavPreviewMenuDragging : ""}`}
    {...(provided.draggableProps || {})}
    {...(provided.dragHandleProps || {})}
  >
    <span>{child.label || "새 하위 메뉴"}</span>
    <small>{child.external ? "외부 링크" : child.href || "/"}</small>
  </div>
);

const AdminHeaderNavigationModal = ({ config, onClose, onSave, saving }) => {
  const [draft, setDraft] = useState(normalizeHeaderNavigationConfig(config));
  const [previewMenuKey, setPreviewMenuKey] = useState(
    normalizeHeaderNavigationConfig(config).menus[0]?.key ?? ""
  );

  useEffect(() => {
    const normalized = normalizeHeaderNavigationConfig(config);
    setDraft(normalized);
    setPreviewMenuKey(normalized.menus[0]?.key ?? "");
  }, [config]);

  useEffect(() => {
    const hasPreviewMenu = draft.menus.some((menu) => menu.key === previewMenuKey);
    if (!hasPreviewMenu) {
      setPreviewMenuKey(draft.menus[0]?.key ?? "");
    }
  }, [draft.menus, previewMenuKey]);

  const updateMenus = (updater) => {
    setDraft((prev) => ({
      ...prev,
      menus: reindexHeaderNavigationMenus(updater(prev.menus)),
    }));
  };

  const handleDragEnd = (result) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "TOP_MENU") {
      updateMenus((menus) => reorderItems(menus, source.index, destination.index));
      return;
    }

    if (type !== "CHILD_MENU") {
      return;
    }

    const sourceMenuKey = parseChildDroppableId(source.droppableId);
    const destinationMenuKey = parseChildDroppableId(destination.droppableId);

    if (!sourceMenuKey || !destinationMenuKey || sourceMenuKey !== destinationMenuKey) {
      return;
    }

    updateMenus((menus) =>
      menus.map((menu) =>
        menu.key === sourceMenuKey
          ? {
              ...menu,
              children: reorderItems(menu.children || [], source.index, destination.index),
            }
          : menu
      )
    );
  };

  const updateMenu = (menuKey, field, value) => {
    updateMenus((menus) =>
      menus.map((menu) =>
        menu.key === menuKey
          ? {
              ...menu,
              [field]: value,
            }
          : menu
      )
    );
  };

  const moveMenu = (menuKey, direction) => {
    updateMenus((menus) => {
      const index = menus.findIndex((menu) => menu.key === menuKey);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= menus.length) {
        return menus;
      }

      const nextMenus = [...menus];
      const [moved] = nextMenus.splice(index, 1);
      nextMenus.splice(targetIndex, 0, moved);
      return nextMenus;
    });
  };

  const removeMenu = (menuKey) => {
    updateMenus((menus) => menus.filter((menu) => menu.key !== menuKey));
  };

  const addMenu = () => {
    updateMenus((menus) => [...menus, createHeaderNavigationDraftMenu(0)]);
  };

  const addChildMenu = (menuKey) => {
    updateMenus((menus) =>
      menus.map((menu) =>
        menu.key === menuKey
          ? {
              ...menu,
              children: [...(menu.children || []), createHeaderNavigationDraftMenu(1)],
            }
          : menu
      )
    );
  };

  const updateChildMenu = (menuKey, childKey, field, value) => {
    updateMenus((menus) =>
      menus.map((menu) =>
        menu.key === menuKey
          ? {
              ...menu,
              children: (menu.children || []).map((child) =>
                child.key === childKey
                  ? {
                      ...child,
                      [field]: value,
                    }
                  : child
              ),
            }
          : menu
      )
    );
  };

  const moveChildMenu = (menuKey, childKey, direction) => {
    updateMenus((menus) =>
      menus.map((menu) => {
        if (menu.key !== menuKey) {
          return menu;
        }

        const children = [...(menu.children || [])];
        const index = children.findIndex((child) => child.key === childKey);
        const targetIndex = index + direction;
        if (index < 0 || targetIndex < 0 || targetIndex >= children.length) {
          return menu;
        }

        const [moved] = children.splice(index, 1);
        children.splice(targetIndex, 0, moved);
        return {
          ...menu,
          children,
        };
      })
    );
  };

  const removeChildMenu = (menuKey, childKey) => {
    updateMenus((menus) =>
      menus.map((menu) =>
        menu.key === menuKey
          ? {
              ...menu,
              children: (menu.children || []).filter((child) => child.key !== childKey),
            }
          : menu
      )
    );
  };

  const handleSave = async () => {
    await onSave(
      normalizeHeaderNavigationConfig({
        ...draft,
        menus: reindexHeaderNavigationMenus(draft.menus),
      })
    );
  };

  const previewMenu =
    draft.menus.find((menu) => menu.key === previewMenuKey) ?? draft.menus[0] ?? null;

  return (
    <div className={styles.calculatorConfigModal}>
      <div className={styles.calculatorConfigBackdrop} onClick={onClose}>
        <div
          className={`${styles.calculatorConfigDialog} ${styles.headerNavDialog}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={styles.calculatorConfigHeader}>
            <div>
              <span className={styles.adminEyebrow}>Header Navigation</span>
              <h3>GNB 메뉴 설정</h3>
              <p>
                데스크톱 헤더와 모바일 메뉴가 같은 설정을 사용합니다. 상위 메뉴와
                하위 메뉴를 추가하고, 텍스트, 링크, 노출 여부, 외부 링크 여부를
                한 번에 저장할 수 있습니다.
              </p>
            </div>
            <div className={styles.calculatorModalActions}>
              <button
                type="button"
                className={styles.calculatorSecondaryButton}
                onClick={onClose}
                disabled={saving}
              >
                닫기
              </button>
              <button
                type="button"
                className={styles.calculatorPrimaryButton}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
          <div className={styles.headerNavBody}>
            <div className={styles.headerNavPreviewCard}>
              <div className={styles.headerNavPreviewHeader}>
                <div>
                  <span className={styles.adminEyebrow}>Live Preview</span>
                  <h4>헤더 미리보기</h4>
                  <p>
                    상위 메뉴는 헤더 바에서, 하위 메뉴는 드롭다운 패널에서 직접 드래그해 순서를 바꿀 수 있습니다.
                  </p>
                </div>
              </div>

              <div className={styles.headerNavPreviewShell}>
                <div className={styles.headerNavPreviewDesktopCard}>
                  <div className={styles.headerNavPreviewBar}>
                    <div className={styles.headerNavPreviewLogoWrap}>
                      <Image
                        src="/img/common/logo.png"
                        alt="Monthly IB Logo"
                        width={40}
                        height={48}
                      />
                    </div>
                    <StrictModeDroppable
                      droppableId={HEADER_TOP_DROPPABLE_ID}
                      direction="horizontal"
                      type="TOP_MENU"
                      renderClone={(provided, _snapshot, rubric) => {
                        const menu = draft.menus[rubric.source.index];
                        if (!menu) {
                          return null;
                        }
                        return (
                          <TopMenuPreviewChip
                            menu={menu}
                            isActive={previewMenuKey === menu.key}
                            isHidden={!menu.visible}
                            isDragging
                            provided={provided}
                          />
                        );
                      }}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`${styles.headerNavPreviewMenus} ${
                            snapshot.isDraggingOver
                              ? styles.headerNavPreviewMenusActive
                              : ""
                          }`}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {draft.menus.map((menu, index) => (
                            <Draggable
                              key={menu.key}
                              draggableId={createTopDraggableId(menu.key)}
                              index={index}
                            >
                              {(draggableProvided, draggableSnapshot) => (
                                <TopMenuPreviewChip
                                  menu={menu}
                                  isActive={previewMenuKey === menu.key}
                                  isHidden={!menu.visible}
                                  isDragging={draggableSnapshot.isDragging}
                                  provided={draggableProvided}
                                  onClick={() => setPreviewMenuKey(menu.key)}
                                />
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </StrictModeDroppable>
                    <div className={styles.headerNavPreviewRight}>
                      <div className={styles.headerNavPreviewProfile}>
                        <div className={styles.headerNavPreviewAvatar}>ib</div>
                        <span>admin님</span>
                      </div>
                      <div className={styles.headerNavPreviewUtility}>구독플랜</div>
                    </div>
                  </div>

                  <div className={styles.headerNavPreviewDropdown}>
                    <div className={styles.headerNavPreviewDropdownHeader}>
                      <strong>{previewMenu?.label || "메뉴 선택"}</strong>
                      <span>
                        {previewMenu?.children?.length
                          ? "하위 메뉴를 드래그해 순서를 바꾸세요."
                          : "하위 메뉴가 없는 단일 링크 메뉴입니다."}
                      </span>
                    </div>

                    {previewMenu?.children?.length ? (
                      <StrictModeDroppable
                        droppableId={createChildDroppableId(previewMenu.key)}
                        type="CHILD_MENU"
                        renderClone={(provided, _snapshot, rubric) => {
                          const child = previewMenu.children[rubric.source.index];
                          if (!child) {
                            return null;
                          }
                          return (
                            <ChildMenuPreviewRow
                              child={child}
                              isHidden={!child.visible}
                              isDragging
                              provided={provided}
                            />
                          );
                        }}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`${styles.headerNavPreviewChildList} ${
                              snapshot.isDraggingOver
                                ? styles.headerNavPreviewChildListActive
                                : ""
                            }`}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {previewMenu.children.map((child, childIndex) => (
                              <Draggable
                                key={child.key}
                                draggableId={createChildDraggableId(
                                  previewMenu.key,
                                  child.key
                                )}
                                index={childIndex}
                              >
                                {(draggableProvided, snapshot) => (
                                  <ChildMenuPreviewRow
                                    child={child}
                                    isHidden={!child.visible}
                                    isDragging={snapshot.isDragging}
                                    provided={draggableProvided}
                                  />
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </StrictModeDroppable>
                    ) : (
                      <div className={styles.calculatorEmpty}>
                        현재 선택된 메뉴에는 하위 메뉴가 없습니다.
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.headerNavPreviewMobileCard}>
                  <div className={styles.headerNavPreviewMobileFrame}>
                    <div className={styles.headerNavPreviewMobileTop}>
                      <div className={styles.headerNavPreviewMobileBurger}>☰</div>
                      <div className={styles.headerNavPreviewMobileTitle}>Monthly IB</div>
                      <div className={styles.headerNavPreviewMobilePlan}>구독</div>
                    </div>
                    <div className={styles.headerNavPreviewMobileBody}>
                      <div className={styles.headerNavPreviewMobileLeft}>
                        {draft.menus.map((menu) => (
                          <button
                            key={`mobile-${menu.key}`}
                            type="button"
                            className={`${styles.headerNavPreviewMobileCategory} ${
                              previewMenuKey === menu.key
                                ? styles.headerNavPreviewMobileCategoryActive
                                : ""
                            } ${!menu.visible ? styles.headerNavPreviewMenuHidden : ""}`}
                            onClick={() => setPreviewMenuKey(menu.key)}
                          >
                            {menu.label || "새 메뉴"}
                          </button>
                        ))}
                      </div>
                      <div className={styles.headerNavPreviewMobileRight}>
                        {previewMenu?.children?.length ? (
                          previewMenu.children.map((child) => (
                            <div
                              key={`mobile-child-${child.key}`}
                              className={`${styles.headerNavPreviewMobileItem} ${
                                !child.visible ? styles.headerNavPreviewMenuHidden : ""
                              }`}
                            >
                              <span>{child.label || "새 하위 메뉴"}</span>
                              <small>{child.external ? "외부" : "내부"}</small>
                            </div>
                          ))
                        ) : (
                          <div className={styles.headerNavPreviewMobileEmpty}>
                            하위 메뉴가 없으면 모바일에서는 단일 링크로 동작합니다.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.headerNavActions}>
              <button
                type="button"
                className={styles.calculatorSecondaryButton}
                onClick={addMenu}
              >
                상위 메뉴 추가
              </button>
            </div>

            <div className={styles.headerNavMenuList}>
              {draft.menus.map((menu, menuIndex) => (
                <div className={styles.headerNavMenuCard} key={menu.key}>
                  <div className={styles.headerNavMenuHeader}>
                    <div>
                      <strong>{menu.label || "새 메뉴"}</strong>
                      <p className={styles.headerNavKey}>key: {menu.key}</p>
                    </div>
                    <div className={styles.headerNavActionGroup}>
                      <button
                        type="button"
                        className={`${styles.calculatorSecondaryButton} ${styles.calculatorSmallButton}`}
                        onClick={() => moveMenu(menu.key, -1)}
                        disabled={menuIndex === 0}
                      >
                        위로
                      </button>
                      <button
                        type="button"
                        className={`${styles.calculatorSecondaryButton} ${styles.calculatorSmallButton}`}
                        onClick={() => moveMenu(menu.key, 1)}
                        disabled={menuIndex === draft.menus.length - 1}
                      >
                        아래로
                      </button>
                      <button
                        type="button"
                        className={`${styles.calculatorSecondaryButton} ${styles.calculatorSmallButton}`}
                        onClick={() => addChildMenu(menu.key)}
                      >
                        하위 추가
                      </button>
                      <button
                        type="button"
                        className={`${styles.calculatorDangerButton} ${styles.calculatorSmallButton}`}
                        onClick={() => removeMenu(menu.key)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>

                  <div className={styles.headerNavMenuGrid}>
                    <label className={styles.calculatorField}>
                      <span>메뉴명</span>
                      <input
                        value={menu.label}
                        onChange={(event) =>
                          updateMenu(menu.key, "label", event.target.value)
                        }
                      />
                    </label>
                    <label className={styles.calculatorField}>
                      <span>링크 URL</span>
                      <input
                        value={menu.href}
                        onChange={(event) =>
                          updateMenu(menu.key, "href", event.target.value)
                        }
                        placeholder="/path 또는 https://example.com"
                      />
                    </label>
                  </div>

                  <div className={styles.headerNavBooleanRow}>
                    <button
                      type="button"
                      className={
                        menu.visible
                          ? `${styles.calculatorLevelToggle} ${styles.calculatorLevelToggleActive}`
                          : styles.calculatorLevelToggle
                      }
                      onClick={() => updateMenu(menu.key, "visible", !menu.visible)}
                    >
                      {menu.visible ? "노출 중" : "숨김"}
                    </button>
                    <button
                      type="button"
                      className={
                        menu.external
                          ? `${styles.calculatorLevelToggle} ${styles.calculatorLevelToggleActive}`
                          : styles.calculatorLevelToggle
                      }
                      onClick={() => updateMenu(menu.key, "external", !menu.external)}
                    >
                      {menu.external ? "외부 링크" : "내부 링크"}
                    </button>
                  </div>

                  <div className={styles.headerNavChildren}>
                    <div className={styles.calculatorSectionHeader}>
                      <h5>하위 메뉴</h5>
                    </div>

                    {menu.children?.length ? (
                      <div className={styles.headerNavChildList}>
                        {menu.children.map((child, childIndex) => (
                          <div className={styles.headerNavChildCard} key={child.key}>
                            <div className={styles.headerNavChildHeader}>
                              <strong>{child.label || "새 하위 메뉴"}</strong>
                              <div className={styles.headerNavActionGroup}>
                                <button
                                  type="button"
                                  className={`${styles.calculatorSecondaryButton} ${styles.calculatorSmallButton}`}
                                  onClick={() => moveChildMenu(menu.key, child.key, -1)}
                                  disabled={childIndex === 0}
                                >
                                  위로
                                </button>
                                <button
                                  type="button"
                                  className={`${styles.calculatorSecondaryButton} ${styles.calculatorSmallButton}`}
                                  onClick={() => moveChildMenu(menu.key, child.key, 1)}
                                  disabled={childIndex === menu.children.length - 1}
                                >
                                  아래로
                                </button>
                                <button
                                  type="button"
                                  className={`${styles.calculatorDangerButton} ${styles.calculatorSmallButton}`}
                                  onClick={() => removeChildMenu(menu.key, child.key)}
                                >
                                  삭제
                                </button>
                              </div>
                            </div>

                            <div className={styles.headerNavMenuGrid}>
                              <label className={styles.calculatorField}>
                                <span>메뉴명</span>
                                <input
                                  value={child.label}
                                  onChange={(event) =>
                                    updateChildMenu(
                                      menu.key,
                                      child.key,
                                      "label",
                                      event.target.value
                                    )
                                  }
                                />
                              </label>
                              <label className={styles.calculatorField}>
                                <span>링크 URL</span>
                                <input
                                  value={child.href}
                                  onChange={(event) =>
                                    updateChildMenu(
                                      menu.key,
                                      child.key,
                                      "href",
                                      event.target.value
                                    )
                                  }
                                />
                              </label>
                            </div>

                            <div className={styles.headerNavBooleanRow}>
                              <button
                                type="button"
                                className={
                                  child.visible
                                    ? `${styles.calculatorLevelToggle} ${styles.calculatorLevelToggleActive}`
                                    : styles.calculatorLevelToggle
                                }
                                onClick={() =>
                                  updateChildMenu(
                                    menu.key,
                                    child.key,
                                    "visible",
                                    !child.visible
                                  )
                                }
                              >
                                {child.visible ? "노출 중" : "숨김"}
                              </button>
                              <button
                                type="button"
                                className={
                                  child.external
                                    ? `${styles.calculatorLevelToggle} ${styles.calculatorLevelToggleActive}`
                                    : styles.calculatorLevelToggle
                                }
                                onClick={() =>
                                  updateChildMenu(
                                    menu.key,
                                    child.key,
                                    "external",
                                    !child.external
                                  )
                                }
                              >
                                {child.external ? "외부 링크" : "내부 링크"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.calculatorEmpty}>
                        아직 하위 메뉴가 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {draft.menus.length === 0 && (
                <div className={styles.calculatorEmpty}>
                  상위 메뉴가 없습니다. 새 메뉴를 추가해 주세요.
                </div>
              )}
            </div>
          </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default AdminHeaderNavigationModal;
