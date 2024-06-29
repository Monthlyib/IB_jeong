import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import styles from "./UserProfile.module.css";
import Image from "next/image";
import Link from "next/link";
import { useUserInfo, useUserStore } from "@/store/user";
import { removeCookie } from "@/apis/cookies";

const UserProfile = () => {
  const [toggleUtilBox, setToggleUtilBox] = useState(false);
  const { userInfo } = useUserInfo();
  const { getUserInfo, userDetailInfo } = useUserStore();

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("userInfo"));
    getUserInfo(localUser.state.userInfo.userId, localUser.state.userInfo);
  }, []);
  const onClickIcon = useCallback(() => {
    setToggleUtilBox(!toggleUtilBox);
  }, [toggleUtilBox]);

  console.log(userDetailInfo);

  return (
    <>
      {Object.keys(userDetailInfo).length > 0 && (
        <div className={styles.my_util}>
          <div className={styles.util_wrap} onClick={onClickIcon}>
            <div className={styles.util_img}>
              <figure>
                {userDetailInfo?.userImage === null ? (
                  <Image
                    src={"/img/common/user_profile.jpg"}
                    width="100"
                    height="100"
                    alt="user profile img"
                  />
                ) : (
                  <Image
                    src={userDetailInfo?.userImage?.fileUrl}
                    width="100"
                    height="100"
                    alt="user profile img"
                  />
                )}
              </figure>
            </div>
            <div className={styles.util_name}>
              <span>
                <b>{userInfo?.nickname}</b>님
              </span>
              {toggleUtilBox === false ? (
                <FontAwesomeIcon icon={faCaretDown} className={styles.icon} />
              ) : (
                <FontAwesomeIcon icon={faCaretUp} className={styles.icon} />
              )}
            </div>
          </div>
          {toggleUtilBox && <UserUtilBox />}
        </div>
      )}
    </>
  );
};

const UserUtilBox = () => {
  const { userInfo, signOut } = useUserInfo();
  const onLoggedOut = useCallback(() => {
    signOut();
    localStorage.removeItem("userInfo");
    location.reload();
    removeCookie("accessToken");
    removeCookie("authority");
  }, []);
  return (
    <div className={styles.util_box}>
      <ul>
        <li>
          <Link href="/mypage">마이페이지</Link>
        </li>
        <li>
          <Link href="/tutoring">튜터링 예약</Link>
        </li>
        <li>
          <a onClick={onLoggedOut}>로그아웃</a>
        </li>
        {userInfo?.authority === "ADMIN" && (
          <li>
            <Link href="/adminpage">관리자 페이지</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default UserProfile;
