import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./AdminStyle.module.css";

import {
  faUser,
  faUserGear,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "@/store/user";
import { useEffect, useState, useRef } from "react";
import AdminUserDetail from "./AdminUserDetail";
import shortid from "shortid";
import { useSubscribeStore } from "@/store/subscribe";
import {
  subscribeGetUserList,
  subscribePostUser,
  subscribeReviseUser,
} from "@/apis/subscribeAPI";

const AdminUser = () => {
  const {
    userInfo,
    userList,
    userDetailInfo,
    getUserInfo,
    reviseUserInfo,
    deleteUser,
  } = useUserStore();
  const { subscribeList } = useSubscribeStore();
  const [modal, setModal] = useState(false);
  const [adminModal, setAdminModal] = useState(false);
  const [authority, setAuthority] = useState("");
  const [subscirbeDataList, setSubscribeDataList] = useState({});
  const [subscribeId, setSubscribeId] = useState(-1);
  const [subscribeTitle, setSubscribeTitle] = useState("BASIC");
  const [questionCount, setQuestionCount] = useState("");
  const [tutoringCount, setTutoringCount] = useState("");
  const [subscribeMonthPeriod, setSubscribeMonthPeriod] = useState("");
  const [videoLessonsCount, setVideoLessonsCount] = useState("");
  const closeRef = useRef();

  const planNames = [];

  const onChangeMonth = (e) => {
    setSubscribeId(e.target.value);
  };

  useEffect(() => {
    // subscribe data 전처리
    const temp = [];
    temp.push(
      subscribeList.filter((item, index, array) => {
        return array.findIndex((i) => i.title === item.title) === index;
      })
    );

    for (let i = 0; i < temp[0].length; i++) {
      if (!temp[0][i].title.includes("ORI")) {
        planNames.push(temp[0][i].title);
      }
    }

    const tempObj = {};

    for (let i = 0; i < planNames.length; i++) {
      if (!Object.keys(tempObj).includes(planNames[i])) {
        tempObj[planNames[i]] = subscribeList.filter((item) => {
          return item.title === planNames[i];
        });
      }
    }
    setSubscribeDataList(tempObj);
  }, [subscribeList]);

  const onClickChangeAuthority = (userId) => {
    setAdminModal(!adminModal);
    getUserInfo(userId, userInfo);
    setAuthority(userDetailInfo?.authority);
  };

  const onClickGetUserDetailInfo = (userId) => {
    setModal(!modal);
    getUserInfo(userId, userInfo);
  };

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
        const res = await subscribeGetUserList(
          userDetailInfo?.userId,
          0,
          userInfo
        );
        console.log(res);
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
      <div className={styles.dashboard_mid_card}>
        <div className={styles.title}>사용자 관리</div>
        <div className={styles.subtitle}>
          <div className={styles.username}>ID</div>
          <div className={styles.nickname}>Name</div>
          <div className={styles.functions}>Tools</div>
        </div>

        {userList.length > 0 && (
          <>
            {userList.map((v) => (
              <div key={shortid.generate()}>
                <hr />
                <div
                  className={
                    v.userStatus === "INACTIVE"
                      ? styles.users_inactive
                      : styles.users
                  }
                >
                  {v.username}
                  <div>{v.nickName}</div>
                  <span>
                    <FontAwesomeIcon
                      icon={faUser}
                      onClick={() => onClickGetUserDetailInfo(v.userId)}
                    />
                    <FontAwesomeIcon
                      icon={faUserGear}
                      onClick={() => onClickChangeAuthority(v.userId)}
                    />
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                </div>
                <hr />
              </div>
            ))}
          </>
        )}

        {modal === true && (
          <AdminUserDetail
            userDetailInfo={userDetailInfo}
            setModal={setModal}
          />
        )}
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
                      {Object.keys(subscirbeDataList).map((v, i) => (
                        <option value={v} key={i}>
                          {v}
                        </option>
                      ))}
                    </select>

                    <select value={subscribeId} onChange={onChangeMonth}>
                      {subscirbeDataList[subscribeTitle]?.map((v, i) => (
                        <option value={v.subscriberId} key={i}>
                          {v.subscribeMonthPeriod} 개월
                        </option>
                      ))}
                    </select>
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
      </div>
    </>
  );
};

export default AdminUser;
