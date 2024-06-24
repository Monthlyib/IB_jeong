import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { range } from "lodash";
import styles from "./Pagination.module.css";

const Pagination = ({
  contents,
  currentPage,
  numShowContents,
  onPageChange,
}) => {
  const pageCount = contents.length / numShowContents;
  const pages = range(1, Math.ceil(pageCount) + 1);
  return (
    <div className={styles.page_cont}>
      <ul style={{ listStyle: "none" }}>
        <li>
          <a
            onClick={() =>
              currentPage > 1 ? onPageChange(currentPage - 1) : null
            }
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </a>
        </li>
        {pages.map((page, i) => (
          <li key={i} className={page === currentPage ? styles.active : null}>
            <a onClick={() => onPageChange(page)}>{page}</a>
          </li>
        ))}

        <li>
          <a
            onClick={() =>
              Math.ceil(pageCount) > currentPage
                ? onPageChange(currentPage + 1)
                : null
            }
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
