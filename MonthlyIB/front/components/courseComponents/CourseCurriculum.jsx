"use client";

import { useState } from "react";
import shortid from "shortid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import styles from "./CourseDetail.module.css";

const CourseCurriculum = ({ curriculum }) => {
  const [modalOpen, setModalOpen] = useState(0);

  return (
    <ul>
      {curriculum?.chapters?.map((chapter, index) => (
        <li key={shortid.generate()}>
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
            {chapter.subChapters?.map((subChapter) => (
              <li key={shortid.generate()}>{subChapter.chapterTitle}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default CourseCurriculum;
