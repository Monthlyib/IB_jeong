"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./AppLayout.module.css";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import MobileAppLayout from "./MobileAppLayout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserInfo } from "@/store/user";
import { adjustWindowSize } from "@/utils/utils";
import { getCookie } from "@/apis/cookies";
import { openAPIGetHeaderNavigation } from "@/apis/headerNavigationAPI";
import {
  HEADER_NAVIGATION_UPDATED_EVENT,
  buildDefaultHeaderNavigationConfig,
  getVisibleHeaderMenus,
  normalizeHeaderNavigationConfig,
} from "@/utils/headerNavigationUtils";

const renderTopLevelMenu = (menu) => {
  if (menu.external && menu.href) {
    return (
      <a href={menu.href} target="_blank" rel="noreferrer noopener">
        {menu.label}
      </a>
    );
  }

  if (menu.href) {
    return <Link href={menu.href}>{menu.label}</Link>;
  }

  return <span className={styles.navItemLabel}>{menu.label}</span>;
};

const renderSubMenu = (menu) => {
  const content = (
    <>
      <span>{menu.label}</span>
      <FontAwesomeIcon icon={faChevronRight} className={styles.icon} />
    </>
  );

  if (menu.external && menu.href) {
    return (
      <a href={menu.href} target="_blank" rel="noreferrer noopener">
        {content}
      </a>
    );
  }

  if (menu.href) {
    return <Link href={menu.href}>{content}</Link>;
  }

  return <span className={styles.submenuLabel}>{menu.label}</span>;
};

const AppLayout = ({ children, disable }) => {
  const pathName = usePathname();
  const id = pathName.split("/")[pathName.split("/").length - 1];
  const [mouseOverMenu, setMouseOverMenu] = useState(false);
  const [asideModal, setAsideModal] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: undefined,
  });
  const [headerNavigationConfig, setHeaderNavigationConfig] = useState(
    buildDefaultHeaderNavigationConfig()
  );

  const { userInfo, signOut } = useUserInfo();

  const onMouseOverMenu = useCallback(() => {
    setMouseOverMenu(true);
  }, []);

  const onMouseLeaveMenu = useCallback(() => {
    setMouseOverMenu(false);
  }, []);

  useEffect(() => {
    adjustWindowSize(setWindowSize);
  }, []);

  useEffect(() => {
    const token = getCookie("accessToken");
    if (!token && userInfo?.userStatus === "ACTIVE") {
      signOut();
    }
  }, [signOut, userInfo]);

  useEffect(() => {
    let ignore = false;

    const fetchHeaderNavigation = async () => {
      const response = await openAPIGetHeaderNavigation();
      if (ignore) {
        return;
      }

      setHeaderNavigationConfig(
        normalizeHeaderNavigationConfig(
          response?.data?.config ?? buildDefaultHeaderNavigationConfig()
        )
      );
    };

    fetchHeaderNavigation();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const handleHeaderNavigationUpdated = (event) => {
      setHeaderNavigationConfig(
        normalizeHeaderNavigationConfig(event.detail ?? buildDefaultHeaderNavigationConfig())
      );
    };

    window.addEventListener(
      HEADER_NAVIGATION_UPDATED_EVENT,
      handleHeaderNavigationUpdated
    );

    return () => {
      window.removeEventListener(
        HEADER_NAVIGATION_UPDATED_EVENT,
        handleHeaderNavigationUpdated
      );
    };
  }, []);

  useEffect(() => {
    if (windowSize.width > 1024 && asideModal) {
      setAsideModal(false);
    }
  }, [asideModal, windowSize.width]);

  const visibleMenus = useMemo(
    () => getVisibleHeaderMenus(headerNavigationConfig),
    [headerNavigationConfig]
  );

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
                {visibleMenus.map((menu) => (
                  <li key={menu.key}>
                    {renderTopLevelMenu(menu)}
                    {menu.children?.length > 0 && (
                      <ul className={styles.gnb2} style={{ listStyle: "none" }}>
                        {menu.children.map((child) => (
                          <li key={child.key}>{renderSubMenu(child)}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
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
            menus={visibleMenus}
          />
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
