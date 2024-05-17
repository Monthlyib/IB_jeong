import { v4 as uuidv4 } from "uuid";
import { Results } from "./LearningStyleContents";
import styles from "./LearningStyle.module.css";
import { useRouter } from "next/navigation";

const setCategory = (arr) => {
  let first,
    second,
    third,
    fourth = "0";

  if (arr[0] <= 6) first = "6";
  else if (arr[0] <= 12) first = "12";
  else if (arr[0] <= 18) first = "18";
  else first = "24";

  if (arr[1] <= 5) second = "5";
  else if (arr[1] <= 10) second = "10";
  else if (arr[1] <= 15) second = "15";
  else second = "20";

  if (arr[2] <= 7) third = "7";
  else if (arr[2] <= 14) third = "14";
  else if (arr[2] <= 21) third = "21";
  else third = "28";

  if (arr[3] <= 5) fourth = "5";
  else if (arr[3] <= 10) fourth = "10";
  else if (arr[3] <= 15) fourth = "15";
  else fourth = "20";

  return [first, second, third, fourth];
};

const LearningStyleResults = ({ sumUpData, setShowResult, setTypeOne }) => {
  const [first, second, third, fourth] = setCategory(sumUpData);
  const wrapClass = {
    first,
    second,
    third,
    fourth,
  };

  const router = useRouter();

  const onClickSumbit = (e) => {
    e.preventDefault();
    setShowResult(false);
    setTypeOne({
      first: [-1, -1, -1, -1, -1, -1],
      second: [-1, -1, -1, -1, -1],
      third: [-1, -1, -1, -1, -1, -1, -1, -1],
      fourth: [-1, -1, -1, -1, -1],
    });
    router.push("/learningtest");
  };

  return (
    <div className={styles.learning_style_result_wrap}>
      {Object.entries(Results).map(([key, value], i) => (
        <div key={uuidv4()}>
          <div key={uuidv4()} className={styles.learning_style_result_title}>
            {value.title}
          </div>
          <div className={styles.learning_style_result_type_content_wrap}>
            <span key={uuidv4()} className={styles.learning_style_result_type}>
              {value[wrapClass[key]]?.type}
              <br />
              <p>{value[wrapClass[key]]?.typeExp}</p>
            </span>
            <span
              key={uuidv4()}
              className={styles.learning_style_result_content}
            >
              {value[wrapClass[key]]?.contents}
              <p key={uuidv4()}>
                <br />
                <span
                  key={uuidv4()}
                  className={styles.learning_style_result_highlight}
                >
                  {value[wrapClass[key]]?.highlights}
                </span>
              </p>
            </span>
          </div>
        </div>
      ))}
      <button
        className={styles.learning_style_back_btn}
        onClick={onClickSumbit}
      >
        돌아가기
      </button>
    </div>
  );
};
export default LearningStyleResults;
