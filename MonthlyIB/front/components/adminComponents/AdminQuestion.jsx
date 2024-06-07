import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./AdminStyle.module.css";

import {
  faUser,
  faUserGear,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "@/store/user";
import { useEffect, useRef, useState } from "react";
import AdminUserDetail from "./AdminUserDetail";
import { userReviseInfo } from "@/apis/userAPI";

const AdminQuestion = () => {
  const { userInfo, userList, getUserList, userDetailInfo, getUserInfo } =
    useUserStore();
  const [modal, setModal] = useState(false);
  const [adminModal, setAdminModal] = useState(false);
  const [authority, setAuthority] = useState(userDetailInfo?.authority);
  const closeRef = useRef();

  const onClickChangeAuthority = (userId) => {
    setAdminModal(!adminModal);
    getUserInfo(userId, userInfo);
  };

  const onClickGetUserDetailInfo = (userId) => {
    setModal(!modal);
    getUserInfo(userId, userInfo);
  };

  const onSubmitChangeAuthority = () => {
    userReviseInfo(
      userDetailInfo?.userId,
      "",
      userDetailInfo?.email,
      userDetailInfo?.nickName,
      userDetailInfo?.birth,
      userDetailInfo?.school,
      userDetailInfo?.grade,
      userDetailInfo?.address,
      userDetailInfo?.country,
      userDetailInfo?.userStatus,
      authority,
      userInfo
    );
    setAdminModal(false);
  };
  useEffect(() => {
    console.log(userDetailInfo);
  }, [userDetailInfo]);
  return (
    <>
      <div className={styles.dashboard_mid_card}>
        <div className={styles.title}>질문 관리</div>
        <div className={styles.subtitle}>
          <div className={styles.username}>Username</div>
          <div className={styles.nickname}>Nickname</div>
          <div className={styles.functions}>Tools</div>
        </div>

        {userList.length > 0 && (
          <>
            {userList.map((v) => (
              <>
                <hr />
                <div className={styles.users}>
                  {v.username}
                  <div>{v.nickName}</div>
                  <span>
                    <FontAwesomeIcon
                      icon={faUser}
                      onClick={() => onClickGetUserDetailInfo(v.userId)}
                    />
                    <FontAwesomeIcon
                      icon={faUserGear}
                      onClick={() => onClickChangeAuthority(v.userId)}
                    />
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                </div>
                <hr />
              </>
            ))}
          </>
        )}

        {modal === true && (
          <AdminUserDetail
            userDetailInfo={userDetailInfo}
            setModal={setModal}
          />
        )}
        {adminModal === true && (
          <div className={styles.md}>
            <div
              className={styles.md_box_flex}
              ref={closeRef}
              onClick={(e) =>
                closeRef.current === e.target && setAdminModal(false)
              }
            >
              <div className={styles.admin_box}>
                <div className={styles.md_top}>
                  <div className={styles.tit}>
                    {userDetailInfo?.username} 님의 권한 변경
                  </div>
                  <select
                    value={authority}
                    onChange={(e) => setAuthority(e.target.value)}
                  >
                    <option value="USER">일반유저</option>
                    <option value="ADMIN">관리자</option>
                  </select>
                </div>
                <button
                  type="button"
                  className={styles.md_btn}
                  onClick={onSubmitChangeAuthority}
                >
                  확인
                </button>
              </div>
            </div>
            <div className={styles.md_dim}></div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminQuestion;
