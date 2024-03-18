import AppLayout from "../main_components/AppLayout";
import styles from "../styles/login.module.css";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import google from "../assets/img/common/ico_google.png";
import kakao from "../assets/img/common/ico_kakao.png";
import naver from "../assets/img/common/ico_naver.png";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../reducers/user";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { logInDone } = useSelector((state) => state.user);
  const [username, setId] = useState("");
  const [password, setPassword] = useState("");

  //   const googleRedirectLink = "http://localhost:3000/google";
  const googleLink = `https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?client_id=111347375718-e67lmdbd7jv9e24bjmcuv77mudimq6h7.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fmonthlyib.co.kr%2Fgoogle&scope=profile&email&response_type=code&include_granted_scopes=true&access_type=offline&state=state_parameter_passthrough_value&service=lso&o2v=1&theme=glif&flowName=GeneralOAuthFlow`;
  //   const kakaoRedirectLink = "http://localhost:3000/kakao";
  const kakaoLink = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=7505e1fae603ddce895b12d1946b0784&redirect_uri=https%3A%2F%2Fmonthlyib.co.kr%2Fkakao`;
  //   const naverRedirectLink = "http://localhost:3000/naver";
  const naverLink = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=RcVDetGjgDPE5MP_D9A3&redirect_uri=https%3A%2F%2Fmonthlyib.co.kr%2Fnaver&state=1`;
  useEffect(() => {
    if (logInDone) {
      router.back();
    }
  }, [logInDone]);

  const onChangeId = useCallback((e) => {
    setId(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(userActions.logInRequest({ username, password }));
    },
    [username, password]
  );

  return (
    <>
      <AppLayout>
        <main
          className={`${styles.width_content} ${styles.min_content} ${styles.login} `}
        >
          <div className={`${styles.header_tit_wrap} ${styles.tit_center} `}>
            <span>Member Login</span>
            <h2>로그인</h2>
          </div>
          <form onSubmit={onSubmitForm}>
            <input
              type="text"
              name="user-id"
              value={username || ""}
              onChange={onChangeId}
              required
              placeholder="아이디"
            />
            <input
              type="password"
              name="user-password"
              value={password || ""}
              onChange={onChangePassword}
              required
              placeholder="비밀번호"
            />
            <button type="submit" className={styles.login_btn}>
              로그인
            </button>

            <div className={styles.bottom_option}>
              <Link href="/find">아이디 / 비밀번호 찾기</Link>
              <Link href="/signup">회원가입</Link>
            </div>

            <div className={styles.simple_login}>
              <h3>간편 로그인</h3>
              <ul>
                <li>
                  <Link href={googleLink}>
                    <figure>
                      <Image src={google} alt="google" />
                    </figure>
                    <span>Google</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={naverLink}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <figure>
                      <Image src={naver} alt="naver" />
                    </figure>
                    <span>네이버</span>
                  </Link>
                </li>
                <li>
                  <Link href={kakaoLink}>
                    <figure>
                      <Image src={kakao} alt="kakao" />
                    </figure>
                    <span>카카오</span>
                  </Link>
                </li>
              </ul>
            </div>
          </form>
        </main>
      </AppLayout>
    </>
  );
};

export default Login;
