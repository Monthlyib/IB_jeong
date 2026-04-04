"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./AdminStyle.module.css";
import { useUserInfo } from "@/store/user";
import {
  adminGetCalculatorRecommendations,
  adminSaveCalculatorRecommendations,
} from "@/apis/calculatorRecommendationAPI";
import {
  buildDefaultCalculatorRecommendationConfig,
  normalizeCalculatorRecommendationConfig,
} from "../boardComponents/calculator/calculatorRecommendationUtils";
import AdminCalculatorRecommendationsModal from "./AdminCalculatorRecommendationsModal";

const AdminCalculatorRecommendations = () => {
  const { userInfo } = useUserInfo();
  const [config, setConfig] = useState(buildDefaultCalculatorRecommendationConfig());
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
        const response = await adminGetCalculatorRecommendations(userInfo);
        const nextConfig = response?.data?.config
          ? normalizeCalculatorRecommendationConfig(response.data.config)
          : buildDefaultCalculatorRecommendationConfig();
        setConfig(nextConfig);
        setUpdatedAt(response?.data?.updatedAt ?? null);
      } catch (error) {
        console.error(error);
        setConfig(buildDefaultCalculatorRecommendationConfig());
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [userInfo]);

  const schoolCount = useMemo(
    () =>
      config.countries.reduce(
        (sum, country) => sum + (country.schools?.length ?? 0),
        0
      ),
    [config]
  );

  const handleSave = async (draft) => {
    try {
      setSaving(true);
      const response = await adminSaveCalculatorRecommendations(draft, userInfo);
      setConfig(
        normalizeCalculatorRecommendationConfig(response?.data?.config ?? draft)
      );
      setUpdatedAt(response?.data?.updatedAt ?? null);
      setOpen(false);
    } catch (error) {
      console.error("Failed to save calculator recommendations:", error);
      alert("추천학교 설정 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className={styles.dashboard_mid_card}>
        <div className={styles.title}>추천학교 관리</div>
        <p className={styles.calculatorAdminDescription}>
          합격 예측 계산기에서 사용하는 점수대 기준과 국가별 추천 학교를 관리합니다.
        </p>

        <div className={styles.calculatorAdminSummary}>
          <div>
            <span>점수대</span>
            <strong>{config.scoreBands.length}</strong>
          </div>
          <div>
            <span>국가</span>
            <strong>{config.countries.length}</strong>
          </div>
          <div>
            <span>학교</span>
            <strong>{schoolCount}</strong>
          </div>
        </div>

        <div className={styles.calculatorConfigMeta}>
          <p>현재 국가: {config.countries.map((country) => country.label).join(", ")}</p>
          <p>
            최근 수정:{" "}
            {updatedAt
              ? new Date(updatedAt).toLocaleString("ko-KR")
              : "기본 추천학교 데이터를 사용 중입니다."}
          </p>
        </div>

        <button
          type="button"
          className={styles.calculatorConfigTrigger}
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          {loading ? "불러오는 중..." : "추천학교 설정 열기"}
        </button>
      </div>

      {open && (
        <AdminCalculatorRecommendationsModal
          config={config}
          saving={saving}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default AdminCalculatorRecommendations;
