"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./AdminStyle.module.css";
import { getCookie } from "@/apis/cookies";
import {
  getAdminFinanceDetails,
  getAdminFinanceOverview,
} from "@/apis/financeAPI";

const NUMBER_FORMATTER = new Intl.NumberFormat("ko-KR");

const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return "준비중";
  }
  return `${NUMBER_FORMATTER.format(Math.round(Number(value)))}원`;
};

const formatCompactCurrency = (value) => {
  if (value === null || value === undefined) {
    return "준비중";
  }

  const numeric = Number(value);
  if (Math.abs(numeric) >= 100000000) {
    return `${(numeric / 100000000).toFixed(1)}억`;
  }
  if (Math.abs(numeric) >= 10000) {
    return `${(numeric / 10000).toFixed(1)}만`;
  }
  return NUMBER_FORMATTER.format(Math.round(numeric));
};

const formatPeriodLabel = (period) => {
  if (!period) return "";
  const [year, month] = String(period).split("-");
  return `${year}.${month}`;
};

const getStatusLabel = (status) => {
  if (status === "FAILED") return "연동 실패";
  if (status === "PARTIAL") return "부분 데이터";
  if (status === "STALE") return "최근 캐시";
  return "정상";
};

const getStatusClassName = (status) => {
  if (status === "FAILED") return styles.financeStatusFailed;
  if (status === "PARTIAL") return styles.financeStatusWarning;
  if (status === "STALE") return styles.financeStatusMuted;
  return styles.financeStatusLive;
};

const renderTooltipValue = (value, name) => [formatCurrency(value), name];

