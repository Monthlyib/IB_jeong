"use client";
import styles from "./AdminStyle.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminCards = ({ title, number, icon }) => {
  return (
    <>
      <div className={styles.dashboard_top}>
        <div className={styles.dashboard_card_top}>
          <div className={styles.row}>
            <div className={styles.left}>
              <FontAwesomeIcon icon={icon} />
            </div>
            <div className={styles.right}>
              <div className={styles.title}>{title}</div>
              <div className={styles.number}>{number}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCards;
