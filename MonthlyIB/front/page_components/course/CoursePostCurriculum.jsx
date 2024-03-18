import styles from "./CourseComponents.module.css";

const CoursePostCurriculum = ({
  numCurriculumChapter,
  numCurriculumSubChapter,
  addNumCurriSubChapter,
  removeNumCurriSubChapter,
  curriculumChapter,
  setCurriculumChapter,
  subCurriculumChapter,
  setSubCurriculumChapter,
}) => {
  return (
    <>
      <ul>
        {numCurriculumChapter.map((v, i) => (
          <li key={i}>
            <input
              type="text"
              value={curriculumChapter[i]}
              className={styles.write_link}
              placeholder={"강의 챕터 제목을 입력해주세요."}
              onChange={(e) => {
                let temp = [...curriculumChapter];
                temp[i] = e.target.value;
                setCurriculumChapter(temp);
              }}
            />
            {
              <ul>
                {numCurriculumSubChapter[v] &&
                  numCurriculumSubChapter[v].map((s, j) => (
                    <li
                      className={styles.subcurriculum_wrapper}
                      key={`${s}${j}`}
                    >
                      <div className={styles.subcurriculum_btn_wrapper}>
                        <button
                          type="Button"
                          onClick={() => addNumCurriSubChapter(v, i)}
                        >
                          +
                        </button>
                        <button
                          type="Button"
                          onClick={() => removeNumCurriSubChapter(v, i, j)}
                        >
                          -
                        </button>
                      </div>

                      <input
                        key={j}
                        type="text"
                        value={subCurriculumChapter[i][j]}
                        className={styles.write_sub_link}
                        placeholder="서브 챕터 제목을 입력해주세요"
                        onChange={(e) => {
                          let temp = [...subCurriculumChapter];
                          temp[i][j] = e.target.value;
                          setSubCurriculumChapter(temp);
                        }}
                      />
                    </li>
                  ))}
              </ul>
            }
          </li>
        ))}
      </ul>
    </>
  );
};

export default CoursePostCurriculum;
