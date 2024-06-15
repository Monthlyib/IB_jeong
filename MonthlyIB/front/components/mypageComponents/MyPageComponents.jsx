"use client";

import styles from "./MyPage.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import Link from "next/link";
import MyPageArchiveList from "./MyPageArchiveList";
import MyPageCourseList from "./MyPageCourseList";
import MyPageQuestionList from "./MyPageQuestionList";
import MyPageScheduleList from "./MyPageScheduleList";
import MyPageChangePayment from "./MyPageChangePayment";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { useUserStore } from "@/store/user";

const MyPageComponents = () => {
  const router = useRouter();
  const [modal, setModal] = useState(1);
  const [changePayment, setChangePayment] = useState(false);
  const closeRef = useRef("");
  const { userInfo, getUserInfo, userDetailInfo } = useUserStore();

  useEffect(() => {
    getUserInfo(userInfo.userId, userInfo);
  }, []);
  const mypageModal = {
    1: <MyPageCourseList />,
    2: <MyPageArchiveList />,
    3: <MyPageScheduleList />,
    4: <MyPageQuestionList />,
  };

  return (
    <>
      <main className="width_content">
        <div className={styles.mypage_flex}>
          <div className={styles.flex_left}>
            <div className={styles.my_profile_wrap}>
              <figure>
                <Image
                  src={
                    userDetailInfo?.userImage === null
                      ? "/img/common/user_profile.jpg"
                      : userDetailInfo?.userImage?.fileUrl
                  }
                  width="100"
                  height="100"
                  alt="user profile img"
                />
              </figure>

              <div className={styles.my_profile_user}>
                <p>
                  <span>{userInfo?.nickname}</span>님
                </p>
                <span>{userInfo?.username}</span>
              </div>

              <Link href="/mypage/validate" className={styles.my_validate_btn}>
                <FontAwesomeIcon icon={faCog} />
                <span>정보수정</span>
              </Link>
            </div>
            <div className={styles.plan_wrap}>
              {/* {User.plan !== null ? (
                <SubscribePlan
                  plan={User.plan.name}
                  setChangePayment={setChangePayment}
                />
              ) : (
                <Link href="/subscribe" className={styles.plan_btn}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>PLAN 구독</span>
                </Link>
              )} */}
            </div>
          </div>

          <div className={styles.flex_right}>
            <h2>마이페이지</h2>

            <div className={styles.cm_tab}>
              <button
                onClick={() => setModal(1)}
                className={modal === 1 ? styles.active : ""}
              >
                강의
              </button>
              <button
                onClick={() => setModal(2)}
                className={modal === 2 ? styles.active : ""}
              >
                자유게시판
              </button>
              <button
                onClick={() => setModal(3)}
                className={modal === 3 ? styles.active : ""}
              >
                수업 스케쥴링
              </button>
              <button
                onClick={() => setModal(4)}
                className={modal === 4 ? styles.active : ""}
              >
                나의 질문
              </button>
            </div>

            <div className={styles.my_search_inner}>
              <FontAwesomeIcon icon={faSearch} />
              <input type="text" placeholder="검색" />
            </div>
            {mypageModal[modal]}
            {changePayment && (
              <MyPageChangePayment
                closeRef={closeRef}
                setModal={setChangePayment}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

const SubscribePlan = ({ plan, setChangePayment }) => {
  return (
    <>
      <div className={styles.plan_active_wrap}>
        <div
          className={`${styles.plan_active_card} ${
            plan === "SUPER" ? styles.super : styles.basic
          }`}
        >
          <p>{plan === "SUPER" ? "SUPER PASS 구독중" : "BASIC PASS 구독중"}</p>
          <span>
            패스잔여기간 : <b>2023.06.20</b>
          </span>
        </div>
      </div>
      <div className={styles.plan_option}>
        <button type="button" onClick={() => setChangePayment((prev) => !prev)}>
          결제수단 변경
        </button>
        <b> / </b>
        <button type="button" id="">
          해지하기
        </button>
      </div>
    </>
  );
};

export default MyPageComponents;
