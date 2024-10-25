"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Find.module.css";
import Link from "next/link";
import { openAPIVerifyEmail, openAPIVerifyNum } from "@/apis/openAPI";

const Find = () => {
  const [modal, setModal] = useState(0);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const username = useRef("");
  const email = useRef("");
  const verifyNum = useRef("");
  const [id, setId] = useState("");

  useEffect(() => {
    setVerifyEmail(false);
    email.current = "";
    verifyNum.current = "";
    username.current = "";
  }, [modal]);

  const onChangeEmail = (e) => {
    email.current = e.target.value;
  };
  const onChangeVerifyNum = (e) => {
    verifyNum.current = e.target.value;
  };

  const onClickVerifyEmail = () => {
    openAPIVerifyEmail(email);
  };

  const onClickVerifyEmailNum = useCallback(async () => {
    const res = await openAPIVerifyNum(email, verifyNum);
    if (res?.result.status === 200) {
      setVerifyEmail(true);
      username.current = res?.data?.username;
    } else if (res?.message === "잘못된 인증 번호 입니다.") {
      setVerifyEmail(false);
      alert("잘못된 인증 번호 입니다.");
    } else {
      alert("다시 시도해주세요.");
    }
  }, [email]);

  const onClickRestPwd = useCallback(
    async (e) => {
      e.preventDefault();
      const res = await openAPIVerifyNum(email, verifyNum, true);
      if (res?.result.status === 200) {
        setVerifyEmail(true);
        alert("비밀번호가 초기화 되었습니다. 메일을 확인해주세요.");
      } else if (res?.message === "잘못된 인증 번호 입니다.") {
        setVerifyEmail(false);
        alert("잘못된 인증 번호 입니다.");
      } else {
        alert("다시 시도해주세요.");
      }
    },
    [email]
  );

  const onSubmitForm = async (e) => {
    e.preventDefault();
    alert(`아이디는 ${username.current} 입니다.`);
  };

  return (
    <>
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
          >
            아이디 찾기
          </button>
          <button
            type="button"
            className={modal == 1 ? styles.active : ""}
            onClick={() => setModal(1)}
          >
            비밀번호 찾기
          </button>
        </div>
        {modal === 0 ? (
          <div className="cm_tab_cont find_cont">
            <div className="tab_box_wrap">
              <div className={styles.inputbox_cont}>
                <div className={styles.input_btn_wrap}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="이메일"
                    onChange={onChangeEmail}
                  />
                  <button
                    type="button"
                    id="email_send"
                    onClick={onClickVerifyEmail}
                  >
                    인증번호 발송
                  </button>
                </div>
              </div>

              <div className={styles.inputbox_cont}>
                <div className={styles.input_btn_wrap}>
                  <input
                    type="text"
                    id="email_confirm"
                    name="email_confirm"
                    placeholder="인증번호"
                    maxLength="6"
                    onChange={onChangeVerifyNum}
                    disabled={verifyEmail === false ? false : true}
                  />
                  <button
                    type="button"
                    id="email_confirm_btn"
                    onClick={onClickVerifyEmailNum}
                    disabled={verifyEmail === false ? false : true}
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.center_btn_wrap}>
              <button
                className="id_find_btn"
                onClick={onSubmitForm}
                disabled={verifyEmail === false ? true : false}
              >
                아이디 찾기
              </button>
            </div>
          </div>
        ) : (
          <div id="cm2" className="cm_tab_cont find_cont">
            <div className="tab_box_wrap">
              <div className={styles.inputbox_cont}>
                <input type="text" id="uid" name="uid" placeholder="아이디" />
              </div>

              <div className={styles.inputbox_cont}>
                <div className={styles.input_btn_wrap}>
                  <input
                    type="email"
                    id="email2"
                    name="email2"
                    placeholder="이메일"
                    onChange={onChangeEmail}
                  />
                  <button
                    type="button"
                    id="email2_send"
                    onClick={onClickVerifyEmail}
                  >
                    인증번호 발송
                  </button>
                </div>
              </div>

              <div className={styles.inputbox_cont}>
                <div className={styles.input_btn_wrap}>
                  <input
                    type="text"
                    id="email_confirm2"
                    name="email_confirm2"
                    placeholder="인증번호"
                    maxLength="6"
                    onChange={onChangeVerifyNum}
                    disabled={verifyEmail === false ? false : true}
                  />
                  <button
                    type="button"
                    id="email_confirm2_btn"
                    onClick={onClickVerifyEmailNum}
                    disabled={verifyEmail === false ? false : true}
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.center_btn_wrap}>
              <button
                className="pwd_find_btn"
                onClick={onClickRestPwd}
                disabled={verifyEmail === false ? true : false}
              >
                비밀번호 초기화
              </button>
            </div>
          </div>
        )}

        <div className={styles.bottom_option}>
          <p>계정을 찾으셨나요?</p>
          <Link href="/login">로그인 하러 가기</Link>
        </div>
      </main>
    </>
  );
};

export default Find;
