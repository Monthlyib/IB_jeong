import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import shortId from "shortid";

const CourseCurriculum = ({ curriculum }) => {
  const [modalOpen, setModalOpen] = useState(0);

  return (
    <>
      <ul>
        {curriculum?.curriculum?.map((v, i) => (
          <li key={shortId.generate()}>
            <p onClick={() => setModalOpen(i)}>
              {modalOpen === i ? (
                <FontAwesomeIcon icon={faAngleUp} />
              ) : (
                <FontAwesomeIcon icon={faAngleDown} />
              )}
              <span>{v.chapter}</span>
            </p>
            {
              <ul className={modalOpen === i ? styles.active : ""}>
                {v.chapter_content.map((chptCon) => (
                  <li key={shortId.generate()}>{chptCon}</li>
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
