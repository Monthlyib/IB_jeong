import styles from "./LearningStyle.module.css";

import LearningStyleOptions from "./LearningStyleOptions";

const LearningStyleTypes = ({
  contents,
  type,
  key_ind,
  onClickCircle,
  moveRef,
}) => {
  return (
    <>
      {Object.entries(contents).map(([key, value], ind) => (
        // contents는 몇번: 내용
        // i는 몇번째에 array에 클릭을 했는지
        <div
          className={styles.learning_style_content}
          ref={(element) => {
            moveRef.current[key] = element;
          }}
          key={value}
          style={{ userSelect: "none" }}
        >
          {value}
          <LearningStyleOptions
            type={type}
            onClickCircle={onClickCircle}
            key_ind={key_ind}
            ind={ind}
            key={value}
            index={key}
          />
        </div>
      ))}
    </>
  );
};

export default LearningStyleTypes;
