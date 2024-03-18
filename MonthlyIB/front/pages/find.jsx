import { useState } from "react";
import AppLayout from "../main_components/AppLayout";
import styles from "../styles/find.module.css";
import Link from "next/link";


const Find = () => {
    const [modal, setModal] = useState(0);

    return (
        <>
            <AppLayout>
                <main className="width_content min_content member">
                    <div className="header_tit_wrap tit_center">
                        <span>Find an Account</span>
                        <h2>아이디 / 비밀번호 찾기</h2>
                    </div>

                    <div className={styles.cm_tab}>
                        <button
                            type="button"
                            className={modal == 0 ? styles.active : ""}
                            onClick={() => setModal(0)}
                        >아이디 찾기</button>
                        <button
                            type="button"
                            className={modal == 1 ? styles.active : ""}
                            onClick={() => setModal(1)}
                        >비밀번호 찾기</button>
                    </div>
                    {
                        modal === 0
                            ? <div className="cm_tab_cont find_cont">
                                <div className="tab_box_wrap">
                                    <div className={styles.inputbox_cont}>
                                        <input type="text" id="name" name="name" placeholder="이름" />
                                    </div>

                                    <div className={styles.inputbox_cont}>
                                        <div className={styles.input_btn_wrap}>
                                            <input type="email" id="email" name="email" placeholder="이메일" />
                                            <button type="button" id="email_send">인증번호 발송</button>
                                        </div>
                                        <div id="checkCodeSend" className={styles.frm_msg_cont}></div>
                                    </div>

                                    <div className={styles.inputbox_cont}>
                                        <div className={styles.input_btn_wrap}>
                                            <input type="text" id="email_confirm" name="email_confirm" placeholder="인증번호" maxlength="6" />
                                            <button type="button" id="email_confirm_btn">확인</button>
                                        </div>
                                        <div id="checkCodeConfirm" className={styles.frm_msg_cont}></div>
                                    </div>
                                </div>

                                <div className={styles.center_btn_wrap}>
                                    <a href="javascript: void(0);" className="id_find_btn">아이디 찾기</a>
                                </div>
                            </div>
                            : <div id="cm2" className="cm_tab_cont find_cont">
                                <div className="tab_box_wrap">
                                    <div className={styles.inputbox_cont}>
                                        <input type="text" id="uid" name="uid" placeholder="아이디" />
                                    </div>

                                    <div className={styles.inputbox_cont}>
                                        <div className={styles.input_btn_wrap}>
                                            <input type="email" id="eamil2" name="eamil2" placeholder="이메일" />
                                            <button type="button" id="email2_send">인증번호 발송</button>
                                        </div>
                                        <div id="checkCodeSend2" className={styles.frm_msg_cont}>
                                            <span className={styles.frm_msg}>인증번호를 발송하였습니다.</span>
                                        </div>
                                    </div>

                                    <div className={styles.inputbox_cont}>
                                        <div className={styles.input_btn_wrap}>
                                            <input type="text" id="email_confirm2" name="email_confirm2" placeholder="인증번호" maxlength="6" />
                                            <button type="button" id="email_confirm2_btn">확인</button>
                                        </div>
                                        <div id="checkCodeConfirm2" className={styles.frm_msg_cont}>
                                            <span className={styles.frm_msg}>인증되었습니다.</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.center_btn_wrap}>
                                    <a href="javascript: void(0);" className="pwd_find_btn">비밀번호 찾기</a>
                                </div>
                            </div>
                    }

                    <div className={styles.bottom_option}>
                        <p>계정을 찾으셨나요?</p>
                        <Link href="/login">로그인 하러 가기</Link>
                    </div>

                    {/* 아이디 비번찾기 구현 */}
                    <div className={styles.md}>
                        <div className={styles.md_box_flex}>
                            <div className={styles.md_box}>
                                <div className={styles.md_top}>
                                    <div className={styles.tit}></div>
                                    <p className={styles.msg}></p>
                                </div>
                                <button type="button" className={styles.md_btn}>확인</button>
                            </div>
                        </div>
                        <div className={styles.md_dim}></div>
                    </div>
                </main>
            </AppLayout>
        </>
    );
};

export default Find;