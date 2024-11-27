import styles from "./AdminStyle.module.css";
import { useState, useRef, useEffect, use } from "react";
import {
  subscribeGetUserInfo,
  subscribePostUser,
  subscribeReviseUser,
  subscribeActiveUserInfo,
} from "@/apis/subscribeAPI";

const AdminUserAdminModal = ({
  adminModal,
  setAdminModal,
  authority,
  setAuthority,
  subscirbeDataList,
  userDetailInfo,
  userInfo,
  getUserInfo,
  reviseUserInfo,
}) => {
  const [originalSubscribe, setOriginalSubscribe] = useState({
    subscribeUserId: -1,
    subscribeId: -1,
    title: "",
    questionCount: "",
    tutoringCount: "",
    subscribeMonthPeriod: "",
    videoLessonsCount: "",
    subscribeStatus: "WAIT",
  });

  const [newSubscribe, setNewSubscribe] = useState({
    subscribeUserId: -1,
    subscribeId: -1,
    title: "",
    questionCount: "",
    tutoringCount: "",
    subscribeMonthPeriod: "",
    videoLessonsCount: "",
    subscribeStatus: "WAIT",
  });

  const closeRef = useRef();

  const onChangeMonth = (selectedId) => {
    const selectedSubscription = Object.values(subscirbeDataList[newSubscribe.title]).find(
      (item) => item.subscriberId === Number(selectedId)
    );

    if (selectedSubscription) {
      setNewSubscribe((prev) => ({
        ...prev,
        subscribeId: Number(selectedId),
        questionCount: originalSubscribe.subscribeUserId === -1 ? selectedSubscription.questionCount : prev.questionCount,
        tutoringCount: originalSubscribe.subscribeUserId === -1 ? selectedSubscription.tutoringCount : prev.tutoringCount,
        subscribeMonthPeriod: originalSubscribe.subscribeUserId === -1 ? selectedSubscription.subscribeMonthPeriod : prev.subscribeMonthPeriod,
        videoLessonsCount: originalSubscribe.subscribeUserId === -1 ? selectedSubscription.videoLessonsCount : prev.videoLessonsCount,
        subscribeStatus: "ACTIVE",
      }));
    }
  };

  useEffect(() => {
    const fetchActiveSubscription = async () => {
      const response = await subscribeActiveUserInfo(userDetailInfo?.userId, userInfo);
      const activeSubscription = response?.data;

      console.log(activeSubscription);
      if (activeSubscription) {
        setOriginalSubscribe({
          subscribeUserId: activeSubscription.subscribeUserId,
          subscribeId: activeSubscription.subscribeId,
          title: activeSubscription.title,
          questionCount: activeSubscription.questionCount,
          tutoringCount: activeSubscription.tutoringCount,
          subscribeMonthPeriod: activeSubscription.subscribeMonthPeriod,
          videoLessonsCount: activeSubscription.videoLessonsCount,
          subscribeStatus: activeSubscription.subscribeStatus,
        });

        setNewSubscribe({
          subscribeUserId: activeSubscription.subscribeUserId,
          subscribeId: activeSubscription.subscribeId,
          title: activeSubscription.title,
          questionCount: activeSubscription.questionCount,
          tutoringCount: activeSubscription.tutoringCount,
          subscribeMonthPeriod: activeSubscription.subscribeMonthPeriod,
          videoLessonsCount: activeSubscription.videoLessonsCount,
          subscribeStatus: activeSubscription.subscribeStatus,
        });
      } else {
        setOriginalSubscribe({
          subscribeUserId: -1,
          subscribeId: -1,
          title: "",
          questionCount: "",
          tutoringCount: "",
          subscribeMonthPeriod: "",
          videoLessonsCount: "",
          subscribeStatus: "",
        });

        setNewSubscribe({
          subscribeUserId: -1,
          subscribeId: -1,
          title: "",
          questionCount: "",
          tutoringCount: "",
          subscribeMonthPeriod: "",
          videoLessonsCount: "",
          subscribeStatus: "",
        });
      }
    };

    if (userDetailInfo) {
      setAuthority(userDetailInfo.authority);
      fetchActiveSubscription();
    }
  }, [userDetailInfo]);

  const onSubmitChangeAuthority = async () => {
    if (authority !== userDetailInfo?.authority) {
      reviseUserInfo(
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
      getUserInfo(userDetailInfo.userId, userInfo);
    }


    // 구독 정보 업데이트 처리
    if (originalSubscribe.subscribeUserId === -1 && newSubscribe.subscribeId !== -1) {
      const res = await subscribePostUser(userDetailInfo.userId, newSubscribe.subscribeId, userInfo);
      subscribeReviseUser(
        res?.data.subscribeUserId,
        newSubscribe.questionCount,
        newSubscribe.tutoringCount,
        newSubscribe.subscribeMonthPeriod,
        newSubscribe.videoLessonsCount,
        [],
        userInfo,
        newSubscribe.subscribeId,
        newSubscribe.subscribeStatus
      );
    } else if (originalSubscribe.subscribeUserId !== -1 && newSubscribe.subscribeId !== -1) {
      if (newSubscribe.subscribeId !== originalSubscribe.subscribeId) {
        subscribeReviseUser(
          originalSubscribe.subscribeUserId,
          newSubscribe.questionCount,
          newSubscribe.tutoringCount,
          newSubscribe.subscribeMonthPeriod,
          newSubscribe.videoLessonsCount,
          [],
          userInfo,
          newSubscribe.subscribeId,
          newSubscribe.subscribeStatus
        );
      } else {
        console.log("update",newSubscribe.subscribeStatus);
        subscribeReviseUser(
          originalSubscribe.subscribeUserId,
          newSubscribe.questionCount,
          newSubscribe.tutoringCount,
          newSubscribe.subscribeMonthPeriod,
          newSubscribe.videoLessonsCount,
          [],
          userInfo,
          newSubscribe.subscribeId,
          newSubscribe.subscribeStatus
        );
      }
    } else if (
      newSubscribe.questionCount ||
      newSubscribe.tutoringCount ||
      newSubscribe.subscribeMonthPeriod ||
      newSubscribe.videoLessonsCount
    ) {
      const res = await subscribeGetUserInfo(userDetailInfo.userId, 0, userInfo);
      subscribeReviseUser(
        res?.data[0]?.subscribeUserId,
        newSubscribe.questionCount,
        newSubscribe.tutoringCount,
        newSubscribe.subscribeMonthPeriod,
        newSubscribe.videoLessonsCount,
        [],
        userInfo,
        res?.data[0]?.subscribeId,
        newSubscribe.subscribeStatus
      );
    }

    setAdminModal(false);
  };

  return (
    <>
      {adminModal && (
        <div className={styles.md}>
          <div
            className={styles.md_box_flex}
            ref={closeRef}
            onClick={(e) => closeRef.current === e.target && setAdminModal(false)}
          >
            <div className={styles.admin_box}>
              <div className={styles.md_top}>
                <div className={styles.tit}>{userDetailInfo?.username} 님의 권한 변경 및 구독 관리</div>
                <select
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  disabled={userDetailInfo?.userId === 1}
                >
                  <option value="USER">일반유저</option>
                  <option value="ADMIN">관리자</option>
                </select>
                <div>
                  <span>구독 상품 </span>
                  <select
                    value={newSubscribe.title}
                    onChange={(e) => setNewSubscribe((prev) => ({ ...prev, title: e.target.value }))}
                  >
                    <option value="">구독 상품</option>
                    {Object.keys(subscirbeDataList).map((v, i) => (
                      <option value={v} key={i}>{v}</option>
                    ))}
                  </select>
                  {newSubscribe.title && (
                    <>
                      <select value={newSubscribe.subscribeId} onChange={(e) => onChangeMonth(e.target.value)}>
                        <option value={-1}>-</option>
                        {Object.keys(subscirbeDataList[newSubscribe.title])?.map((v, i) => (
                          <option
                            value={subscirbeDataList[newSubscribe.title][v].subscriberId}
                            key={i}
                          >
                            {subscirbeDataList[newSubscribe.title][v].subscribeMonthPeriod} 개월
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
                <div className={styles.subscribe_price_flex}>
                  <span>질문 수</span>
                  <input
                    type="number"
                    autoComplete="off"
                    placeholder="질문 갯수"
                    value={newSubscribe.questionCount}
                    onChange={(e) => setNewSubscribe((prev) => ({ ...prev, questionCount: e.target.value }))}
                  />
                </div>
                <div className={styles.subscribe_price_flex}>
                  <span>튜터링 갯수</span>
                  <input
                    type="number"
                    autoComplete="off"
                    placeholder="튜터링 갯수"
                    value={newSubscribe.tutoringCount}
                    onChange={(e) => setNewSubscribe((prev) => ({ ...prev, tutoringCount: e.target.value }))}
                  />
                </div>
                <div className={styles.subscribe_price_flex}>
                  <span>구독개월 수</span>
                  <input
                    type="number"
                    autoComplete="off"
                    placeholder="구독개월"
                    value={newSubscribe.subscribeMonthPeriod}
                    onChange={(e) => setNewSubscribe((prev) => ({ ...prev, subscribeMonthPeriod: e.target.value }))}
                  />
                </div>
                <div className={styles.subscribe_price_flex}>
                  <span>영상강의 수</span>
                  <input
                    type="number"
                    autoComplete="off"
                    placeholder="영상강의 수"
                    value={newSubscribe.videoLessonsCount}
                    onChange={(e) => setNewSubscribe((prev) => ({ ...prev, videoLessonsCount: e.target.value }))}
                  />
                </div>
                {/* <div className={styles.subscribe_price_flex}>
                  <span>구독 상태</span>
                  <select
                    value={newSubscribe.subscribeStatus}
                    onChange={(e) =>
                      setNewSubscribe((prev) => ({
                        ...prev,
                        subscribeStatus: e.target.value,
                      }))
                    }
                  >
                    <option value="WAIT">대기 (WAIT)</option>
                    <option value="ACTIVE">결제 완료 (ACTIVE)</option>
                  </select>
                </div> */}

              </div>
              <button type="button" className={styles.md_btn} onClick={onSubmitChangeAuthority}>
                확인
              </button>
            </div>
          </div>
          <div className={styles.md_dim}></div>
        </div>
      )}
    </>
  );
};

export default AdminUserAdminModal;
