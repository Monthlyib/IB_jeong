import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./AdminStyle.module.css";
import {
  faUser,
  faUserGear,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useUserInfo, useUserStore } from "@/store/user";
import { useEffect, useState } from "react";
import AdminUserDetail from "./AdminUserDetail";
import AdminUserAdminModal from "./AdminUserAdminModal";
import AdminScheduleModal from "./AdminSchedulemodal";
import shortid from "shortid";
import { useSubscribeStore } from "@/store/subscribe";
import { getKnitSubscribeDataList } from "@/utils/utils";
import { mailPost } from "@/apis/mail";
// 15명씩
// Refactoring 할것.
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

  useEffect(() => {
    getKnitSubscribeDataList(subscribeList, setSubscribeDataList);
  }, [subscribeList]);

  const onClickChangeAuthority = (userId) => {
    setAdminModal(!adminModal);
    getUserInfo(userId, userInfo);
    setAuthority(userDetailInfo?.authority);
  };

  const onClickGetUserDetailInfo = (userId) => {
    setModal(!modal);
    getUserInfo(userId, userInfo);
  };

  const onSubmitMail = () => {
    setMailModal(false);
    mailPost(userDetailInfo?.userId, detail, userInfo);
  };

  const onClickMail = (userId) => {
    setMailModal(!mailModal);
    getUserInfo(userId, userInfo);
  };

  return (
    <>
      <div className={styles.dashboard_mid_card}>
        <div className={styles.title}>사용자 관리</div>
        <div className={styles.subtitle}>
          <div className={styles.username}>ID</div>
          <div className={styles.nickname}>Name</div>
          <div className={styles.functions}>Tools</div>
        </div>

        {userList.length > 0 && (
          <>
            {userList.map((v) => (
              <div key={shortid.generate()}>
                <hr />
                <div
                  className={
                    v.userStatus === "INACTIVE"
                      ? styles.users_inactive
                      : styles.users
                  }
                >
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
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      onClick={() => onClickMail(v.userId)}
                    />
                  </span>
                </div>
                <hr />
              </div>
            ))}
          </>
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
