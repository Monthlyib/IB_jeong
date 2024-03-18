import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./AppLayout.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";
import Link from "next/link";
import IBLogo from "../assets/img/common/logo.png"
import Image from "next/image";
import { userActions } from "../reducers/user";
import userImage from "../assets/img/common/user_profile.jpg"


const MobileAppLayout = ({ asideModal, setAsideModal }) => {
    const { User, logInDone } = useSelector((state) => state.user);
    const [menuModal, setMenuModal] = useState(1);
    const dispatch = useDispatch();

    const mbModal = {
        1: <div className={`${styles.mo_sub_wrap} ${styles.active}`}>
            <div className={styles.mo_sub_item}>
                <Link href="/ib" className={styles.tit}><span>월간 IB</span></Link>
            </div>
        </div>,
        2: <div className={`${styles.mo_sub_wrap} ${styles.active}`}>
            <div className={styles.mo_sub_item}>
                <Link href="/course" className={styles.tit}>전체강의</Link>
            </div>
        </div>,
        3: <div className={`${styles.mo_sub_wrap} ${styles.active}`}>
            <div className={styles.mo_sub_item}>
                <Link href="/board/" className={styles.tit}>IB 입시뉴스</Link>
            </div>
            <div className={styles.mo_sub_item}>
                <Link href="/board/calc" className={styles.tit}>합격예측 계산기</Link>
            </div>
            <div className={styles.mo_sub_item}>
                <Link href="/board/guide" className={styles.tit}>IB 수험가이드</Link>
            </div>
            <div className={styles.mo_sub_item}>
                <Link href="/board/bulletinboard" className={styles.tit}>자유게시판</Link>
            </div>
        </div>,
        4: <div className={`${styles.mo_sub_wrap} ${styles.active}`}>
            <div className={styles.mo_sub_item}>
                <Link href="/tutoring" className={styles.tit}>튜터링</Link>
            </div>
            <div className={styles.mo_sub_item}>
                <Link href="/question" className={styles.tit}>질문하기</Link>
            </div>
        </div>,
        5: <div className={`${styles.mo_sub_wrap} ${styles.active}`}>
            <div className={styles.mo_sub_item}>
                <Link href="http://monthlyib.co.kr/contact" target="_blank" rel='noreferrer noopener' className={styles.tit}>학원 현장강의</Link>
            </div>
        </div>

    }

    const onClickBtn = useCallback(() => {
        setAsideModal(prev => !prev);
    }, [])

    const onLoggedOut = useCallback(() => {
        dispatch(userActions.logOutRequest());
    }, [])
    return (
        <>
            <div className={styles.mo_header_wrap}>
                <div className={styles.btn_sidemenu}>
                    <FontAwesomeIcon icon={faBars} onClick={onClickBtn} />
                </div>

                <Link href="/"><Image src={IBLogo} alt="Monthly IB Logo" /></Link>

                <div className={styles.util}>
                    <Link href="/subscribe">구독플랜</Link>
                </div>
            </div>

            <aside className={styles.mo_gnb} style={asideModal ? { display: "flex" } : { display: "none" }}>
                <div className={styles.mo_gnb_header}>
                    {
                        logInDone
                            ? <>
                                <div className={styles.util_wrap}>
                                    <div className={styles.util_user_cont}>
                                        <Link href="/mypage">
                                            <figure>
                                                <Image src={userImage} alt="user profile img" />
                                            </figure>
                                            <span className={styles.util_name}><b id="user_nm">{User.userName}</b>님</span>
                                        </Link>
                                    </div>
                                    <button type="button" className={styles.mo_gnb_close} onClick={onClickBtn}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                                <div className={styles.util_sub}>
                                    {
                                        User.subscribe
                                            ? <Link href="/mypage" className={styles.util_plan_active}>
                                                <span>구독중</span>
                                                <span>D-<b>23</b></span>
                                            </Link>
                                            : <Link href="/plan" >구독하기</Link>
                                    }

                                    <Link href="/" onClick={onLoggedOut}>로그아웃</Link>
                                </div>
                            </>
                            : <>
                                <div className={styles.util_wrap}>
                                    <div className={styles.util_user_cont}>
                                        <Link href="/login" className={styles.util_login} onClick={() => { setAsideModal(false) }}>로그인을 해주세요</Link>
                                    </div>
                                    <button type="button" className={styles.mo_gnb_close} onClick={onClickBtn}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                                <div className={styles.util_sub}>
                                    <Link href="/login" onClick={() => { setAsideModal(false) }}>로그인</Link>
                                    <Link href="/signup" onClick={() => { setAsideModal(false) }}>회원가입</Link>
                                </div>
                            </>
                    }
                    <div className={styles.mo_menu_wrap} style={{ backgroundColor: "white" }}>
                        <div className={styles.mo_menu_left} style={{ height: "100vh" }}>
                            <div className={menuModal === 1 ? `${styles.mo_menu_item} ${styles.active}` : styles.mo_menu_item}>
                                <div className={styles.tit} onClick={() => setMenuModal(1)}>월간 IB</div>
                            </div>
                            <div className={menuModal === 2 ? `${styles.mo_menu_item} ${styles.active}` : styles.mo_menu_item}>
                                <div className={styles.tit} onClick={() => setMenuModal(2)}>강의</div>
                            </div>
                            <div className={menuModal === 3 ? `${styles.mo_menu_item} ${styles.active}` : styles.mo_menu_item}>
                                <div className={styles.tit} onClick={() => setMenuModal(3)}>자료실</div>
                            </div>
                            <div className={menuModal === 4 ? `${styles.mo_menu_item} ${styles.active}` : styles.mo_menu_item}>
                                <div className={styles.tit} onClick={() => setMenuModal(4)}>튜터링</div>
                            </div>
                            <div className={menuModal === 5 ? `${styles.mo_menu_item} ${styles.active}` : styles.mo_menu_item}>
                                <div className={styles.tit} onClick={() => setMenuModal(5)}>학원 현장강의</div>
                            </div>
                        </div>
                        <div className={styles.mo_menu_right}>
                            {
                                mbModal[menuModal]
                            }
                        </div>
                    </div>

                </div>
            </aside>

        </>
    );
};

export default MobileAppLayout;