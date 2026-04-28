import styles from "./IbComponents.module.css";
import Pagination from "../layoutComponents/Paginatation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPenAlt, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useIBStore } from "@/store/ib";
import { useUserInfo } from "@/store/user";
import { useRouter } from "next/navigation";

const IbItems = ({
  IBContents,
  currentPage,
  pageInfo,
  loading,
  error,
  searchKeyword,
  onPageChange,
}) => {
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const { deleteIBList } = useIBStore();

  const totalPages = Math.max(pageInfo?.totalPages || 1, 1);
  const featuredPost = IBContents?.[0];
  const archivePosts = featuredPost ? IBContents.slice(1) : [];

  const onClickDelete = async (e, num) => {
    e.stopPropagation();
    const confirmed = window.confirm("이 월간 IB 글을 삭제할까요?");
    if (!confirmed) return;
    await deleteIBList(num, userInfo, currentPage, searchKeyword);
  };

  const onClickRevise = async (e, num) => {
    e.stopPropagation();
    router.push(`/ibwrite?monthlyIbId=${num}`);
  };

  const onClickPost = async (num) => {
    router.push(`/ib/${num}`);
  };

  const getExcerpt = (html = "") => {
    const text = html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();

    if (!text) {
      return "상세 페이지에서 원문과 PDF 다운로드를 확인할 수 있습니다.";
    }

    return text.length > 116 ? `${text.slice(0, 116)}...` : text;
  };

  const renderCover = (content, className = "") => {
    const hasThumbnail = Boolean(content?.monthlyIbThumbnailUrl);

    if (!hasThumbnail) {
      return (
        <div className={`${styles.coverPlaceholder} ${className}`}>
          <span>Monthly IB</span>
        </div>
      );
    }

    return (
      <Image
        src={content.monthlyIbThumbnailUrl}
        alt={content.title || "Monthly IB cover"}
        priority={content === featuredPost}
        width={900}
        height={1080}
        className={className}
      />
    );
  };

  const renderAdminActions = (content) => {
    if (userInfo?.authority !== "ADMIN") return null;

    return (
      <div className={styles.adminActions}>
        <button
          type="button"
          onClick={(e) => onClickRevise(e, content.monthlyIbId)}
          aria-label={`${content.title} 수정`}
        >
          <FontAwesomeIcon icon={faPenAlt} />
          <span>수정</span>
        </button>
        <button
          type="button"
          onClick={(e) => onClickDelete(e, content.monthlyIbId)}
          aria-label={`${content.title} 삭제`}
          className={styles.deleteAction}
        >
          <FontAwesomeIcon icon={faTrashCan} />
          <span>삭제</span>
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <section className={styles.stateCard}>
        <div className={styles.loader} />
        <h2>월간 IB를 불러오는 중입니다.</h2>
        <p>최신 아카이브를 정리하고 있습니다.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.stateCard}>
        <span className={styles.stateEyebrow}>LOAD ERROR</span>
        <h2>목록을 불러오지 못했습니다.</h2>
        <p>{error}</p>
      </section>
    );
  }

  if (!IBContents?.length) {
    return (
      <section className={styles.stateCard}>
        <span className={styles.stateEyebrow}>EMPTY ARCHIVE</span>
        <h2>등록된 글이 없습니다.</h2>
        <p>새로운 Monthly IB 콘텐츠가 등록되면 이곳에서 확인할 수 있습니다.</p>
      </section>
    );
  }

  return (
    <section className={styles.archiveSection}>
      {featuredPost && (
        <article
          className={styles.featuredCard}
          onClick={() => onClickPost(featuredPost.monthlyIbId)}
        >
          <figure>{renderCover(featuredPost)}</figure>
          <div className={styles.featuredBody}>
            <span className={styles.cardKicker}>LATEST ISSUE</span>
            <h2>{featuredPost.title}</h2>
            <p>{getExcerpt(featuredPost.content)}</p>
            <div className={styles.cardFooter}>
              <button type="button" className={styles.readMore}>
                읽어보기
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
          {renderAdminActions(featuredPost)}
        </article>
      )}

      {archivePosts.length > 0 && (
        <div className={styles.archiveHeader}>
          <span>Archive</span>
          <h2>지난 월간 IB</h2>
        </div>
      )}

      <div className={styles.archiveGrid}>
        {archivePosts.map((content) => (
          <article
            className={styles.ibCard}
            key={content.monthlyIbId}
            onClick={() => onClickPost(content.monthlyIbId)}
          >
            <figure>{renderCover(content)}</figure>
            <div className={styles.ibCardBody}>
              <span className={styles.cardKicker}>Monthly IB</span>
              <h3>{content.title}</h3>
              <p>{getExcerpt(content.content)}</p>
              <span className={styles.inlineLink}>
                읽어보기
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </div>
            {renderAdminActions(content)}
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          numShowContents={pageInfo?.size || 10}
          onPageChange={onPageChange}
          compact
        />
      )}
    </section>
  );
};

export default IbItems;
