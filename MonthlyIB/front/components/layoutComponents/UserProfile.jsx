import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import styles from "./UserProfile.module.css";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

const UserProfile = () => {
  const { User } = useSelector((state) => state.user);

  const [toggleUtilBox, setToggleUtilBox] = useState(false);
  const onClickIcon = useCallback(() => {
    setToggleUtilBox(!toggleUtilBox);
  }, [toggleUtilBox]);
  return (
    <>
      <div className={styles.my_util}>
        <div className={styles.util_wrap} onClick={onClickIcon}>
          <div className={styles.util_img}>
            <figure>
              <img
                src={User.Image.src}
                width="100"
                height="100"
                alt="user profile img"
              />
            </figure>
          </div>
          <div className={styles.util_name}>
            <span>
              <b>{User.name}</b>님
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
    </>
  );
};

const UserUtilBox = () => {
  const dispatch = useDispatch();
  const onLoggedOut = useCallback(() => {
    dispatch(userActions.logOutRequest());
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
      </ul>
    </div>
  );
};

export default UserProfile;
