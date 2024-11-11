import styles from "./CourseComponents.module.css";
import { useEffect } from "react";

const CoursePostCurriculum = ({
  numCurriculumChapter, // 전체 챕터 리스트
  numCurriculumSubChapter, // 각 챕터에 대한 서브 챕터 리스트
  addNumCurriSubChapter, // 서브 챕터 추가 함수
  removeNumCurriSubChapter, // 서브 챕터 제거 함수
  setSubChapters, // 서브 챕터 상태 업데이트 함수
  setChapters, // 챕터 상태 업데이트 함수
}) => {
  // 컴포넌트가 렌더링될 때마다 챕터 및 서브 챕터 정보 콘솔 출력
  useEffect(() => {
    console.log("numCurriculumChapter", numCurriculumChapter);
    console.log("numCurriculumSubChapter", numCurriculumSubChapter);
  }, [numCurriculumChapter, numCurriculumSubChapter]);

  return (
    <>
      <ul style={{ listStyle: "none" }}>
        {numCurriculumChapter?.map((v, i) => (
          // 각 챕터 렌더링
          <li key={i}>
            <input
              type="text"
              value={numCurriculumChapter[i].chapterTitle} // 챕터 제목
              className={styles.write_link}
              placeholder="강의 챕터 제목을 입력해주세요."
              onChange={(e) => {
                // 챕터 제목 변경 시 상태 업데이트
                let temp = [...numCurriculumChapter];
                temp[i].chapterTitle = e.target.value;
                setChapters(temp);
              }}
            />

            {/* 서브 챕터 리스트 렌더링 */}
            <ul style={{ listStyle: "none" }}>
              {numCurriculumSubChapter[i] &&
                numCurriculumSubChapter[i].map((s, j) => (
                  <li className={styles.subcurriculum_wrapper} key={`${s}${j}`}>
                    <div className={styles.subcurriculum_btn_wrapper}>
                      {/* 서브 챕터 추가 버튼 */}
                      <button type="Button" onClick={() => addNumCurriSubChapter(i)}>
                        +
                      </button>

                      {/* 서브 챕터 제거 버튼 */}
                      <button type="Button" onClick={() => removeNumCurriSubChapter(i,j)}>
                        -
                      </button>
                    </div>

                    {/* 서브 챕터 제목 입력 필드 */}
                    <input
                      key={j}
                      type="text"
                      value={numCurriculumSubChapter[i][j].chapterTitle}
                      className={styles.write_sub_link}
                      placeholder="서브 챕터 제목을 입력해주세요"
                      onChange={(e) => {
                        // 서브 챕터 제목 변경 시 상태 업데이트
                        let temp = { ...numCurriculumSubChapter };
                        temp[i][j].chapterTitle = e.target.value;
                        setSubChapters(temp);
                      }}
                    />

                    {/* 서브 챕터 영상 링크 입력 필드 */}
                    <input
                      style={{ marginLeft: "1rem" }}
                      type="url"
                      value={numCurriculumSubChapter[i][j].videoFileUrl}
                      className={styles.write_link}
                      onChange={(e) => {
                        // 서브 챕터 영상 링크 변경 시 상태 업데이트
                        let temp = { ...numCurriculumSubChapter };
                        temp[i][j].videoFileUrl = e.target.value;
                        setSubChapters(temp);
                      }}
                      placeholder="영상 링크를 넣어주세요."
                    />
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CoursePostCurriculum;
