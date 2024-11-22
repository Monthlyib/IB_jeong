import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./Pagination.module.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className={styles.page_cont}>
      <ul style={{ listStyle: "none" }}>
        {/* 이전 페이지 버튼 */}
        <li>
          <a
            onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
            style={{ cursor: hasPreviousPage ? "pointer" : "not-allowed" }}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </a>
        </li>

        {/* 페이지 번호 */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li
            key={page}
            className={page === currentPage ? styles.active : ""}
          >
            <a onClick={() => onPageChange(page)}>{page}</a>
          </li>
        ))}

        {/* 다음 페이지 버튼 */}
        <li>
          <a
            onClick={() => hasNextPage && onPageChange(currentPage + 1)}
            style={{ cursor: hasNextPage ? "pointer" : "not-allowed" }}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
