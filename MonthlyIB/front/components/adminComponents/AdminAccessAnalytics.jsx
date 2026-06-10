"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getCookie } from "@/apis/cookies";
import {
  getAdminAccessAnalyticsDetails,
  getAdminAccessAnalyticsOverview,
} from "@/apis/accessAnalyticsAPI";
import styles from "./AdminStyle.module.css";

const NUMBER_FORMATTER = new Intl.NumberFormat("ko-KR");

const formatNumber = (value) => NUMBER_FORMATTER.format(Number(value || 0));

const formatDateTime = (value) => {
  if (!value) return "-";
  return String(value).replace("T", " ").slice(0, 16);
};

const AdminAccessAnalytics = () => {
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [detail, setDetail] = useState(null);

  const session = useMemo(
    () => ({
      accessToken: getCookie("accessToken"),
    }),
    []
  );

  useEffect(() => {
    if (!session.accessToken) {
      setOverviewLoading(false);
      setOverviewError("관리자 인증 정보가 없습니다.");
      return;
    }

    const fetchOverview = async () => {
      try {
        setOverviewLoading(true);
        setOverviewError("");
        const response = await getAdminAccessAnalyticsOverview(session, 30, 12);
        setOverview(response);
      } catch (error) {
        console.error("Failed to fetch access analytics overview", error);
        setOverviewError(
          error?.response?.data?.message || "접속 사용자 데이터를 불러오지 못했습니다."
        );
      } finally {
        setOverviewLoading(false);
      }
    };

    fetchOverview();
  }, [session]);

  const openDetailModal = async (periodType, period) => {
    if (!session.accessToken || !periodType || !period) return;

    try {
      setDetailModalOpen(true);
      setDetailLoading(true);
      setDetailError("");
      setDetail(null);
      const response = await getAdminAccessAnalyticsDetails(session, periodType, period);
      setDetail(response);
    } catch (error) {
      console.error("Failed to fetch access analytics details", error);
      setDetailError(
        error?.response?.data?.message || "접속 사용자 상세 데이터를 불러오지 못했습니다."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setDetail(null);
    setDetailError("");
  };

  const renderTooltipValue = (value) => [`${formatNumber(value)}명`, "접속 사용자"];

  if (overviewLoading) {
    return (
      <div className={`${styles.dashboard_mid_card} ${styles.accessAnalyticsCard}`}>
        <div className={styles.financeSkeleton}>
          <h3>접속 사용자 분석</h3>
          <p>접속 사용자 데이터를 불러오는 중입니다.</p>
        </div>
      </div>
    );
  }

  if (overviewError) {
    return (
      <div className={`${styles.dashboard_mid_card} ${styles.accessAnalyticsCard}`}>
        <div className={styles.financeSectionHeader}>
          <div>
            <h3>접속 사용자 분석</h3>
            <p>로그인 후 인증 API를 사용한 일반 사용자 기준으로 집계합니다.</p>
          </div>
        </div>
        <div className={styles.financeWarningBanner}>{overviewError}</div>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.dashboard_mid_card} ${styles.accessAnalyticsCard}`}>
        <div className={styles.financeSectionHeader}>
          <div>
            <h3>접속 사용자 분석</h3>
            <p>
              로그인 후 실제 서비스를 사용한 일반 사용자 기준의 일별/주별 고유 접속자입니다.
              차트 막대를 누르면 해당 기간의 사용자 목록을 확인할 수 있습니다.
            </p>
          </div>
          <div className={styles.financeChartMeta}>
            업데이트:{" "}
            <strong>
              {overview?.generatedAt ? formatDateTime(overview.generatedAt) : "기록 없음"}
            </strong>
          </div>
        </div>

        <div className={styles.financeSummaryGrid}>
          <div className={styles.financeSummaryCard}>
            <span>오늘</span>
            <strong>{formatNumber(overview?.summary?.todayUsers)}명</strong>
          </div>
          <div className={styles.financeSummaryCard}>
            <span>최근 7일</span>
            <strong>{formatNumber(overview?.summary?.last7DaysUsers)}명</strong>
          </div>
          <div className={styles.financeSummaryCard}>
            <span>최근 30일</span>
            <strong>{formatNumber(overview?.summary?.last30DaysUsers)}명</strong>
          </div>
          <div className={styles.financeSummaryCard}>
            <span>이번 주</span>
            <strong>{formatNumber(overview?.summary?.thisWeekUsers)}명</strong>
          </div>
        </div>

        <div className={styles.accessChartGrid}>
          <div className={styles.financeChartShell}>
            <div className={styles.financeChartHeader}>
              <div>
                <h4>최근 30일 일별 접속자</h4>
                <p>일별 고유 사용자 수입니다.</p>
              </div>
            </div>
            <div className={styles.financeChart}>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={overview?.dailyBuckets || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee7f5" />
                  <XAxis dataKey="label" tick={{ fill: "#75698a", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#75698a", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip formatter={renderTooltipValue} />
                  <Bar
                    dataKey="uniqueUserCount"
                    name="접속 사용자"
                    fill="#7f62a9"
                    radius={[8, 8, 0, 0]}
                    cursor="pointer"
                    onClick={(entry) => openDetailModal("DAY", entry?.period)}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.financeChartShell}>
            <div className={styles.financeChartHeader}>
              <div>
                <h4>최근 12주 주별 접속자</h4>
                <p>ISO week, 월요일 시작 기준입니다.</p>
              </div>
            </div>
            <div className={styles.financeChart}>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={overview?.weeklyBuckets || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee7f5" />
                  <XAxis dataKey="label" tick={{ fill: "#75698a", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#75698a", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip formatter={renderTooltipValue} />
                  <Bar
                    dataKey="uniqueUserCount"
                    name="접속 사용자"
                    fill="#b69ee3"
                    radius={[8, 8, 0, 0]}
                    cursor="pointer"
                    onClick={(entry) => openDetailModal("WEEK", entry?.period)}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className={styles.financeFootnote}>
          관리자 계정과 비로그인 방문자는 집계에서 제외됩니다.
        </div>
      </div>

      {detailModalOpen ? (
        <div className={styles.financeModal}>
          <div className={styles.financeModalBackdrop} onClick={closeDetailModal}>
            <div
              className={styles.financeModalDialog}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.financeModalHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>Access Detail</span>
                  <h3>접속 사용자 상세</h3>
                  <p>
                    {detail?.startDate && detail?.endDate
                      ? `${detail.startDate} ~ ${detail.endDate}`
                      : "선택 기간"}{" "}
                    기준 접속 사용자 목록입니다.
                  </p>
                </div>
                <div className={styles.financeModalActions}>
                  <button
                    type="button"
                    className={styles.calculatorSecondaryButton}
                    onClick={closeDetailModal}
                  >
                    닫기
                  </button>
                </div>
              </div>

              <div className={styles.financeModalBody}>
                {detailLoading ? (
                  <div className={styles.financeSkeleton}>접속 사용자 목록을 불러오는 중입니다.</div>
                ) : detailError ? (
                  <div className={styles.financeWarningBanner}>{detailError}</div>
                ) : (
                  <>
                    <div className={styles.financeDetailMeta}>
                      <div className={styles.financeMetaBox}>
                        <span>고유 접속자</span>
                        <strong>{formatNumber(detail?.uniqueUserCount)}명</strong>
                      </div>
                      <div className={styles.financeMetaBox}>
                        <span>집계 기간</span>
                        <strong>
                          {detail?.startDate} ~ {detail?.endDate}
                        </strong>
                      </div>
                    </div>

                    <div className={styles.accessUserTable}>
                      <div className={styles.accessUserTableHead}>
                        <span>USER</span>
                        <span>EMAIL</span>
                        <span>FIRST</span>
                        <span>LAST</span>
                        <span>COUNT</span>
                      </div>
                      {(detail?.users || []).length > 0 ? (
                        detail.users.map((user) => (
                          <div className={styles.accessUserRow} key={user.userId}>
                            <span>
                              <strong>{user.username}</strong>
                              <em>{user.nickName}</em>
                            </span>
                            <span>{user.email}</span>
                            <span>{formatDateTime(user.firstAccessAt)}</span>
                            <span>{formatDateTime(user.lastAccessAt)}</span>
                            <span>{formatNumber(user.accessCount)}</span>
                          </div>
                        ))
                      ) : (
                        <div className={styles.emptyTableState}>
                          선택 기간에 접속한 사용자가 없습니다.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AdminAccessAnalytics;
