import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import shortId from "shortid";

const CoursePlayerCurriculum = ({ curriculum, className, setNumVideo }) => {
  const [modalOpen, setModalOpen] = useState(0);
  const [subActive, setSubActive] = useState(0);

  let value = -1;

  return (
    <ul className={className}>
      {curriculum?.map((v, i) => (
        <li
          key={shortId.generate()}
          className={modalOpen === i ? styles.active : ""}
          onClick={() => setModalOpen(i)}
        >
          <p>
            {modalOpen === i ? (
              <FontAwesomeIcon icon={faAngleUp} />
            ) : (
              <FontAwesomeIcon icon={faAngleDown} />
            )}
            <span>{v.chapter}</span>
          </p>
          {
            <ul>
              {v.chapter_content.map(function (chptCon) {
                value += 1;
                return (
                  <List
                    key={shortId.generate()}
                    value={value}
                    name={chptCon}
                    setNumVideo={setNumVideo}
                    subActive={subActive}
                    setSubActive={setSubActive}
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

const List = ({ value, name, setNumVideo, subActive, setSubActive }) => {
  return (
    <li className={subActive === value ? styles.active : ""}>
      <button
        type="button"
        onClick={() => {
          setNumVideo(value);
          setSubActive(value);
        }}
      >
        {name}
      </button>
    </li>
  );
};

export default CoursePlayerCurriculum;
