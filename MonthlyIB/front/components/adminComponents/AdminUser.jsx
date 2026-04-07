import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./AdminStyle.module.css";
import {
  faUser,
  faUserGear,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useUserInfo, useUserStore } from "@/store/user";
import { useEffect, useMemo, useState } from "react";
import AdminUserDetail from "./AdminUserDetail";
import AdminUserAdminModal from "./AdminUserAdminModal";
import AdminScheduleModal from "./AdminSchedulemodal";
import Paginatation from "../layoutComponents/Paginatation";
import { useSubscribeStore } from "@/store/subscribe";
import { getKnitSubscribeDataList } from "@/utils/utils";
import {
  createMailInlineImageEntries,
  isMailContentEmpty,
  mailPost,
  prepareMailHtmlContent,
  revokeMailInlineImagePreviews,
  validateMailAttachments,
} from "@/apis/mail";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const SORT_LABELS = {
  username: "ID",
  nickName: "Name",
};

const compareText = (left = "", right = "", direction = "asc") => {
  const result = String(left).localeCompare(String(right), "ko", {
    numeric: true,
    sensitivity: "base",
  });
  return direction === "asc" ? result : -result;
};

const AdminUser = () => {
  const { userInfo } = useUserInfo();
  const { userList, userDetailInfo, getUserInfo, reviseUserInfo } =
    useUserStore();
  const { subscribeList } = useSubscribeStore();

  const [modal, setModal] = useState(false);
  const [adminModal, setAdminModal] = useState(false);
  const [mailModal, setMailModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [detail, setDetail] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [inlineImages, setInlineImages] = useState([]);
  const [mailSubmitting, setMailSubmitting] = useState(false);
  const [authority, setAuthority] = useState("");
  const [subscirbeDataList, setSubscribeDataList] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  useEffect(() => {
    getKnitSubscribeDataList(subscribeList, setSubscribeDataList);
  }, [subscribeList]);

  const sortedUserList = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return userList;
    }

    const nextList = [...userList];
    nextList.sort((left, right) =>
      compareText(left[sortConfig.key], right[sortConfig.key], sortConfig.direction)
    );
    return nextList;
  }, [sortConfig, userList]);

  const totalPages = Math.max(1, Math.ceil(sortedUserList.length / pageSize));
  const paginatedUserList = sortedUserList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key: null, direction: null };
    });
    setCurrentPage(1);
  };

  const renderSortLabel = (key) => {
    const arrow =
      sortConfig.key !== key
        ? "↕"
        : sortConfig.direction === "asc"
          ? "↑"
          : "↓";

    return (
      <>
        <span className={styles.tableHeaderLabel}>{SORT_LABELS[key]}</span>
        <span className={styles.tableHeaderArrow} aria-hidden="true">
          {arrow}
        </span>
      </>
    );
  };

  const clearMailComposer = () => {
    revokeMailInlineImagePreviews(inlineImages);
    setSubject("");
    setDetail("");
    setAttachments([]);
    setInlineImages([]);
    setMailSubmitting(false);
  };

  const onClickChangeAuthority = (userId, currentAuthority) => {
    setSelectedUserId(userId);
    setAuthority(currentAuthority ?? "");
    setAdminModal(true);
    getUserInfo(userId, userInfo);
  };

  const onClickGetUserDetailInfo = (userId) => {
    setSelectedUserId(userId);
    setModal(true);
    getUserInfo(userId, userInfo);
  };

  const onClickMail = (userId) => {
    setSelectedUserId(userId);
    clearMailComposer();
    setMailModal(true);
    getUserInfo(userId, userInfo);
  };

  const onAddAttachments = (nextFiles) => {
    const nextAttachments = [...attachments, ...nextFiles];
    const validation = validateMailAttachments(nextAttachments);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }
    setAttachments(nextAttachments);
  };

  const onRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const onPrepareInlineImages = (files) => {
    const nextInlineImages = createMailInlineImageEntries(files);
    const validation = validateMailAttachments(attachments, [
      ...inlineImages,
      ...nextInlineImages,
    ]);
    if (!validation.valid) {
      revokeMailInlineImagePreviews(nextInlineImages);
      alert(validation.message);
      return null;
    }

    setInlineImages((prev) => [...prev, ...nextInlineImages]);
    return nextInlineImages;
  };

  const closeMailModal = () => {
    clearMailComposer();
    setMailModal(false);
  };

  const onSubmitMail = async () => {
    if (!subject.trim() || isMailContentEmpty(detail)) {
      alert("메일 제목과 내용을 모두 입력해주세요.");
      return;
    }

    const { activeInlineImages } = prepareMailHtmlContent(detail, inlineImages);
    const validation = validateMailAttachments(attachments, activeInlineImages);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    try {
      setMailSubmitting(true);
      await mailPost(
        userDetailInfo?.userId,
        subject,
        detail,
        attachments,
        activeInlineImages,
        userInfo
      );
      closeMailModal();
      alert("메일을 전송했습니다.");
    } catch (error) {
      alert(error?.response?.data?.message || "메일 전송에 실패했습니다.");
    } finally {
      setMailSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.dashboard_mid_card}>
        <div className={styles.title}>사용자 관리</div>

        <div className={styles.tableToolbar}>
          <div className={styles.tableMeta}>
            <strong>{sortedUserList.length}</strong>
            <span>명의 사용자</span>
          </div>

          <label className={styles.rowsPerPage}>
            <span>항목 보기</span>
            <select value={pageSize} onChange={handlePageSizeChange}>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}개씩 보기
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={`${styles.subtitle} ${styles.userGrid}`}>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("username")}
          >
            {renderSortLabel("username")}
          </button>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("nickName")}
          >
            {renderSortLabel("nickName")}
          </button>
          <div className={styles.tableHeaderStatic}>
            <span className={styles.tableHeaderLabel}>Tools</span>
          </div>
        </div>

        <div className={styles.tableBody}>
          {paginatedUserList.map((user) => (
            <div key={user.userId} className={styles.tableRowWrap}>
              <div
                className={`${user.userStatus === "INACTIVE" ? styles.users_inactive : styles.users} ${styles.userGrid}`}
              >
                <div className={styles.tableCell}>{user.username}</div>
                <div className={styles.tableCell}>{user.nickName}</div>
                <span className={styles.tableTools}>
                  <FontAwesomeIcon
                    icon={faUser}
                    onClick={() => onClickGetUserDetailInfo(user.userId)}
                  />
                  <FontAwesomeIcon
                    icon={faUserGear}
                    onClick={() => onClickChangeAuthority(user.userId, user.authority)}
                  />
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    onClick={() => onClickMail(user.userId)}
                  />
                </span>
              </div>
            </div>
          ))}
        </div>

        {sortedUserList.length > 0 && (
          <Paginatation
            contents={sortedUserList}
            currentPage={currentPage}
            numShowContents={pageSize}
            onPageChange={handlePageChange}
          />
        )}

        {modal === true && (
          <AdminUserDetail
            userDetailInfo={userDetailInfo}
            setModal={setModal}
          />
        )}

        <AdminUserAdminModal
          adminModal={adminModal}
          setAdminModal={setAdminModal}
          authority={authority}
          setAuthority={setAuthority}
          subscirbeDataList={subscirbeDataList}
          userDetailInfo={userDetailInfo}
          selectedUserId={selectedUserId}
          userInfo={userInfo}
          getUserInfo={getUserInfo}
          reviseUserInfo={reviseUserInfo}
        />

        <AdminScheduleModal
          modal={mailModal}
          setModal={setMailModal}
          onClose={closeMailModal}
          status={null}
          title={"메일 보내기"}
          requestUsername={userDetailInfo?.username}
          subject={subject}
          setSubject={setSubject}
          detail={detail}
          setDetail={setDetail}
          setStatus={null}
          onSubmitChange={onSubmitMail}
          onSubmitDelete={null}
          showMailFields={true}
          attachments={attachments}
          onAddAttachments={onAddAttachments}
          onRemoveAttachment={onRemoveAttachment}
          onPrepareInlineImages={onPrepareInlineImages}
          mailSubmitting={mailSubmitting}
          submitDisabled={mailSubmitting || !subject.trim() || isMailContentEmpty(detail)}
        />
      </div>
    </>
  );
};

export default AdminUser;
