import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./AdminStyle.module.css";

import {
  faUser,
  faUserGear,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const AdminUser = () => {
  return (
    <>
      <div className={styles.dashboard_mid_card}>
        <div className={styles.title}>사용자 관리</div>
        <hr />
        <div className={styles.users}>
          Mark Chang
          <span>
            <FontAwesomeIcon icon={faUser} />
            <FontAwesomeIcon icon={faUserGear} />
            <FontAwesomeIcon icon={faEnvelope} />
          </span>
        </div>
        <hr />
      </div>
    </>
  );
};

export default AdminUser;
