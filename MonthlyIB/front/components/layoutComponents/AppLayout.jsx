"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./AppLayout.module.css";
import Resource from "./Resource";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
// import { useDispatch, useSelector } from "react-redux";
import MobileAppLayout from "./MobileAppLayout";
import { useCallback, useEffect, useState } from "react";
// import { userActions } from "../reducers/user";

const AppLayout = ({ children, disable }) => {
  // const dispatch = useDispatch();
  // const { logInDone } = useSelector((state) => state.user);
  const [mouseOverMenu, setMouseOverMenu] = useState(false);
  const [asideModal, setAsideModal] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: undefined,
  });
  const onMouseOverMenu = useCallback(() => {
    setMouseOverMenu(true);
  }, [mouseOverMenu]);

  const onMouseLeaveMenu = useCallback(() => {
    setMouseOverMenu(false);
  }, [mouseOverMenu]);

  // useEffect(() => {
  //   if (cookie.get("token")) dispatch(userActions.loadInfoRequest());
  // }, [cookie.get("token")]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
        });
      };
      window.addEventListener("resize", handleResize);
      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    } else {
      return () =>
        window.removeEventListener("resize", () => {
          return null;
        });
    }
  }, []);

  return (
    <>
      <header
        style={disable === true ? { display: "none" } : { display: "block" }}
      >
        <div className={`${styles.header_wrap} ${styles.pc_header_wrap}`}>
          <Link href="/">
            <Image
              src={"/img/common/logo.png"}
              width="40"
              height="48"
              alt="Monthly IB Logo"
            />
          </Link>

          <nav onMouseOver={onMouseOverMenu} onMouseLeave={onMouseLeaveMenu}>
            <ul>
              <li>
                <Link href="/ib">월간 IB</Link>
              </li>
              <li>
                <Link href="/course">영상강의</Link>
              </li>
              <li>
                <Resource />
              </li>
              <li>
                <Link href="/tutoring">튜터링 예약</Link>
                <ul className={styles.gnb2}>
                  <li>
                    <Link href="/tutoring">
                      <span>튜터링 예약</span>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className={styles.icon}
                      />
                    </Link>
                  </li>
                  <li>
                    <Link href="/question">
                      <span>질문하기</span>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className={styles.icon}
                      />
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  href="http://monthlyib.co.kr/contact"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  학원 현장강의
                </Link>
              </li>
            </ul>
          </nav>
          {<LoginForm />}
          {/* {logInDone ? <UserProfile /> : <LoginForm />} */}
        </div>
        <MobileAppLayout
          asideModal={asideModal}
          setAsideModal={setAsideModal}
        />
        {windowSize.width > 1024 && asideModal === true && setAsideModal(false)}
      </header>
      {children}
      <div
        className={styles.gnb_dim_bg}
        style={
          mouseOverMenu
            ? { display: "block" }
            : asideModal
            ? { display: "block" }
            : { display: "none" }
        }
        onClick={() => {
          setAsideModal(false);
        }}
      />
    </>
  );
};

export default AppLayout;
