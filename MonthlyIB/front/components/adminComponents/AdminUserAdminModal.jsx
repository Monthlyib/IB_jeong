import styles from "./AdminStyle.module.css";
import { useState, useRef, use } from "react";
import {
  subscribeGetUserInfo,
  subscribePostUser,
  subscribeReviseUser,
  subscribeActiveUserInfo,
} from "@/apis/subscribeAPI";
import { useEffect } from "react";

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
  const [subscribeId, setSubscribeId] = useState(-1);
  const [subscribeTitle, setSubscribeTitle] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [tutoringCount, setTutoringCount] = useState("");
  const [subscribeMonthPeriod, setSubscribeMonthPeriod] = useState("");
  const [videoLessonsCount, setVideoLessonsCount] = useState("");
  const closeRef = useRef();
  const onChangeMonth = (e) => {
    setSubscribeId(e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    if(userDetailInfo !== undefined){
      setAuthority(userDetailInfo?.authority);
    }
  }, [userDetailInfo]);

  const onSubmitChangeAuthority = async () => {
    if (authority !== userDetailInfo?.authority) {
      reviseUserInfo(
        userDetailInfo?.userId,
        userDetailInfo?.email,
        userDetailInfo?.nickName,
        userDetailInfo?.birth,
        userDetailInfo?.school,
        userDetailInfo?.grade,
        userDetailInfo?.address,
        userDetailInfo?.country,
        userDetailInfo?.userStatus,
        authority,
        userDetailInfo?.memo,
        userDetailInfo?.marketingTermsCheck,
        userInfo
      );
      getUserInfo(userDetailInfo?.userId, userInfo);
    }

    if (subscribeId !== -1) {
      const res = await subscribePostUser(
        userDetailInfo?.userId,
        subscribeId,
        userInfo
      );
      subscribeReviseUser(
        res?.data.subscribeUserId,
        questionCount,
        tutoringCount,
        subscribeMonthPeriod,
        videoLessonsCount,
        [],
        userInfo
      );
    } else {
      if (
        questionCount !== "" ||
        tutoringCount !== "" ||
        subscribeMonthPeriod !== "" ||
        videoLessonsCount !== ""
      ) {
        const res = await subscribeGetUserInfo(
          userDetailInfo?.userId,
          0,
          userInfo
        );
        subscribeReviseUser(
          res?.data[0]?.subscribeUserId,
          questionCount,
          tutoringCount,
          subscribeMonthPeriod,
          videoLessonsCount,
          [],
          userInfo
        );
      }
    }
    setAdminModal(false);
  };
  return (
    <>
      {adminModal === true && (
        <div className={styles.md}>
          <div
            className={styles.md_box_flex}
            ref={closeRef}
            onClick={(e) =>
              closeRef.current === e.target && setAdminModal(false)
            }
          >
            <div className={styles.admin_box}>
              <div className={styles.md_top}>
                <div className={styles.tit}>
                  {userDetailInfo?.username} 님의 권한 변경 및 구독 관리
                </div>
                <select
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  disabled={userDetailInfo?.userId === 1 ? true : false}
                >
                  <option value="USER">일반유저</option>
                  <option value="ADMIN">관리자</option>
                </select>
                <div>
                  <span>구독 상품 </span>
                  <select
                    value={subscribeTitle}
                    onChange={(e) => setSubscribeTitle(e.target.value)}
                  >
                    <option value="">구독 상품</option>
                    {Object.keys(subscirbeDataList).map((v, i) => (
                      <option value={v} key={i}>
                        {v}
                      </option>
                    ))}
                  </select>

                  {subscribeTitle != "" && (
                    <>
                      <select value={subscribeId} onChange={onChangeMonth}>
                        <option value={-1}>-</option>
                        {Object.keys(subscirbeDataList[subscribeTitle])?.map(
                          (v, i) => (
                            <option
                              value={
                                subscirbeDataList[subscribeTitle][v]
                                  .subscriberId
                              }
                              key={i}
                            >
                              {
                                subscirbeDataList[subscribeTitle][v]
                                  .subscribeMonthPeriod
                              }{" "}
                              개월
                            </option>
                          )
                        )}
                      </select>
                    </>
                  )}
                </div>
                <div className={styles.subscribe_price_flex}>
                  <span>질문 수</span>
                  <input
                    type="number"
                    autoFocus="true"
                    autoComplete="off"
                    required="Y"
                    placeholder="질문 갯수"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(e.target.value)}
                  />
                </div>
                <div className={styles.subscribe_price_flex}>
                  <span>튜터링 갯수</span>
                  <input
                    type="number"
                    autoFocus="true"
                    autoComplete="off"
                    required="Y"
                    placeholder="튜터링 갯수"
                    value={tutoringCount}
                    onChange={(e) => setTutoringCount(e.target.value)}
                  />
                </div>
                <div className={styles.subscribe_price_flex}>
                  <span>구독개월 수</span>
                  <input
                    type="number"
                    autoFocus="true"
                    autoComplete="off"
                    required="Y"
                    placeholder="구독개월"
                    value={subscribeMonthPeriod}
                    onChange={(e) => setSubscribeMonthPeriod(e.target.value)}
                  />
                </div>
                <div className={styles.subscribe_price_flex}>
                  <span>영상강의 수</span>
                  <input
                    type="number"
                    autoFocus="true"
                    autoComplete="off"
                    required="Y"
                    placeholder="영상강의 수"
                    value={videoLessonsCount}
                    onChange={(e) => setVideoLessonsCount(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                className={styles.md_btn}
                onClick={onSubmitChangeAuthority}
              >
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
