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
import { mailPost } from "@/apis/mail";

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
  const [detail, setDetail] = useState("");
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
    if (sortConfig.key !== key) {
      return `${SORT_LABELS[key]} ↕`;
    }
    return `${SORT_LABELS[key]} ${
      sortConfig.direction === "asc" ? "↑" : "↓"
    }`;
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
    setDetail("");
    setMailModal(true);
    getUserInfo(userId, userInfo);
  };

  const onSubmitMail = () => {
    setMailModal(false);
    mailPost(userDetailInfo?.userId, detail, userInfo);
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
          <div className={styles.tableHeaderStatic}>Tools</div>
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
          status={null}
          title={"메일 보내기"}
          requestUsername={userDetailInfo?.username}
          detail={detail}
          setDetail={setDetail}
          setStatus={null}
          onSubmitChange={onSubmitMail}
          onSubmitDelete={null}
        />
      </div>
    </>
  );
};

export default AdminUser;
