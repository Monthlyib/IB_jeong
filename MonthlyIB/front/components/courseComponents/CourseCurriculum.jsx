"use client";

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import styles from "./CourseDetail.module.css";
import {
  buildLessonProgressMap,
  getLessonProgressLabel,
} from "./courseProgressUtils";

const CourseCurriculum = ({
  curriculum,
  progressSummary,
  isSubscribed,
  onResumeLesson,
  onRestartLesson,
}) => {
  const [modalOpen, setModalOpen] = useState(0);
  const progressMap = useMemo(
    () => buildLessonProgressMap(progressSummary),
    [progressSummary]
  );

  return (
    <ul>
      {curriculum?.chapters?.map((chapter, index) => (
        <li key={chapter.chapterId}>
          <button
            type="button"
            className={styles.courseCurriItemHeader}
            onClick={() => setModalOpen(modalOpen === index ? -1 : index)}
          >
            {modalOpen === index ? (
              <FontAwesomeIcon icon={faAngleUp} />
            ) : (
              <FontAwesomeIcon icon={faAngleDown} />
            )}
            <div>
              <span>{chapter.chapterTitle}</span>
              <small className={styles.courseCurriItemMeta}>
                {chapter.subChapters?.length || 0}개 레슨
              </small>
            </div>
          </button>

          <ul className={modalOpen === index ? styles.active : ""}>
            {chapter.subChapters?.map((subChapter) => {
              const progress = progressMap[subChapter.chapterId];

              return (
                <li key={subChapter.chapterId} className={styles.courseLessonItem}>
                  <div className={styles.courseLessonMain}>
                    <div className={styles.courseLessonText}>
                      <strong>{subChapter.chapterTitle}</strong>
                      <span
                        className={`${styles.courseLessonState} ${
                          progress?.completed
                            ? styles.completed
                            : progress
                            ? styles.inProgress
                            : styles.notStarted
                        }`}
                      >
                        {getLessonProgressLabel(progress)}
                      </span>
                    </div>

                    {isSubscribed && progress && (
                      <div className={styles.courseLessonActions}>
                        <button
                          type="button"
                          onClick={() =>
                            onResumeLesson?.({
                              mainChapterId: chapter.chapterId,
                              subChapterId: subChapter.chapterId,
                            })
                          }
                        >
                          이어보기
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onRestartLesson?.({
                              mainChapterId: chapter.chapterId,
                              subChapterId: subChapter.chapterId,
                            })
                          }
                        >
                          처음부터 보기
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default CourseCurriculum;
