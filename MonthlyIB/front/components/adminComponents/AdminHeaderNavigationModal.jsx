"use client";

import { useEffect, useState } from "react";
import styles from "./AdminStyle.module.css";
import {
  createHeaderNavigationDraftMenu,
  normalizeHeaderNavigationConfig,
  reindexHeaderNavigationMenus,
} from "@/utils/headerNavigationUtils";

const AdminHeaderNavigationModal = ({ config, onClose, onSave, saving }) => {
  const [draft, setDraft] = useState(normalizeHeaderNavigationConfig(config));

  useEffect(() => {
    setDraft(normalizeHeaderNavigationConfig(config));
  }, [config]);

  const updateMenus = (updater) => {
    setDraft((prev) => ({
      ...prev,
      menus: reindexHeaderNavigationMenus(updater(prev.menus)),
    }));
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

          <div className={styles.headerNavBody}>
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
        </div>
      </div>
    </div>
  );
};

export default AdminHeaderNavigationModal;
