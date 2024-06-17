"use client";
import styles from "./AdminStyle.module.css";
import {
  faUsers,
  faMoneyBill,
  faUserPlus,
  //   faCalendarDays,
  //   faComments,
} from "@fortawesome/free-solid-svg-icons";
import AdminCards from "./AdminCards";
import AdminUser from "./AdminUser";
import AdminSchedule from "./AdminSchedule";
import { useUserStore } from "@/store/user";
import { useEffect } from "react";
import AdminQuestion from "./AdminQuestion";
import AdminSubscribe from "./AdminSubscribe";
import { useSubscribeStore } from "@/store/subscribe";
import { useTutoringStore } from "@/store/tutoring";
import { getCookie } from "@/apis/cookies";
import { useQuestionStore } from "@/store/question";

const AdminMain = () => {
  const { userInfo, userList, getUserList } = useUserStore();
  const { getTutoringDateList } = useTutoringStore();
  const { getSubscribeList } = useSubscribeStore();
  const { getUserQuestionList } = useQuestionStore();

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
    <>
      <div className={styles.dashboard_top_wrap}>
        <AdminCards title="회원" number={userList?.length} icon={faUsers} />
        {/* <AdminCards title="매출" number="$10,000" icon={faMoneyBill} /> */}
        <AdminCards title="구독자" number="10" icon={faUserPlus} />
        {/* <AdminCards title="튜터링 예약" number="10" icon={faCalendarDays} />
        <AdminCards title="질문" number="10" icon={faComments} /> */}
      </div>
      <div className={styles.dashboard_mid_wrap}>
        <AdminUser />
        <AdminSchedule />
      </div>
      <div
        className={styles.dashboard_mid_wrap}
        style={{ marginTop: "5rem", marginBottom: "8rem" }}
      >
        <AdminQuestion />
        <AdminSubscribe />
      </div>
    </>
  );
};

export default AdminMain;
