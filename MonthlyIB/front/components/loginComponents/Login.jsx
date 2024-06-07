"use client";

import styles from "./Login.module.css";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
// import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";

const googleLink = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}.apps.googleusercontent.com&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL}&response_type=token&scope=email profile`;

const kakaoLink = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL}&response_type=code`;

export const naverLink = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&state=dijDIJFDIdk&redirect_uri=${process.env.NEXT_PUBLIC_NAVER_REDIRECT_URL}`;

function Login() {
  const [username, setId] = useState("");
  const [password, setPassword] = useState("");

  // const { data: session } = useSession();
  const { userInfo, signIn } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (userInfo?.userStatus === "ACTIVE") {
      router.replace("/");
    }
  }, [userInfo]);
  const onChangeId = useCallback((e) => {
    setId(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      const res = await signIn(username, password);
      console.log(res);
      if (res?.result.status !== 200) {
        alert(res?.message);
      }
    },
    [username, password]
  );

  return (
    <>
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
            // required
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
                    <Image
                      src={"/img/common/ico_google.png"}
                      width="42"
                      height="42"
                      alt="google"
                    />
                  </figure>
                  <span>Google</span>
                </Link>
              </li>
              <li>
                <Link href={naverLink}>
                  <figure>
                    <Image
                      src={"/img/common/ico_naver.png"}
                      width="28"
                      height="28"
                      alt="naver"
                    />
                  </figure>
                  <span>네이버</span>
                </Link>
              </li>
              <li>
                <Link href={kakaoLink}>
                  <figure>
                    <Image
                      src={"/img/common/ico_kakao.png"}
                      width="42"
                      height="42"
                      alt="kakao"
                    />
                  </figure>
                  <span>카카오</span>
                </Link>
              </li>
            </ul>
          </div>
        </form>
      </main>
    </>
  );
}
export default Login;
