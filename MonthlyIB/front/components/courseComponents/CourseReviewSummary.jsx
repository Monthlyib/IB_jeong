import styles from "./CourseDetail.module.css";
const CourseReviewSummary = ({ reviewPoint }) => {
  return (
    <div className={styles.review_aver_right}>
      <ul style={{ listStyle: "none" }}>
        <li>
          <p className={styles.arg_bar}>
            <span style={{ height: `${reviewPoint["1"] * 100}%` }}></span>
          </p>
          <span>1점</span>
        </li>
        <li>
          <p className={styles.arg_bar}>
            <span style={{ height: `${reviewPoint["2"] * 100}%` }}></span>
          </p>
          <span>2점</span>
        </li>
        <li>
          <p className={styles.arg_bar}>
            <span style={{ height: `${reviewPoint["3"] * 100}%` }}></span>
          </p>
          <span>3점</span>
        </li>
        <li>
          <p className={styles.arg_bar}>
            <span style={{ height: `${reviewPoint["4"] * 100}%` }}></span>
          </p>
          <span>4점</span>
        </li>
        <li>
          <p className={styles.arg_bar}>
            <span style={{ height: `${reviewPoint["5"] * 100}%` }}></span>
          </p>
          <span>5점</span>
        </li>
      </ul>
    </div>
  );
};

export default CourseReviewSummary;
