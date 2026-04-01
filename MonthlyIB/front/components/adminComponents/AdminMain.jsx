"use client";
import styles from "./AdminStyle.module.css";
import Link from "next/link";
import {
  faUsers,
  faUserPlus,
  faCalendarDays,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import AdminCards from "./AdminCards";
import AdminUser from "./AdminUser";
import AdminSchedule from "./AdminSchedule";
import { useUserStore } from "@/store/user";
import { useEffect, useMemo } from "react";
import AdminQuestion from "./AdminQuestion";
import AdminSubscribe from "./AdminSubscribe";
import { useSubscribeStore } from "@/store/subscribe";
import { useTutoringStore } from "@/store/tutoring";
import { getCookie } from "@/apis/cookies";
import { useQuestionStore } from "@/store/question";

const AdminMain = () => {
  const { userList, getUserList } = useUserStore();
  const { tutoringDateList, getTutoringDateList } = useTutoringStore();
  const { subscribeList, getSubscribeList } = useSubscribeStore();
  const { questionList, getUserQuestionList } = useQuestionStore();
  const activatedUserList = userList.filter((v) => v.userStatus === "ACTIVE");
  const subscribePlanCount = useMemo(
    () => new Set((subscribeList || []).map((item) => item?.title).filter(Boolean)).size,
    [subscribeList]
  );
  const tutoringCount = tutoringDateList?.tutoring?.data?.length ?? 0;

  const tempAccess = {};

  useEffect(() => {
    tempAccess.accessToken = getCookie("accessToken");
    if (tempAccess.accessToken) {
      getUserList(tempAccess);
      getSubscribeList();
      getTutoringDateList("", "", 0, tempAccess);
      getUserQuestionList("", 0, "", tempAccess);
    }
  }, []);

  return (
    <main className={styles.adminPage}>
      <section className={styles.adminHero}>
        <div className={styles.adminHeroCopy}>
          <span className={styles.adminEyebrow}>Monthly IB Admin</span>
          <h1>관리 대시보드</h1>
          <p>
            사용자, 스케줄, 질문, 구독 상품을 한 화면에서 빠르게 확인하고 관리할 수
            있도록 정리된 운영 화면입니다.
          </p>
          <div className={styles.adminHeroActions}>
            <Link href="/adminpage/home-builder">홈 빌더 열기</Link>
          </div>
        </div>
        <div className={styles.adminHeroMeta}>
          <div className={styles.adminMetaCard}>
            <span>활성 회원</span>
            <strong>{activatedUserList?.length}</strong>
          </div>
          <div className={styles.adminMetaCard}>
            <span>질문 대기 / 전체</span>
            <strong>
              {questionList?.filter((item) => item.questionStatus === "ANSWER_WAIT")
                ?.length ?? 0}
              /{questionList?.length ?? 0}
            </strong>
          </div>
        </div>
      </section>

      <section className={styles.adminSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionEyebrow}>Overview</span>
            <h2>운영 현황</h2>
          </div>
        </div>

        <div className={styles.dashboard_top_wrap}>
          <AdminCards
            title="회원"
            number={activatedUserList?.length}
            icon={faUsers}
          />
          <AdminCards
            title="구독상품"
            number={subscribePlanCount}
            icon={faUserPlus}
          />
          <AdminCards
            title="예약 요청"
            number={tutoringCount}
            icon={faCalendarDays}
          />
          <AdminCards
            title="질문"
            number={questionList?.length ?? 0}
            icon={faComments}
          />
        </div>
      </section>

      <section className={styles.adminSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionEyebrow}>Operations</span>
            <h2>회원 및 일정 관리</h2>
          </div>
        </div>

        <div className={styles.dashboard_mid_wrap}>
          <AdminUser />
          <AdminSchedule />
        </div>
      </section>

      <section className={styles.adminSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionEyebrow}>Support</span>
            <h2>질문 및 구독 관리</h2>
          </div>
        </div>

        <div className={styles.dashboard_mid_wrap}>
          <AdminQuestion />
          <AdminSubscribe />
        </div>
      </section>
    </main>
  );
};

export default AdminMain;
