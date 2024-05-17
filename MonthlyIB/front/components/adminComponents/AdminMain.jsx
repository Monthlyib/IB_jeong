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

const AdminMain = () => {
  return (
    <>
      <div className={styles.dashboard_top_wrap}>
        <AdminCards title="회원" number="10" icon={faUsers} />
        <AdminCards title="매출" number="$10,000" icon={faMoneyBill} />
        <AdminCards title="구독자" number="10" icon={faUserPlus} />
        {/* <AdminCards title="튜터링 예약" number="10" icon={faCalendarDays} />
        <AdminCards title="질문" number="10" icon={faComments} /> */}
      </div>
      <div className={styles.dashboard_mid_wrap}>
        <AdminUser />
        <AdminSchedule />
      </div>
    </>
  );
};

export default AdminMain;
