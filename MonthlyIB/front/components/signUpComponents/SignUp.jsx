"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Signup.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { userRegisterWithSocialInfo } from "@/apis/userAPI";

import {
  openAPIVerifyEmail,
  openAPIVerifyNum,
  openAPIRegister,
  openAPIVerifyUsername,
} from "@/apis/openAPI";
import { useSocialOnboardingStore, useUserInfo } from "@/store/user";

const SignUp = () => {
  const searchParams = useSearchParams();
  const legacyUserId = searchParams.get("id");
  const legacyEmail = searchParams.get("email");
  const legacyAccessToken = searchParams.get("access_token");
  const checkBoxes = [
    {
      id: "1",
      name: "firstTerm",
    },
    {
      id: "2",
      name: "secondTerm",
    },
  ];

  const router = useRouter();
  const { userInfo, signIn } = useUserInfo();
  const pendingSocialAuth = useSocialOnboardingStore(
    (state) => state.pendingSocialAuth
  );
  const hydratePendingSocialAuth = useSocialOnboardingStore(
    (state) => state.hydratePendingSocialAuth
  );
  const clearPendingSocialAuth = useSocialOnboardingStore(
    (state) => state.clearPendingSocialAuth
  );

  const userId = pendingSocialAuth?.userId ?? legacyUserId;
  const paramEmail = pendingSocialAuth?.email ?? legacyEmail;
  const accessToken = pendingSocialAuth?.accessToken ?? legacyAccessToken;

  const pattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  const [username, setUsername] = useState("");
  const [checkDuplication, setCheckDuplication] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [country, setCountry] = useState("");
  const [nameValue, setNameValue] = useState("");
  const name = useRef("");
  const email = useRef("");
  if (paramEmail) email.current = paramEmail;
  const dob = useRef("");
  const school = useRef("");
  const grade = useRef("");
  const address = useRef("");
  const verifyNum = useRef("");

  const [checkedItems, setCheckedItems] = useState([]);
  const [termError, setTermError] = useState(true);
  const [consent_marketing, setMarketing] = useState(false);

  const [verifyEmail, setVerifyEmail] = useState(Boolean(paramEmail));
  const [verifyRequested, setVerifyRequested] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifyMessageType, setVerifyMessageType] = useState("");
  const [isSendingVerifyEmail, setIsSendingVerifyEmail] = useState(false);
  const [isCheckingVerifyCode, setIsCheckingVerifyCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    hydratePendingSocialAuth();
  }, [hydratePendingSocialAuth]);

  useEffect(() => {
    if (!pendingSocialAuth) {
      return;
    }

    if (pendingSocialAuth.username) {
      setUsername(pendingSocialAuth.username);
      setCheckDuplication(true);
    }

    if (pendingSocialAuth.nickname) {
      name.current = pendingSocialAuth.nickname;
      setNameValue(pendingSocialAuth.nickname);
    }
  }, [pendingSocialAuth]);

  useEffect(() => {
    if (userInfo?.userStatus === "ACTIVE") {
      router.replace("/");
    }
  }, [userInfo]);

  useEffect(() => {
    if (checkedItems.length === 2) {
      setTermError(false);
    } else {
      setTermError(true);
    }
  }, [checkedItems]);

  const handleSingleCheck = (e, id) => {
    if (e.target.checked) {
      setCheckedItems((prev) => [...prev, id]);
    } else {
      setCheckedItems(checkedItems.filter((v) => v !== id));
    }
  };

  const handleAllCheck = (e) => {
    if (e.target.checked) {
      const tempArray = [];
      checkBoxes.map((v) => tempArray.push(v.id));
      setCheckedItems(tempArray);
    } else {
      setCheckedItems([]);
    }
  };

  const onChangeEmail = useCallback((e) => {
    email.current = e.target.value;
    setVerifyEmail(false);
    setVerifyRequested(false);
    setVerifyMessage("");
    setVerifyMessageType("");
  }, []);
  const onChangeVerifyNum = useCallback((e) => {
    verifyNum.current = e.target.value;
  }, []);

  const onChangeDob = useCallback((e) => {
    dob.current = e.target.value;
  }, []);

  const onChangeSchool = useCallback((e) => {
    school.current = e.target.value;
  }, []);

  const onChangeGrade = useCallback((e) => {
    grade.current = e.target.value;
  }, []);

  const onChangeCountry = (e) => {
    setCountry(e.target.value);
  };

  const onChangeAddress = useCallback((e) => {
    address.current = e.target.value;
  }, []);

  const onChangeMarketing = useCallback((e) => {
    setMarketing(e.target.checked);
  }, []);

  const onChangeName = useCallback((e) => {
    name.current = e.target.value;
    setNameValue(e.target.value);
  }, []);

  const onChangeUsername = useCallback((e) => {
    setUsername(e.target.value);
    setCheckDuplication(null);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
      if (userId) setPasswordError(false);
    },
    [password]
  );

  const onClickVerifyEmail = useCallback(async () => {
    const resolvedEmail = email.current?.trim();

    if (!resolvedEmail) {
      setVerifyMessage("이메일을 입력해주세요.");
      setVerifyMessageType("error");
      alert("이메일을 입력해주세요.");
      return;
    }

    setIsSendingVerifyEmail(true);
    setVerifyEmail(false);
    setVerifyRequested(false);
    setVerifyMessage("");
    setVerifyMessageType("");

    try {
      const res = await openAPIVerifyEmail(email);

      if (res?.result?.status === 200) {
        setVerifyRequested(true);
        setVerifyMessage("인증번호를 발송했습니다. 이메일을 확인해주세요.");
        setVerifyMessageType("success");
        alert("인증번호를 발송했습니다.");
        return;
      }

      const message =
        res?.message || "인증 메일 발송에 실패했습니다. 다시 시도해주세요.";
      setVerifyMessage(message);
      setVerifyMessageType("error");
      alert(message);
    } catch (error) {
      const message =
        error?.message || "인증 메일 발송에 실패했습니다. 다시 시도해주세요.";
      setVerifyMessage(message);
      setVerifyMessageType("error");
      alert(message);
    } finally {
      setIsSendingVerifyEmail(false);
    }
  }, [email]);

  const onClickVerifyEmailNum = useCallback(async () => {
    if (!verifyNum.current?.trim()) {
      setVerifyMessage("인증번호를 입력해주세요.");
      setVerifyMessageType("error");
      alert("인증번호를 입력해주세요.");
      return;
    }

    setIsCheckingVerifyCode(true);
    try {
      const res = await openAPIVerifyNum(email, verifyNum);
      if (res?.result?.status === 200) {
        setVerifyEmail(true);
        setVerifyMessage("이메일 인증이 완료되었습니다.");
        setVerifyMessageType("success");
        alert("이메일 인증이 완료되었습니다.");
        return;
      }

      const message = res?.message || "다시 시도해주세요.";
      setVerifyEmail(false);
      setVerifyMessage(message);
      setVerifyMessageType("error");
      alert(message);
    } catch (error) {
      const message =
        error?.message || "이메일 인증에 실패했습니다. 다시 시도해주세요.";
      setVerifyEmail(false);
      setVerifyMessage(message);
      setVerifyMessageType("error");
      alert(message);
    } finally {
      setIsCheckingVerifyCode(false);
    }
  }, [email]);

  const onClickDuplicationCheck = useCallback(async () => {
    if (!username.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    try {
      const res = await openAPIVerifyUsername(username);
      if (res?.result?.status === 200) {
        setCheckDuplication(true);
      } else if (res?.message === "USER EXIST") {
        setCheckDuplication(false);
        alert("이미 사용 중인 아이디입니다.");
      } else {
        setCheckDuplication(false);
        alert(res?.message || "아이디 확인 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      setCheckDuplication(false);
      alert("아이디 확인 중 문제가 발생했습니다.");
    }
  }, [username]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const isSocialSignUp = Boolean(userId);
    const isPasswordValid = isSocialSignUp ? true : pattern.test(password);
    const isPasswordConfirmed =
      isSocialSignUp ? true : passwordCheck !== "" && passwordError === false;
    const canSubmit = isSocialSignUp
      ? checkDuplication === true && termError === false && country !== ""
      : checkDuplication === true &&
        isPasswordValid &&
        isPasswordConfirmed &&
        termError === false &&
        verifyEmail === true &&
        country !== "";

    if (!canSubmit) {
      if (checkDuplication !== true) {
        alert("아이디 중복 확인을 완료해주세요.");
      } else if (!isSocialSignUp && !isPasswordValid) {
        alert("비밀번호 형식을 확인해주세요.");
      } else if (!isSocialSignUp && !isPasswordConfirmed) {
        alert("비밀번호 확인이 일치하지 않습니다.");
      } else if (!verifyEmail && !isSocialSignUp) {
        alert("이메일 인증을 완료해주세요.");
      } else if (country === "") {
        alert("국가를 선택해주세요.");
      } else if (termError) {
        alert("필수 약관에 동의해주세요.");
      }
      return;
    }

    setIsSubmitting(true);
    if (userId) {
      if (!accessToken) {
        alert("소셜 로그인 인증이 만료되었습니다. 다시 로그인 해주세요.");
        clearPendingSocialAuth();
        router.push("/login");
        setIsSubmitting(false);
        return;
      }
      const res = await userRegisterWithSocialInfo(
        userId,
        accessToken,
        username,
        name,
        dob,
        school,
        grade,
        address,
        country,
        consent_marketing
      );
      if (res?.result?.status === 200) {
        clearPendingSocialAuth();
        alert("회원가입이 완료되었습니다. 다시 로그인 해주세요.");
        router.push("/login");
      } else if (res?.message) {
        alert(res.message);
      } else {
        alert("회원가입 처리 중 문제가 발생했습니다.");
      }
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await openAPIRegister(
        username,
        password,
        name,
        email,
        dob,
        school,
        grade,
        address,
        country,
        verifyNum,
        consent_marketing
      );

      if (res?.result?.status === 200) {
        try {
          await signIn(username, password);
          alert("회원가입이 완료되었습니다.");
          router.replace("/");
        } catch (signInError) {
          console.error(signInError);
          alert(
            "회원가입은 완료되었지만 자동 로그인에 실패했습니다. 다시 로그인 해주세요."
          );
          router.push("/login");
        }
        return;
      }

      alert(res?.message || "회원가입 처리 중 문제가 발생했습니다.");
    } catch (error) {
      console.error(error);
      alert(error?.message || "회원가입 처리 중 문제가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSocialSignUp = Boolean(userId);
  const isPasswordValid = isSocialSignUp ? true : pattern.test(password);
  const isPasswordConfirmed =
    isSocialSignUp ? true : passwordCheck !== "" && passwordError === false;
  const canSubmit = isSocialSignUp
    ? checkDuplication === true && termError === false && country !== ""
    : checkDuplication === true &&
      isPasswordValid &&
      isPasswordConfirmed &&
      termError === false &&
      verifyEmail === true &&
      country !== "";

  return (
    <>
      <main
        className={`${styles.width_content} ${styles.min_content} ${styles.member}`}
      >
        <div className={`${styles.header_tit_wrap} ${styles.tit_center}`}>
          <span>Member Join</span>
          <h2>회원가입</h2>
        </div>

        <form onSubmit={onSubmitForm}>
          <div className={styles.inputbox_cont}>
            <input
              type="text"
              name="user-id"
              autoFocus="true"
              autoComplete="off"
              required="Y"
              placeholder="아이디"
              value={username}
              onChange={onChangeUsername}
            />
            <button type="button" onClick={onClickDuplicationCheck}>
              중복 확인
            </button>
            <div className={styles.frm_msg_cont}>
              {checkDuplication === null ? (
                <span className={styles.frm_msg}>
                  사용하실 아이디를 입력해주세요.
                </span>
              ) : checkDuplication === true ? (
                <span className={`${styles.frm_msg} ${styles.good}`}>
                  사용가능한 아이디 입니다.
                </span>
              ) : (
                <span className={`${styles.frm_msg} ${styles.frm_msg_war}`}>
                  중복된 아이디거나 사용할 수 없는 아이디 입니다.
                </span>
              )}
            </div>
          </div>
          <div className={styles.inputbox_cont}>
            <input
              type="password"
              maxLength="50"
              autoComplete="off"
              required="Y"
              name="user-pw"
              placeholder="비밀번호"
              value={password}
              onChange={onChangePassword}
              disabled={userId === null ? false : true}
            />
            <div className={styles.frm_msg_cont}>
              {password === "" || !pattern.test(password) ? (
                <span className={styles.frm_msg}>
                  영문, 숫자, 특수문자 조합 8자 이상 입력하세요.
                </span>
              ) : (
                <span className={`${styles.frm_msg} ${styles.good}`}>
                  사용가능한 비밀번호입니다.
                </span>
              )}
            </div>
          </div>

          <div className={styles.inputbox_cont}>
            <input
              type="password"
              maxLength="50"
              autoComplete="off"
              required="Y"
              placeholder="비밀번호 확인"
              name="user-pwcheck"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
              disabled={userId === null ? false : true}
            />
            <div className={styles.frm_msg_cont}>
              {passwordCheck === "" ? (
                <span className={styles.frm_msg}>
                  비밀번호를 다시 입력해주세요.
                </span>
              ) : passwordError === true ? (
                <span className={`${styles.frm_msg} ${styles.frm_msg_war}`}>
                  두 비밀번호가 일치하지 않습니다.
                </span>
              ) : (
                <span className={`${styles.frm_msg} ${styles.good}`}>
                  비밀번호가 일치합니다.
                </span>
              )}
            </div>
          </div>
          <div className={styles.inputbox_cont}>
            <div className={styles.input_btn_wrap}>
              <input
                type="email"
                name="user-email"
                placeholder="이메일"
                defaultValue={email.current}
                onChange={onChangeEmail}
                disabled={
                  Boolean(paramEmail) ||
                  verifyEmail ||
                  isSendingVerifyEmail ||
                  isSubmitting
                }
              />
              <button
                type="button"
                onClick={onClickVerifyEmail}
                disabled={
                  Boolean(paramEmail) ||
                  verifyEmail ||
                  isSendingVerifyEmail ||
                  isSubmitting
                }
              >
                {isSendingVerifyEmail ? "발송 중..." : "인증번호 발송"}
              </button>
            </div>
          </div>
          <div className={styles.inputbox_cont}>
            <div className={styles.input_btn_wrap}>
              <input
                type="text"
                name="user-emailConfirm"
                placeholder="인증번호"
                maxLength="6"
                onChange={onChangeVerifyNum}
                disabled={
                  Boolean(paramEmail) ||
                  verifyEmail ||
                  !verifyRequested ||
                  isCheckingVerifyCode ||
                  isSubmitting
                }
              />
              <button
                type="button"
                onClick={onClickVerifyEmailNum}
                disabled={
                  Boolean(paramEmail) ||
                  verifyEmail ||
                  !verifyRequested ||
                  isCheckingVerifyCode ||
                  isSubmitting
                }
              >
                {isCheckingVerifyCode ? "확인 중..." : "확인"}
              </button>
            </div>
            {verifyMessage ? (
              <div className={styles.frm_msg_cont}>
                <span
                  className={`${styles.frm_msg} ${
                    verifyMessageType === "success"
                      ? styles.good
                      : styles.frm_msg_war
                  }`}
                >
                  {verifyMessage}
                </span>
              </div>
            ) : null}
          </div>
          <div className={styles.inputbox_cont}>
            <input
              type="text"
              name="user-userName"
              maxLength="50"
              autoComplete="off"
              required="Y"
              placeholder="이름"
              value={nameValue}
              onChange={onChangeName}
            />
          </div>
          <div className={styles.inputbox_cont}>
            <input
              type="text"
              name="user-birthDate"
              defaultValue={dob.current}
              maxLength="6"
              autoComplete="off"
              required="Y"
              placeholder="생년월일 ( 6자 입력 )"
              onChange={onChangeDob}
            />
          </div>
          <div className={styles.inputbox_cont}>
            <input
              type="text"
              name="user-school"
              defaultValue={school.current}
              maxLength="50"
              autoComplete="off"
              required="Y"
              placeholder="학교"
              onChange={onChangeSchool}
            />
          </div>
          <div className={styles.inputbox_cont}>
            <input
              type="text"
              name="user-grade"
              maxLength="50"
              autoComplete="off"
              required="Y"
              placeholder="학년"
              defaultValue={grade.current}
              onChange={onChangeGrade}
            />
          </div>
          <div className={styles.inputbox_cont}>
            <div className={styles.select_cont}>
              <select className="contry_select" onChange={onChangeCountry}>
                <option value="">국가선택</option>
                <option value="ko">한국</option>
                <option value="us">미국</option>
                <option value="jp">일본</option>
                <option value="cn">중국</option>
                <option value="sp">싱가폴</option>
                <option value="my">말레이시아</option>
                <option value="la">남미</option>
                <option value="th">태국</option>
                <option value="hk">홍콩</option>
                <option value="ru">러시아</option>
                <option value="etc">기타</option>
              </select>
              <input
                type="text"
                name="user-address"
                autoComplete="off"
                required="Y"
                placeholder="주소"
                onChange={onChangeAddress}
              />
            </div>
          </div>
          <div className={styles.frm_agree_cont}>
            <div className={styles.frm_agree_all}>
              <input
                type="checkbox"
                name="agree_yn_all"
                onChange={handleAllCheck}
                checked={
                  checkedItems.length === checkBoxes.length ? true : false
                }
              />
              <label htmlFor="agree_yn_all">
                <span></span> 전체동의
              </label>
            </div>

            <ul style={{ listStyle: "none" }}>
              <li className={styles.frm_agree_auth}>
                <div className={styles.frm_agree_flex}>
                  <input
                    type="checkbox"
                    name="firstTerm"
                    onChange={(e) => handleSingleCheck(e, checkBoxes[0].id)}
                    checked={
                      checkedItems.includes(checkBoxes[0].id) ? true : false
                    }
                    required
                  />
                  <label htmlFor="agree_yn1">
                    <span></span> <b>(필수) </b>이용약관에 동의합니다.
                  </label>
                </div>
                <Link href="/terms" target="_blank">
                  ( 자세히보기 )
                </Link>
              </li>
              <li className={styles.frm_agree_auth}>
                <div className={styles.frm_agree_flex}>
                  <input
                    type="checkbox"
                    name="secondTerm"
                    onChange={(e) => handleSingleCheck(e, checkBoxes[1].id)}
                    checked={
                      checkedItems.includes(checkBoxes[1].id) ? true : false
                    }
                    required
                  />
                  <label htmlFor="agree_yn2">
                    <span></span> <b>(필수) </b>개인정보 수집 및 이용에
                    동의합니다.
                  </label>
                </div>
                <Link href="/privacy" target="_blank">
                  ( 자세히보기 )
                </Link>
              </li>

              <li>
                <div className={styles.frm_agree_flex}>
                  <input
                    type="checkbox"
                    name="consent_marketing"
                    value={consent_marketing}
                    onChange={onChangeMarketing}
                  />
                  <label htmlFor="marketing_yn">
                    <span></span> (선택) 커리큘럼, 입시정보, 프로모션 등에 대한
                    마케팅 메세지 혹은 이메일 수신에 동의합니다
                  </label>
                </div>
              </li>
            </ul>
          </div>
          <div className={styles.center_btn_wrap}>
            <button
              type="submit"
              className={styles.login_btn}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "처리 중..." : "가입하기"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default SignUp;
