"use client";
import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import shortid from "shortid";

const CourseCurriculum = ({ curriculum }) => {
  const [modalOpen, setModalOpen] = useState(0);

  return (
    <>
      <ul style={{ listStyle: "none" }}>
        {curriculum?.chapters?.map((v, i) => (
          <li key={shortid.generate()}>
            <p onClick={() => setModalOpen(i)}>
              {modalOpen === i ? (
                <FontAwesomeIcon icon={faAngleUp} />
              ) : (
                <FontAwesomeIcon icon={faAngleDown} />
              )}
              <span>{v.chapterTitle}</span>
            </p>
            {
              <ul
                className={modalOpen === i ? styles.active : ""}
                style={{ listStyle: "none" }}
              >
                {v.subChapters.map((s) => (
                  <li key={shortid.generate()}>{s.chapterTitle}</li>
                ))}
              </ul>
            }
          </li>
        ))}
      </ul>
    </>
  );
};

export default CourseCurriculum;
