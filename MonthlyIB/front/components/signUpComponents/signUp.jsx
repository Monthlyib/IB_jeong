"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./signup.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

const SignUp = () => {
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
  const query = router.query;

  const pattern = /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[\W_]).{8,}$/;

  const [username, setUsername] = useState("");
  const [checkDuplication, setCheckDuplication] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [country, setCountry] = useState("");
  const name = useRef("");
  const email = useRef("");
  const dob = useRef("");
  const school = useRef("");
  const grade = useRef("");
  const address = useRef("");
  const verifyNum = useRef("");

  const [checkedItems, setCheckedItems] = useState([]);
  const [termError, setTermError] = useState(true);
  const [consent_marketing, setMarketing] = useState(false);

  const [duplicationCheckStatus, setDuplicationCheckStatus] = useState(true);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.username) {
      router.replace("/");
    }
  }, [session]);

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
  }, []);

  const onChangeUsername = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  const onClickVerifyEmail = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}open-api/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.current }),
        }
      );
      if (res.ok) {
        console.log("yay");
      }
    } catch (error) {
      console.error(error);
    }
  }, [email]);

  const onClickVerifyEmailNum = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}open-api/verify-num`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.current,
            verifyNum: verifyNum.current,
          }),
        }
      );
      if (res.ok) {
        console.log("yay");
        setVerifyEmail(true);
      }
    } catch (error) {
      console.error(error);
    }
  }, [email]);

  const onClickDuplicationCheck = useCallback(() => {}, [username]);

  const onSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}open-api/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              password,
              nickname: name.current,
              birth: dob.current,
              school: school.current,
              grade: grade.current,
              address: address.current,
              termsOfUseCheck: true,
              privacyTermsCheck: true,
              marketingTermsCheck: consent_marketing,
            }),
          }
        );
        if (res.ok) {
          await signIn("credentials", {
            username,
            password,
            redirect: false,
          });
          router.push("/");
        }
      } catch (error) {
        console.error(error);
      }
    },
    [
      username,
      password,
      name,
      email,
      dob,
      grade,
      address,
      consent_marketing,
      school,
      query,
    ]
  );

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
              {duplicationCheckStatus === null ? (
                <span className={styles.frm_msg}>
                  사용하실 아이디를 입력해주세요.
                </span>
              ) : duplicationCheckStatus === true ? (
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
              />
              <button type="button" onClick={onClickVerifyEmail}>
                인증번호 발송
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
              />
              <button type="button" onClick={onClickVerifyEmailNum}>
                확인
              </button>
            </div>
          </div>

          <div className={styles.inputbox_cont}>
            <input
              type="text"
              name="user-userName"
              maxLength="50"
              autoComplete="off"
              required="Y"
              placeholder="이름"
              defaultValue={name.current}
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
                <option value="en">미국</option>
                <option value="jp">일본</option>
                <option value="cn">중국</option>
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

            <ul>
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
            {checkDuplication === true &&
            passwordError === false &&
            termError === false ? (
              <button type="submit" className={styles.login_btn}>
                가입하기
              </button>
            ) : (
              <button disabled={true} className={styles.login_btn}>
                가입하기
              </button>
            )}
          </div>
        </form>
      </main>
    </>
  );
};

export default SignUp;
