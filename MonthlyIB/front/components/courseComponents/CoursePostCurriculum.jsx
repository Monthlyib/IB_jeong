import styles from "./CourseComponents.module.css";

const CoursePostCurriculum = ({
  numCurriculumChapter,
  numCurriculumSubChapter,
  addNumCurriSubChapter,
  removeNumCurriSubChapter,
  setSubChapters,
  setChapters,
}) => {
  return (
    <>
      <ul style={{ listStyle: "none" }}>
        {numCurriculumChapter?.map((v, i) => (
          <li key={i}>
            <input
              type="text"
              value={numCurriculumChapter[i].chapterTitle}
              className={styles.write_link}
              placeholder="강의 챕터 제목을 입력해주세요."
              onChange={(e) => {
                let temp = [...numCurriculumChapter];
                temp[i].chapterTitle = e.target.value;
                setChapters(temp);
              }}
            />
            {
              <ul style={{ listStyle: "none" }}>
                {numCurriculumSubChapter[i] &&
                  numCurriculumSubChapter[i].map((s, j) => (
                    <li
                      className={styles.subcurriculum_wrapper}
                      key={`${s}${j}`}
                    >
                      <div className={styles.subcurriculum_btn_wrapper}>
                        <button
                          type="Button"
                          onClick={() => addNumCurriSubChapter()}
                        >
                          +
                        </button>
                        <button
                          type="Button"
                          onClick={() => removeNumCurriSubChapter(j)}
                        >
                          -
                        </button>
                      </div>

                      <input
                        key={j}
                        type="text"
                        value={numCurriculumSubChapter[i][j].chapterTitle}
                        className={styles.write_sub_link}
                        placeholder="서브 챕터 제목을 입력해주세요"
                        onChange={(e) => {
                          let temp = { ...numCurriculumSubChapter };
                          temp[i][j].chapterTitle = e.target.value;
                          setSubChapters(temp);
                        }}
                      />
                      <input
                        style={{ marginLeft: "1rem" }}
                        type="url"
                        value={numCurriculumSubChapter[i][j].videoFileUrl}
                        className={styles.write_link}
                        onChange={(e) => {
                          let temp = { ...numCurriculumSubChapter };
                          temp[i][j].videoFileUrl = e.target.value;
                          setSubChapters(temp);
                        }}
                        placeholder="영상 링크를 넣어주세요."
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
