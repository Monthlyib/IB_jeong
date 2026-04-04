import styles from "./CourseComponents.module.css";
import { useRef } from "react";

const CoursePostCurriculum = ({
  chapters,
  addNumCurriSubChapter,
  removeNumCurriSubChapter,
  setChapters,
  handleCurriculumChange,
  handleLessonVideoModeChange,
  handleLessonVideoUpload,
}) => {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const onDragStart = (index) => {
    dragItem.current = index;
  };

  const onDragOver = (index) => {
    dragOverItem.current = index;
  };

  const onDrop = (chapterIndex) => {
    const dragIndex = dragItem.current;
    const dragOverIndex = dragOverItem.current;

    if (
      dragIndex === null ||
      dragOverIndex === null ||
      dragIndex === dragOverIndex
    ) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    setChapters((prev) =>
      prev.map((chapter, currentChapterIndex) => {
        if (currentChapterIndex !== chapterIndex) {
          return chapter;
        }

        const updatedSubChapters = [...(chapter.subChapters || [])];
        const [draggedLesson] = updatedSubChapters.splice(dragIndex, 1);
        updatedSubChapters.splice(dragOverIndex, 0, draggedLesson);

        return {
          ...chapter,
          subChapters: updatedSubChapters,
        };
      })
    );

    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <ul style={{ listStyle: "none" }}>
      {chapters?.map((chapter, chapterIndex) => (
        <li key={chapter.chapterId ?? `chapter-${chapterIndex}`}>
          <input
            type="text"
            value={chapter.chapterTitle}
            className={styles.write_link}
            placeholder="강의 챕터 제목을 입력해주세요."
            onChange={(e) => {
              handleCurriculumChange(chapterIndex, null, {
                chapterTitle: e.target.value,
              });
            }}
          />

          <ul style={{ listStyle: "none" }}>
            {chapter.subChapters?.map((subChapter, subIndex) => (
              <li
                key={subChapter.chapterId ?? `lesson-${chapterIndex}-${subIndex}`}
                className={styles.subcurriculum_wrapper}
                draggable
                onDragStart={() => onDragStart(subIndex)}
                onDragOver={(e) => {
                  e.preventDefault();
                  onDragOver(subIndex);
                }}
                onDrop={() => onDrop(chapterIndex)}
              >
                <div className={styles.subcurriculum_btn_wrapper}>
                  <button
                    type="button"
                    onClick={() => addNumCurriSubChapter(chapterIndex)}
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removeNumCurriSubChapter(chapterIndex, subIndex)
                    }
                  >
                    -
                  </button>
                </div>

                <div className={styles.lessonEditorCard}>
                  <input
                    type="text"
                    value={subChapter.chapterTitle}
                    className={styles.write_sub_link}
                    placeholder="서브 챕터 제목을 입력해주세요"
                    onChange={(e) => {
                      handleCurriculumChange(chapterIndex, subIndex, {
                        chapterTitle: e.target.value,
                      });
                    }}
                  />

                  <div className={styles.lessonVideoMode}>
                    <button
                      type="button"
                      className={
                        subChapter.videoInputMode === "youtube"
                          ? styles.lessonVideoModeActive
                          : ""
                      }
                      onClick={() =>
                        handleLessonVideoModeChange(
                          chapterIndex,
                          subIndex,
                          "youtube"
                        )
                      }
                    >
                      YouTube 링크
                    </button>
                    <button
                      type="button"
                      className={
                        subChapter.videoInputMode === "upload"
                          ? styles.lessonVideoModeActive
                          : ""
                      }
                      onClick={() =>
                        handleLessonVideoModeChange(
                          chapterIndex,
                          subIndex,
                          "upload"
                        )
                      }
                    >
                      동영상 파일
                    </button>
                  </div>

                  {subChapter.videoInputMode === "youtube" ? (
                    <input
                      type="url"
                      value={subChapter.videoFileUrl}
                      className={styles.write_link}
                      placeholder="유튜브 링크를 넣어주세요."
                      onChange={(e) => {
                        handleCurriculumChange(chapterIndex, subIndex, {
                          videoFileUrl: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    <div className={styles.lessonUploadArea}>
                      <input
                        type="file"
                        accept="video/*"
                        className={styles.write_file}
                        disabled={subChapter.uploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) {
                            return;
                          }

                          handleLessonVideoUpload(chapterIndex, subIndex, file);
                          e.target.value = "";
                        }}
                      />
                      <p className={styles.lessonUploadStatus}>
                        {subChapter.uploading
                          ? "동영상을 업로드 중입니다..."
                          : subChapter.uploadedFileName ||
                            "업로드된 파일이 없습니다."}
                      </p>
                      {subChapter.videoFileUrl ? (
                        <a
                          href={subChapter.videoFileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.lessonUploadLink}
                        >
                          현재 업로드된 영상 확인
                        </a>
                      ) : null}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default CoursePostCurriculum;
