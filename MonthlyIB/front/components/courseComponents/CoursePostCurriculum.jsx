import styles from "./CourseComponents.module.css";
import { useRef } from "react";

const CoursePostCurriculum = ({
  numCurriculumChapter,
  numCurriculumSubChapter,
  addNumCurriSubChapter,
  removeNumCurriSubChapter,
  setSubChapters,
  setChapters,
}) => {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // 드래그 시작 시 호출되는 핸들러
  const onDragStart = (index) => {
    dragItem.current = index; // 드래그한 아이템의 인덱스 저장
  };

  // 드래그 중 드래그 오버된 아이템의 인덱스를 저장
  const onDragOver = (index) => {
    dragOverItem.current = index;
  };

  // 드래그가 끝났을 때 호출되는 핸들러
  const onDrop = (chapterIndex) => {
    const updatedSubChapters = [...numCurriculumSubChapter[chapterIndex]];

    // 드래그 아이템과 드래그 오버 아이템의 위치 교환
    const dragIndex = dragItem.current;
    const dragOverIndex = dragOverItem.current;

    if (dragIndex !== dragOverIndex && dragIndex !== null && dragOverIndex !== null) {
      // 교환
      const temp = updatedSubChapters[dragIndex];
      updatedSubChapters[dragIndex] = updatedSubChapters[dragOverIndex];
      updatedSubChapters[dragOverIndex] = temp;

      // chapterIndex 동기화
      updatedSubChapters[dragIndex].chapterIndex = dragIndex;
      updatedSubChapters[dragOverIndex].chapterIndex = dragOverIndex;

      // 상태 업데이트
      const newSubChapters = { ...numCurriculumSubChapter, [chapterIndex]: updatedSubChapters };
      setSubChapters(newSubChapters);
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <ul style={{ listStyle: "none" }}>
      {numCurriculumChapter?.map((chapter, chapterIndex) => (
        <li key={chapterIndex}>
          {/* 챕터 제목 입력 */}
          <input
            type="text"
            value={chapter.chapterTitle}
            className={styles.write_link}
            placeholder="강의 챕터 제목을 입력해주세요."
            onChange={(e) => {
              const updatedChapters = [...numCurriculumChapter];
              updatedChapters[chapterIndex].chapterTitle = e.target.value;
              setChapters(updatedChapters);
            }}
          />

          {/* 서브 챕터 리스트 */}
          <ul style={{ listStyle: "none" }}>
            {numCurriculumSubChapter[chapterIndex]?.map((subChapter, subIndex) => (
              <li
                key={subChapter.chapterId}
                className={styles.subcurriculum_wrapper}
                draggable
                onDragStart={() => onDragStart(subIndex)}
                onDragOver={(e) => {
                  e.preventDefault(); // 기본 이벤트 막기
                  onDragOver(subIndex);
                }}
                onDrop={() => onDrop(chapterIndex)}
              >
                <div className={styles.subcurriculum_btn_wrapper}>
                  {/* 서브 챕터 추가 버튼 */}
                  <button type="button" onClick={() => addNumCurriSubChapter(chapterIndex)}>
                    +
                  </button>

                  {/* 서브 챕터 제거 버튼 */}
                  <button type="button" onClick={() => removeNumCurriSubChapter(chapterIndex, subIndex)}>
                    -
                  </button>
                </div>

                {/* 서브 챕터 제목 입력 */}
                <input
                  type="text"
                  value={subChapter.chapterTitle}
                  className={styles.write_sub_link}
                  placeholder="서브 챕터 제목을 입력해주세요"
                  onChange={(e) => {
                    const updatedSubChapters = [...numCurriculumSubChapter[chapterIndex]];
                    updatedSubChapters[subIndex].chapterTitle = e.target.value;
                    setSubChapters({ ...numCurriculumSubChapter, [chapterIndex]: updatedSubChapters });
                  }}
                />

                {/* 서브 챕터 영상 링크 입력 */}
                <input
                  type="url"
                  value={subChapter.videoFileUrl}
                  className={styles.write_link}
                  placeholder="영상 링크를 넣어주세요."
                  onChange={(e) => {
                    const updatedSubChapters = [...numCurriculumSubChapter[chapterIndex]];
                    updatedSubChapters[subIndex].videoFileUrl = e.target.value;
                    setSubChapters({ ...numCurriculumSubChapter, [chapterIndex]: updatedSubChapters });
                  }}
                />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default CoursePostCurriculum;
