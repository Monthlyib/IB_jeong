"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./AppLayout.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserInfo, useUserStore } from "@/store/user";

const renderMobileLink = (menu, className, onNavigate) => {
  if (menu.external && menu.href) {
    return (
      <a
        href={menu.href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
        onClick={onNavigate}
      >
        {menu.label}
      </a>
    );
  }

  if (menu.href) {
    return (
      <Link href={menu.href} className={className} onClick={onNavigate}>
        {menu.label}
      </Link>
    );
  }

  return <span className={className}>{menu.label}</span>;
};

const MobileAppLayout = ({ asideModal, setAsideModal, menus = [] }) => {
  const router = useRouter();
  const { userInfo, signOut } = useUserInfo();
  const { getUserInfo, userDetailInfo } = useUserStore();
  const visibleMenus = useMemo(() => menus || [], [menus]);
  const [menuModal, setMenuModal] = useState("");

  useEffect(() => {
    if (userInfo?.userId) getUserInfo(userInfo.userId, userInfo);
  }, [userInfo]);

  useEffect(() => {
    const firstMenuKey =
      visibleMenus.find((menu) => menu.children?.length > 0)?.key ??
      visibleMenus[0]?.key ??
      "";

    const hasCurrentMenu = visibleMenus.some((menu) => menu.key === menuModal);
    if (!hasCurrentMenu) {
      setMenuModal(firstMenuKey);
    }
  }, [menuModal, visibleMenus]);

  const activeMenu =
    visibleMenus.find((menu) => menu.key === menuModal) ??
    visibleMenus.find((menu) => menu.children?.length > 0) ??
    null;

  const onLoggedOut = useCallback(() => {
    signOut();
    setAsideModal(false);
    router.push("/login");
  }, [router, setAsideModal, signOut]);

  const handleLoginRedirect = useCallback(() => {
    signOut();
    setAsideModal(false);
    router.push("/login");
  }, [router, setAsideModal, signOut]);

  const handleMenuNavigate = useCallback(() => {
    setAsideModal(false);
  }, [setAsideModal]);

  const onClickBtn = useCallback(() => {
    setAsideModal((prev) => !prev);
  }, [setAsideModal]);

  return (
    <>
      <div className={styles.mo_header_wrap}>
        <div className={styles.btn_sidemenu}>
          <FontAwesomeIcon icon={faBars} onClick={onClickBtn} />
        </div>

        <Link href="/">
          <Image
            src={"/img/common/logo.png"}
            width="40"
            height="48"
            alt="Monthly IB Logo"
          />
        </Link>

        <div className={styles.util}>
          <Link href="/subscribe">구독플랜</Link>
        </div>
      </div>

      <aside
        className={styles.mo_gnb}
        style={asideModal ? { display: "flex" } : { display: "none" }}
      >
        <div className={styles.mo_gnb_header}>
          {userDetailInfo?.userStatus === "ACTIVE" ? (
            <>
              <div className={styles.util_wrap}>
                <div className={styles.util_user_cont}>
                  <Link href="/mypage" onClick={handleMenuNavigate}>
                    <figure>
                      <Image
                        src={
                          userDetailInfo?.userImage === null
                            ? "/img/common/user_profile.jpg"
                            : userDetailInfo?.userImage?.fileUrl
                        }
                        width="100"
                        height="100"
                        alt="user profile img"
                      />
                    </figure>
                    <span className={styles.util_name}>
                      <b id="user_nm">{userDetailInfo?.username}</b>님
                    </span>
                  </Link>
                </div>
                <button
                  type="button"
                  className={styles.mo_gnb_close}
                  onClick={onClickBtn}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className={styles.util_sub}>
                {userDetailInfo?.subscribe ? (
                  <Link
                    href="/mypage"
                    className={styles.util_plan_active}
                    onClick={handleMenuNavigate}
                  >
                    <span>구독중</span>
                    <span>
                      D-<b>23</b>
                    </span>
                  </Link>
                ) : (
                  <Link href="/plan" onClick={handleMenuNavigate}>
                    구독하기
                  </Link>
                )}

                <Link href="/" onClick={onLoggedOut}>
                  로그아웃
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className={styles.util_wrap}>
                <div className={styles.util_user_cont}>
                  <Link
                    href="/login"
                    className={styles.util_login}
                    onClick={handleLoginRedirect}
                  >
                    로그인을 해주세요
                  </Link>
                </div>
                <button
                  type="button"
                  className={styles.mo_gnb_close}
                  onClick={onClickBtn}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className={styles.util_sub}>
                <Link href="/login" onClick={handleLoginRedirect}>
                  로그인
                </Link>
                <Link href="/signup" onClick={handleMenuNavigate}>
                  회원가입
                </Link>
              </div>
            </>
          )}
          <div
            className={styles.mo_menu_wrap}
            style={{ backgroundColor: "white" }}
          >
            <div className={styles.mo_menu_left} style={{ height: "100vh" }}>
              {visibleMenus.map((menu) => {
                const hasChildren = menu.children?.length > 0;
                return (
                  <div
                    key={menu.key}
                    className={
                      hasChildren && menuModal === menu.key
                        ? `${styles.mo_menu_item} ${styles.active}`
                        : styles.mo_menu_item
                    }
                  >
                    {hasChildren ? (
                      <button
                        type="button"
                        className={`${styles.tit} ${styles.mobileMenuCategory}`}
                        onClick={() => setMenuModal(menu.key)}
                      >
                        {menu.label}
                      </button>
                    ) : (
                      renderMobileLink(menu, styles.tit, handleMenuNavigate)
                    )}
                  </div>
                );
              })}
            </div>
            <div className={styles.mo_menu_right}>
              {activeMenu?.children?.length ? (
                <div className={`${styles.mo_sub_wrap} ${styles.active}`}>
                  {activeMenu.children.map((child) => (
                    <div className={styles.mo_sub_item} key={child.key}>
                      {renderMobileLink(child, styles.tit, handleMenuNavigate)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`${styles.mo_sub_wrap} ${styles.active}`}>
                  <div className={styles.mo_sub_item}>
                    <span className={styles.tit}>
                      선택한 메뉴에 하위 항목이 없습니다.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileAppLayout;
