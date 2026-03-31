import styles from "./AdminStyle.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  subscribeActiveUserInfo,
  subscribePostUser,
  subscribeReviseUser,
} from "@/apis/subscribeAPI";

const EMPTY_SUBSCRIBE = {
  subscribeUserId: -1,
  subscribeId: -1,
  title: "",
  questionCount: "",
  tutoringCount: "",
  subscribeMonthPeriod: "",
  videoLessonsCount: "",
  subscribeStatus: "WAIT",
};

const AdminUserAdminModal = ({
  adminModal,
  setAdminModal,
  authority,
  setAuthority,
  subscirbeDataList,
  userDetailInfo,
  selectedUserId,
  userInfo,
  getUserInfo,
  reviseUserInfo,
}) => {
  const closeRef = useRef();
  const [originalSubscribe, setOriginalSubscribe] = useState(EMPTY_SUBSCRIBE);
  const [newSubscribe, setNewSubscribe] = useState(EMPTY_SUBSCRIBE);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const isReady =
    adminModal &&
    selectedUserId !== null &&
    userDetailInfo?.userId === selectedUserId;

  const currentPlanVariants = useMemo(() => {
    if (!newSubscribe.title || !subscirbeDataList[newSubscribe.title]) {
      return [];
    }
    return Object.values(subscirbeDataList[newSubscribe.title]);
  }, [newSubscribe.title, subscirbeDataList]);

  const syncPlanToState = (selectedPlan) => {
    if (!selectedPlan) return;
    setNewSubscribe((prev) => ({
      ...prev,
      title: selectedPlan.title,
      subscribeId: selectedPlan.subscriberId,
      questionCount: selectedPlan.questionCount,
      tutoringCount: selectedPlan.tutoringCount,
      subscribeMonthPeriod: selectedPlan.subscribeMonthPeriod,
      videoLessonsCount: selectedPlan.videoLessonsCount,
      subscribeStatus: prev.subscribeStatus || "ACTIVE",
    }));
  };

  useEffect(() => {
    if (!adminModal) {
      setFeedback("");
      setLoading(false);
      setSaving(false);
      return;
    }

    if (!selectedUserId) return;

    const loadModalData = async () => {
      setLoading(true);
      setFeedback("");

      try {
        const detail = await getUserInfo(selectedUserId, userInfo);
        setAuthority(detail?.authority ?? "USER");

        const activeResponse = await subscribeActiveUserInfo(selectedUserId, userInfo);
        const activeSubscription = activeResponse?.data ?? null;

        if (activeSubscription) {
          const normalized = {
            subscribeUserId: activeSubscription.subscribeUserId,
            subscribeId: activeSubscription.subscribeId,
            title: activeSubscription.title ?? "",
            questionCount: activeSubscription.questionCount ?? "",
            tutoringCount: activeSubscription.tutoringCount ?? "",
            subscribeMonthPeriod: activeSubscription.subscribeMonthPeriod ?? "",
            videoLessonsCount: activeSubscription.videoLessonsCount ?? "",
            subscribeStatus: activeSubscription.subscribeStatus ?? "ACTIVE",
          };
          setOriginalSubscribe(normalized);
          setNewSubscribe(normalized);
        } else {
          setOriginalSubscribe(EMPTY_SUBSCRIBE);
          setNewSubscribe(EMPTY_SUBSCRIBE);
        }
      } catch (error) {
        setFeedback("사용자 구독 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadModalData();
  }, [adminModal, selectedUserId]);

  const onChangeTitle = (title) => {
    if (!title) {
      setNewSubscribe((prev) => ({
        ...prev,
        title: "",
        subscribeId: -1,
      }));
      return;
    }

    const firstPlan = Object.values(subscirbeDataList[title] || {})[0];
    if (!firstPlan) return;
    syncPlanToState(firstPlan);
  };

  const onChangeVariant = (selectedId) => {
    const selectedPlan = currentPlanVariants.find(
      (item) => item.subscriberId === Number(selectedId)
    );
    syncPlanToState(selectedPlan);
  };

  const onSubmitChangeAuthority = async () => {
    if (!isReady || saving) return;

    setSaving(true);
    setFeedback("");

    try {
      if (authority !== userDetailInfo?.authority) {
        await reviseUserInfo(
          userDetailInfo.userId,
          userDetailInfo.email,
          userDetailInfo.nickName,
          userDetailInfo.birth,
          userDetailInfo.school,
          userDetailInfo.grade,
          userDetailInfo.address,
          userDetailInfo.country,
          userDetailInfo.userStatus,
          authority,
          userDetailInfo.memo,
          userDetailInfo.marketingTermsCheck,
          userInfo
        );
      }

      const hasSelectedPlan = newSubscribe.title && newSubscribe.subscribeId !== -1;

      if (!hasSelectedPlan && originalSubscribe.subscribeUserId === -1) {
        setFeedback("구독을 관리하려면 먼저 구독 상품을 선택해주세요.");
        setSaving(false);
        return;
      }

      if (hasSelectedPlan) {
        if (originalSubscribe.subscribeUserId === -1) {
          const created = await subscribePostUser(
            userDetailInfo.userId,
            newSubscribe.subscribeId,
            userInfo
          );

          await subscribeReviseUser(
            created?.data?.subscribeUserId ?? created?.subscribeUserId,
            Number(newSubscribe.questionCount),
            Number(newSubscribe.tutoringCount),
            Number(newSubscribe.subscribeMonthPeriod),
            Number(newSubscribe.videoLessonsCount),
            [],
            userInfo,
            newSubscribe.subscribeId,
            newSubscribe.subscribeStatus
          );
        } else {
          await subscribeReviseUser(
            originalSubscribe.subscribeUserId,
            Number(newSubscribe.questionCount),
            Number(newSubscribe.tutoringCount),
            Number(newSubscribe.subscribeMonthPeriod),
            Number(newSubscribe.videoLessonsCount),
            [],
            userInfo,
            newSubscribe.subscribeId,
            newSubscribe.subscribeStatus
          );
        }
      }

      setAdminModal(false);
    } catch (error) {
      setFeedback("권한 또는 구독 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!adminModal) {
    return null;
  }

  return (
    <div className={styles.md}>
      <div
        className={styles.md_box_flex}
        ref={closeRef}
        onClick={(e) => closeRef.current === e.target && setAdminModal(false)}
      >
        <div className={styles.admin_box}>
          <div className={styles.md_top}>
            <div className={styles.tit}>
              {userDetailInfo?.username ?? "사용자"} 님의 권한 변경 및 구독 관리
            </div>

            {loading || !isReady ? (
              <div className={styles.adminModalFeedback}>사용자 정보를 불러오는 중입니다.</div>
            ) : (
              <>
                <div className={styles.subscribe_price_flex}>
                  <span>권한</span>
                  <select
                    value={authority}
                    onChange={(e) => setAuthority(e.target.value)}
                    disabled={userDetailInfo?.userId === 1 || saving}
                  >
                    <option value="USER">일반유저</option>
                    <option value="ADMIN">관리자</option>
                  </select>
                </div>

                <div className={styles.subscribe_price_flex}>
                  <span>구독 상품</span>
                  <select
                    value={newSubscribe.title}
                    onChange={(e) => onChangeTitle(e.target.value)}
                    disabled={saving}
                  >
                    <option value="">구독 상품 선택</option>
                    {Object.keys(subscirbeDataList).map((title) => (
                      <option value={title} key={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>

                {newSubscribe.title && (
                  <div className={styles.subscribe_price_flex}>
                    <span>플랜 기간</span>
                    <select
                      value={newSubscribe.subscribeId}
                      onChange={(e) => onChangeVariant(e.target.value)}
                      disabled={saving}
                    >
                      {currentPlanVariants.map((plan) => (
                        <option value={plan.subscriberId} key={plan.subscriberId}>
                          {plan.subscribeMonthPeriod}개월
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className={styles.subscribe_price_flex}>
                  <span>상태</span>
                  <select
                    value={newSubscribe.subscribeStatus}
                    onChange={(e) =>
                      setNewSubscribe((prev) => ({
                        ...prev,
                        subscribeStatus: e.target.value,
                      }))
                    }
                    disabled={saving}
                  >
                    <option value="WAIT">대기</option>
                    <option value="ACTIVE">활성</option>
                    <option value="EXPIRATION">만료</option>
                    <option value="CANCEL">취소</option>
                  </select>
                </div>

                <div className={styles.subscribe_price_flex}>
                  <span>질문 수</span>
                  <input
                    type="number"
                    autoComplete="off"
                    placeholder="질문 수"
                    value={newSubscribe.questionCount}
                    onChange={(e) =>
                      setNewSubscribe((prev) => ({
                        ...prev,
                        questionCount: e.target.value,
                      }))
                    }
                    disabled={saving}
                  />
                </div>

                <div className={styles.subscribe_price_flex}>
                  <span>튜터링 수</span>
                  <input
                    type="number"
                    autoComplete="off"
                    placeholder="튜터링 수"
                    value={newSubscribe.tutoringCount}
                    onChange={(e) =>
                      setNewSubscribe((prev) => ({
                        ...prev,
                        tutoringCount: e.target.value,
                      }))
                    }
                    disabled={saving}
                  />
                </div>

                <div className={styles.subscribe_price_flex}>
                  <span>구독 개월 수</span>
                  <input
                    type="number"
                    autoComplete="off"
                    placeholder="구독 개월 수"
                    value={newSubscribe.subscribeMonthPeriod}
                    onChange={(e) =>
                      setNewSubscribe((prev) => ({
                        ...prev,
                        subscribeMonthPeriod: e.target.value,
                      }))
                    }
                    disabled={saving}
                  />
                </div>

                <div className={styles.subscribe_price_flex}>
                  <span>영상강의 수</span>
                  <input
                    type="number"
                    autoComplete="off"
                    placeholder="영상강의 수"
                    value={newSubscribe.videoLessonsCount}
                    onChange={(e) =>
                      setNewSubscribe((prev) => ({
                        ...prev,
                        videoLessonsCount: e.target.value,
                      }))
                    }
                    disabled={saving}
                  />
                </div>

                {feedback && (
                  <div className={styles.adminModalFeedback}>{feedback}</div>
                )}
              </>
            )}
          </div>
          <button
            type="button"
            className={styles.md_btn}
            onClick={onSubmitChangeAuthority}
            disabled={loading || !isReady || saving}
          >
            {saving ? "저장 중..." : "확인"}
          </button>
        </div>
      </div>
      <div className={styles.md_dim}></div>
    </div>
  );
};

export default AdminUserAdminModal;
