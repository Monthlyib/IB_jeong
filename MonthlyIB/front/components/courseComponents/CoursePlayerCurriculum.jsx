"use client";
import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import shortid from "shortid";

const CoursePlayerCurriculum = ({
  curriculum,
  className,
  setChapterNum,
  subChapterNum,
  setSubChapterNum,
}) => {
  const [modalOpen, setModalOpen] = useState(0);

  let value = -1;

  return (
    <ul className={className}>
      {curriculum?.map((v, i) => (
        <li
          key={shortid.generate()}
          className={modalOpen === i ? styles.active : ""}
          onClick={() => {
            setModalOpen(i);
            setChapterNum(i);
          }}
        >
          <p style={{ color: "white" }}>
            {modalOpen === i ? (
              <FontAwesomeIcon icon={faAngleUp} />
            ) : (
              <FontAwesomeIcon icon={faAngleDown} />
            )}
            <span style={{ color: "white" }}>{v.chapterTitle}</span>
          </p>
          {
            <ul>
              {v.subChapters.map(function (s, i) {
                value += 1;
                return (
                  <List
                    key={shortid.generate()}
                    value={value}
                    index={i}
                    name={s.chapterTitle}
                    subActive={subChapterNum}
                    setSubActive={setSubChapterNum}
                    setSubChapterNum={setSubChapterNum}
                  />
                );
              })}
            </ul>
          }
        </li>
      ))}
    </ul>
  );
};

const List = ({
  value,
  index,
  name,
  subActive,
  setSubActive,
  setSubChapterNum,
}) => {
  return (
    <li className={subActive === value ? styles.active : ""}>
      <button
        type="button"
        onClick={() => {
          setSubActive(value);
          setSubChapterNum(index);
        }}
      >
        {name}
      </button>
    </li>
  );
};

export default CoursePlayerCurriculum;
