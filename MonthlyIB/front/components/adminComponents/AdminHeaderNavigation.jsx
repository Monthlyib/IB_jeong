"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./AdminStyle.module.css";
import { useUserInfo } from "@/store/user";
import {
  adminGetHeaderNavigation,
  adminSaveHeaderNavigation,
} from "@/apis/headerNavigationAPI";
import {
  buildDefaultHeaderNavigationConfig,
  normalizeHeaderNavigationConfig,
  publishHeaderNavigationConfig,
} from "@/utils/headerNavigationUtils";
import AdminHeaderNavigationModal from "./AdminHeaderNavigationModal";

const AdminHeaderNavigation = () => {
  const { userInfo } = useUserInfo();
  const [config, setConfig] = useState(buildDefaultHeaderNavigationConfig());
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      if (!userInfo?.accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await adminGetHeaderNavigation(userInfo);
        setConfig(
          normalizeHeaderNavigationConfig(
            response?.data?.config ?? buildDefaultHeaderNavigationConfig()
          )
        );
        setUpdatedAt(response?.data?.updatedAt ?? null);
      } catch (error) {
        console.error(error);
        setConfig(buildDefaultHeaderNavigationConfig());
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [userInfo]);

  const childCount = useMemo(
    () =>
      config.menus.reduce(
        (sum, menu) => sum + (Array.isArray(menu.children) ? menu.children.length : 0),
        0
      ),
    [config]
  );

  const visibleCount = useMemo(
    () => config.menus.filter((menu) => menu.visible).length,
    [config]
  );

  const handleSave = async (draft) => {
    try {
      setSaving(true);
      const response = await adminSaveHeaderNavigation(draft, userInfo);
      const nextConfig = normalizeHeaderNavigationConfig(
        response?.data?.config ?? draft
      );
      setConfig(nextConfig);
      publishHeaderNavigationConfig(nextConfig);
      setUpdatedAt(response?.data?.updatedAt ?? null);
      setOpen(false);
    } catch (error) {
      console.error("Failed to save header navigation:", error);
      alert("GNB 설정 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className={styles.dashboard_mid_card}>
        <div className={styles.title}>GNB 관리</div>
        <p className={styles.calculatorAdminDescription}>
          데스크톱 헤더와 모바일 사이드 메뉴가 같은 설정을 사용하도록 상위 메뉴,
          하위 메뉴, 링크, 노출 여부를 함께 관리합니다.
        </p>

        <div className={styles.calculatorAdminSummary}>
          <div>
            <span>상위 메뉴</span>
            <strong>{config.menus.length}</strong>
          </div>
          <div>
            <span>하위 메뉴</span>
            <strong>{childCount}</strong>
          </div>
          <div>
            <span>노출 중</span>
            <strong>{visibleCount}</strong>
          </div>
        </div>

        <div className={styles.calculatorConfigMeta}>
          <p>
            현재 메뉴: {config.menus.map((menu) => menu.label).join(", ")}
          </p>
          <p>
            최근 수정:{" "}
            {updatedAt
              ? new Date(updatedAt).toLocaleString("ko-KR")
              : "기본 GNB 메뉴를 사용 중입니다."}
          </p>
        </div>

        <button
          type="button"
          className={styles.calculatorConfigTrigger}
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          {loading ? "불러오는 중..." : "GNB 설정 열기"}
        </button>
      </div>

      {open && (
        <AdminHeaderNavigationModal
          config={config}
          saving={saving}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default AdminHeaderNavigation;
