import styles from "./LearningStyle.module.css";

const LearningStyleOptions = ({ type, onClickCircle, key_ind, ind, index }) => {
  const points = [0, 1, 2, 3, 4];
  const classNameList = {
    0: [styles.first_circle_active, styles.first_circle],
    1: [styles.second_circle_active, styles.second_circle],
    2: [styles.third_circle_active, styles.third_circle],
    3: [styles.fourth_circle_active, styles.fourth_circle],
    4: [styles.fifth_circle_active, styles.fifth_circle],
  };
  return (
    <div className={styles.learning_style_content_options}>
      <p style={{ userSelect: "none" }}>전혀 아니다</p>
      {points.map((point) => (
        <span
          className={
            type[key_ind][ind] == point
              ? classNameList[point][0]
              : classNameList[point][1]
          }
          key={point}
          onClick={() => onClickCircle(key_ind, ind, point, type, index)}
        ></span>
      ))}
      <p style={{ userSelect: "none" }}>매우 그렇다.</p>
    </div>
  );
};

export default LearningStyleOptions;
