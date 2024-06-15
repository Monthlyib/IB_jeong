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

const AdminMain = () => {
  const { userInfo, userList, getUserList } = useUserStore();

  useEffect(() => {
    getUserList(userInfo);
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
