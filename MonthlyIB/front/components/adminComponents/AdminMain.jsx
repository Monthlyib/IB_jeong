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
import { useEffect, useMemo, useState } from "react";
import AdminQuestion from "./AdminQuestion";
import AdminSubscribe from "./AdminSubscribe";
import AdminCalculatorRecommendations from "./AdminCalculatorRecommendations";
import { useSubscribeStore } from "@/store/subscribe";
import { useTutoringStore } from "@/store/tutoring";
import { getCookie } from "@/apis/cookies";
import { questionGetUserList } from "@/apis/questionAPI";

const AdminMain = () => {
  const { userList, getUserList } = useUserStore();
  const { tutoringDateList, getTutoringDateList } = useTutoringStore();
  const { subscribeList, getSubscribeList } = useSubscribeStore();
  const activatedUserList = userList.filter((v) => v.userStatus === "ACTIVE");
  const subscribePlanCount = useMemo(
    () => new Set((subscribeList || []).map((item) => item?.title).filter(Boolean)).size,
    [subscribeList]
  );
  const tutoringCount = tutoringDateList?.tutoring?.data?.length ?? 0;
  const [questionMetrics, setQuestionMetrics] = useState({ total: 0, waiting: 0 });

  const tempAccess = {};

  useEffect(() => {
    tempAccess.accessToken = getCookie("accessToken");
    if (!tempAccess.accessToken) {
      return;
    }

    const fetchQuestionMetrics = async () => {
      const [totalResponse, waitingResponse] = await Promise.all([
        questionGetUserList("", 0, "", tempAccess, 1),
        questionGetUserList("ANSWER_WAIT", 0, "", tempAccess, 1),
      ]);

      setQuestionMetrics({
        total: totalResponse?.pageInfo?.totalElements ?? 0,
        waiting: waitingResponse?.pageInfo?.totalElements ?? 0,
      });
    };

    if (tempAccess.accessToken) {
      getUserList(tempAccess);
      getSubscribeList();
      getTutoringDateList("", "", 0, tempAccess);
      fetchQuestionMetrics();
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
              {questionMetrics.waiting}/{questionMetrics.total}
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
            number={questionMetrics.total}
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

      <section className={styles.adminSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionEyebrow}>Calculator</span>
            <h2>합격 예측 계산기 관리</h2>
          </div>
        </div>

        <div className={styles.dashboard_single_wrap}>
          <AdminCalculatorRecommendations />
        </div>
      </section>
    </main>
  );
};

export default AdminMain;
