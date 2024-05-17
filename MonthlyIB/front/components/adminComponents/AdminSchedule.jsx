import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./AdminStyle.module.css";

import { faPen, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const AdminSchedule = () => {
  return (
    <>
      <div className={styles.dashboard_mid_card}>
        <div className={styles.title}>스케쥴링 관리</div>
        <hr />
        <div className={styles.schedule}>
          Mark Chang
          <span>2024-04-30 09:30</span>
          <span>
            <FontAwesomeIcon icon={faPen} />
            <FontAwesomeIcon icon={faEnvelope} />
          </span>
        </div>
        <hr />
      </div>
    </>
  );
};

export default AdminSchedule;
