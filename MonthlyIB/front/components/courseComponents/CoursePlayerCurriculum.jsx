"use client";

import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import {
  buildLessonProgressMap,
  getLessonProgressLabel,
} from "./courseProgressUtils";

const CoursePlayerCurriculum = ({
  curriculum,
  className,
  activeMainChapterId,
  activeSubChapterId,
  onSelectLesson,
  progressSummary,
  onResumeLesson,
  onRestartLesson,
}) => {
  const progressMap = useMemo(
    () => buildLessonProgressMap(progressSummary),
    [progressSummary]
  );
  const [modalOpen, setModalOpen] = useState(activeMainChapterId || null);

  useEffect(() => {
    if (activeMainChapterId) {
      setModalOpen(activeMainChapterId);
    }
  }, [activeMainChapterId]);

  return (
    <ul className={className} style={{ listStyle: "none" }}>
      {curriculum?.map((chapter) => {
        const isOpen = modalOpen === chapter.chapterId;

        return (
          <li
            key={chapter.chapterId}
            className={isOpen ? styles.active : ""}
          >
            <button
              type="button"
              className={styles.playerCurriculumChapter}
              onClick={() =>
                setModalOpen((prev) =>
                  prev === chapter.chapterId ? null : chapter.chapterId
                )
              }
            >
              <span>
                <FontAwesomeIcon
                  icon={isOpen ? faAngleUp : faAngleDown}
                />
                <strong>{chapter.chapterTitle}</strong>
              </span>
              <small>{chapter.subChapters?.length || 0}개 레슨</small>
            </button>

            <ul>
              {chapter.subChapters?.map((subChapter) => {
                const progress = progressMap[subChapter.chapterId];
                const isActive = activeSubChapterId === subChapter.chapterId;

                return (
                  <li
                    key={subChapter.chapterId}
                    className={isActive ? styles.active : ""}
                  >
                    <div className={styles.playerLessonRow}>
                      <button
                        type="button"
                        className={styles.playerLessonButton}
                        onClick={() =>
                          onSelectLesson?.({
                            mainChapterId: chapter.chapterId,
                            subChapterId: subChapter.chapterId,
                          })
                        }
                      >
                        <span className={styles.playerLessonTitle}>
                          {subChapter.chapterTitle}
                        </span>
                        <span
                          className={`${styles.playerLessonState} ${
                            progress?.completed
                              ? styles.completed
                              : progress
                              ? styles.inProgress
                              : styles.notStarted
                          }`}
                        >
                          {getLessonProgressLabel(progress)}
                        </span>
                      </button>

                      {progress && (
                        <div className={styles.playerLessonActions}>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onResumeLesson?.({
                                mainChapterId: chapter.chapterId,
                                subChapterId: subChapter.chapterId,
                              });
                            }}
                          >
                            이어보기
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onRestartLesson?.({
                                mainChapterId: chapter.chapterId,
                                subChapterId: subChapter.chapterId,
                              });
                            }}
                          >
                            처음부터
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
};

export default CoursePlayerCurriculum;
