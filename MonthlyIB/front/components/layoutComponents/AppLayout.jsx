"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./AppLayout.module.css";
import Resource from "./Resource";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import MobileAppLayout from "./MobileAppLayout";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserInfo } from "@/store/user";
import { adjustWindowSize } from "@/utils/utils";

const AppLayout = ({ children, disable }) => {
  const pathName = usePathname();
  const id = pathName.split("/")[pathName.split("/").length - 1];
  const [mouseOverMenu, setMouseOverMenu] = useState(false);
  const [asideModal, setAsideModal] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: undefined,
  });

  const { userInfo } = useUserInfo();

  const onMouseOverMenu = useCallback(() => {
    setMouseOverMenu(true);
  }, [mouseOverMenu]);

  const onMouseLeaveMenu = useCallback(() => {
    setMouseOverMenu(false);
  }, [mouseOverMenu]);

  useEffect(() => {
    adjustWindowSize(setWindowSize);
  }, []);

  return (
    <>
      {pathName !== `/course/player/${id}` && (
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
              <ul style={{ listStyle: "none" }}>
                <li>
                  <Link href="/aitools">AI Tools</Link>
                </li>
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
                  <ul className={styles.gnb2} style={{ listStyle: "none" }}>
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
                  <Link href="/learningtest">학습유형 테스트</Link>
                </li>
                {/* AI Tools 메인페이지 네비게이션 추가 */}

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
            {userInfo?.userStatus === "ACTIVE" ? (
              <UserProfile />
            ) : (
              <LoginForm />
            )}
          </div>
          <MobileAppLayout
            asideModal={asideModal}
            setAsideModal={setAsideModal}
          />
          {windowSize.width > 1024 &&
            asideModal === true &&
            setAsideModal(false)}
        </header>
      )}

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
      ></div>
    </>
  );
};

export default AppLayout;