const AdminFinance = () => {
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const session = useMemo(
    () => ({
      accessToken: getCookie("accessToken"),
    }),
    []
  );

  const chartData = useMemo(
    () =>
      (overview?.buckets || []).map((bucket) => ({
        ...bucket,
        periodLabel: formatPeriodLabel(bucket.period),
      })),
    [overview]
  );

  const detailPeriods = useMemo(
    () => (overview?.buckets || []).map((bucket) => bucket.period),
    [overview]
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
        const response = await getAdminFinanceOverview(12, session);
        setOverview(response);
        const firstPeriod = response?.buckets?.[response?.buckets?.length - 1]?.period;
        if (firstPeriod) {
          setSelectedPeriod(firstPeriod);
        }
      } catch (error) {
        console.error("Failed to fetch finance overview", error);
        setOverviewError(
          error?.response?.data?.message || "운영 비용 데이터를 불러오지 못했습니다."
        );
      } finally {
        setOverviewLoading(false);
      }
    };

    fetchOverview();
  }, [session.accessToken, session]);

  useEffect(() => {
    if (!detailModalOpen || !selectedPeriod || !session.accessToken) {
      return;
    }

    const fetchDetails = async () => {
      try {
        setDetailLoading(true);
        setDetailError("");
        const response = await getAdminFinanceDetails(selectedPeriod, session);
        setDetail(response);
      } catch (error) {
        console.error("Failed to fetch finance details", error);
        setDetailError(
          error?.response?.data?.message || "세부 비용 데이터를 불러오지 못했습니다."
        );
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetails();
  }, [detailModalOpen, selectedPeriod, session]);

  const openDetailModal = () => {
    if (!selectedPeriod && detailPeriods.length > 0) {
      setSelectedPeriod(detailPeriods[detailPeriods.length - 1]);
    }
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
  };

  if (overviewLoading) {
    return (
      <div className={`${styles.dashboard_mid_card} ${styles.financeAdminCard}`}>
        <div className={styles.financeSkeleton}>
          <h3>운영 수익 분석</h3>
          <p>운영 비용 데이터를 불러오는 중입니다.</p>
        </div>
      </div>
    );
  }

  if (overviewError) {
    return (
      <div className={`${styles.dashboard_mid_card} ${styles.financeAdminCard}`}>
        <div className={styles.financeSectionHeader}>
          <div>
            <h3>운영 수익 분석</h3>
            <p>외부 비용 API와 환율 데이터를 기반으로 운영 비용을 확인합니다.</p>
          </div>
        </div>
        <div className={styles.financeWarningBanner}>{overviewError}</div>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.dashboard_mid_card} ${styles.financeAdminCard}`}>
        <div className={styles.financeSectionHeader}>
          <div>
            <h3>운영 수익 분석</h3>
            <p>
              AWS와 OpenAI 사용비를 월별로 집계한 대시보드입니다. 매출과 운영이익은
              결제 연동 준비 후 활성화됩니다.
            </p>
          </div>
          <div className={styles.financeSectionActions}>
            <div className={`${styles.financeStatusPill} ${getStatusClassName(overview?.dataStatus)}`}>
              {getStatusLabel(overview?.dataStatus)}
            </div>
            <button
              type="button"
              className={styles.calculatorSecondaryButton}
              onClick={openDetailModal}
            >
              세부 보기
            </button>
          </div>
        </div>

        {overview?.warningMessage ? (
          <div className={styles.financeWarningBanner}>{overview.warningMessage}</div>
        ) : null}

        <div className={styles.financeSummaryGrid}>
          <div className={styles.financeSummaryCard}>
            <span>AWS 비용</span>
            <strong>{formatCurrency(overview?.totals?.awsCostKrw)}</strong>
          </div>
          <div className={styles.financeSummaryCard}>
            <span>OpenAI 비용</span>
            <strong>{formatCurrency(overview?.totals?.openAiCostKrw)}</strong>
          </div>
          <div className={styles.financeSummaryCard}>
            <span>총 운영비</span>
            <strong>{formatCurrency(overview?.totals?.totalOperatingCostKrw)}</strong>
          </div>
          <div className={`${styles.financeSummaryCard} ${styles.financeSummaryMuted}`}>
            <span>매출</span>
            <strong>준비중</strong>
          </div>
          <div className={`${styles.financeSummaryCard} ${styles.financeSummaryMuted}`}>
            <span>운영이익</span>
            <strong>준비중</strong>
          </div>
        </div>

        <div className={styles.financeChartShell}>
          <div className={styles.financeChartHeader}>
            <div>
              <h4>최근 12개월 운영비 추이</h4>
              <p>
                마지막 동기화:{" "}
                {overview?.lastSyncedAt
                  ? String(overview.lastSyncedAt).replace("T", " ")
                  : "기록 없음"}
              </p>
            </div>
            {selectedPeriod ? (
              <div className={styles.financeChartMeta}>
                상세 월: <strong>{formatPeriodLabel(selectedPeriod)}</strong>
              </div>
            ) : null}
          </div>
          <div className={styles.financeChart}>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee7f5" />
                <XAxis dataKey="periodLabel" tick={{ fill: "#75698a", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#75698a", fontSize: 12 }}
                  tickFormatter={formatCompactCurrency}
                />
                <Tooltip formatter={renderTooltipValue} />
                <Legend />
                <Bar dataKey="awsCostKrw" name="AWS 비용" fill="#7f62a9" radius={[8, 8, 0, 0]} />
                <Bar dataKey="openAiCostKrw" name="OpenAI 비용" fill="#b69ee3" radius={[8, 8, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="totalOperatingCostKrw"
                  name="총 운영비"
                  stroke="#2f2143"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.financeFootnote}>
          매출 및 운영이익은 결제 ledger 구축 이후 활성화됩니다.
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
                  <span className={styles.sectionEyebrow}>Finance Detail</span>
                  <h3>운영 비용 세부 보기</h3>
                  <p>선택 월의 일별 비용과 서비스별 breakdown을 확인합니다.</p>
                </div>
                <div className={styles.financeModalActions}>
                  <select
                    value={selectedPeriod}
                    onChange={(event) => setSelectedPeriod(event.target.value)}
                    className={styles.financeMonthSelect}
                  >
                    {detailPeriods.map((period) => (
                      <option key={period} value={period}>
                        {formatPeriodLabel(period)}
                      </option>
                    ))}
                  </select>
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
                  <div className={styles.financeSkeleton}>세부 데이터를 불러오는 중입니다.</div>
                ) : detailError ? (
                  <div className={styles.financeWarningBanner}>{detailError}</div>
                ) : (
                  <>
                    {detail?.warningMessage ? (
                      <div className={styles.financeWarningBanner}>
                        {detail.warningMessage}
                      </div>
                    ) : null}

                    <div className={styles.financeDetailMeta}>
                      <div className={styles.financeMetaBox}>
                        <span>환율 기준</span>
                        <strong>
                          {detail?.exchangeRateMeta?.averageRate
                            ? `1 USD = ${NUMBER_FORMATTER.format(
                                Number(detail.exchangeRateMeta.averageRate)
                              )} KRW`
                            : "준비중"}
                        </strong>
                      </div>
                      <div className={styles.financeMetaBox}>
                        <span>마지막 동기화</span>
                        <strong>
                          {detail?.lastSyncedAt
                            ? String(detail.lastSyncedAt).replace("T", " ")
                            : "기록 없음"}
                        </strong>
                      </div>
                    </div>

                    <div className={styles.financeChartShell}>
                      <div className={styles.financeChart}>
                        <ResponsiveContainer width="100%" height={280}>
                          <ComposedChart data={detail?.dailyBuckets || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee7f5" />
                            <XAxis
                              dataKey="period"
                              tick={{ fill: "#75698a", fontSize: 11 }}
                              tickFormatter={(value) => String(value).slice(8)}
                            />
                            <YAxis
                              tick={{ fill: "#75698a", fontSize: 11 }}
                              tickFormatter={formatCompactCurrency}
                            />
                            <Tooltip formatter={renderTooltipValue} />
                            <Legend />
                            <Bar
                              dataKey="awsCostKrw"
                              name="AWS 비용"
                              fill="#7f62a9"
                              radius={[8, 8, 0, 0]}
                            />
                            <Bar
                              dataKey="openAiCostKrw"
                              name="OpenAI 비용"
                              fill="#b69ee3"
                              radius={[8, 8, 0, 0]}
                            />
                            <Line
                              type="monotone"
                              dataKey="totalOperatingCostKrw"
                              name="총 운영비"
                              stroke="#2f2143"
                              strokeWidth={2.5}
                              dot={false}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className={styles.financeBreakdownGrid}>
                      <div className={styles.financeBreakdownCard}>
                        <div className={styles.financeBreakdownHeader}>
                          <h4>AWS 서비스별 비용</h4>
                        </div>
                        <div className={styles.financeBreakdownTable}>
                          {(detail?.awsBreakdown || []).length > 0 ? (
                            (detail.awsBreakdown || []).map((item) => (
                              <div key={item.label} className={styles.financeBreakdownRow}>
                                <span>{item.label}</span>
                                <strong>{formatCurrency(item.krwAmount)}</strong>
                              </div>
                            ))
                          ) : (
                            <div className={styles.emptyTableState}>표시할 AWS 비용이 없습니다.</div>
                          )}
                        </div>
                      </div>

                      <div className={styles.financeBreakdownCard}>
                        <div className={styles.financeBreakdownHeader}>
                          <h4>OpenAI 비용 breakdown</h4>
                        </div>
                        <div className={styles.financeBreakdownTable}>
                          {(detail?.openAiBreakdown || []).length > 0 ? (
                            (detail.openAiBreakdown || []).map((item) => (
                              <div key={item.label} className={styles.financeBreakdownRow}>
                                <span>{item.label}</span>
                                <strong>{formatCurrency(item.krwAmount)}</strong>
                              </div>
                            ))
                          ) : (
                            <div className={styles.emptyTableState}>
                              표시할 OpenAI 비용 breakdown이 없습니다.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.financeFootnote}>
                      매출 및 운영이익은 결제 연동 준비 후 같은 화면에서 활성화됩니다.
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

export default AdminFinance;
