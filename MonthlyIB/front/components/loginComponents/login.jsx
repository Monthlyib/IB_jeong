"use client";

import styles from "./login.module.css";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

function Login() {
  const [username, setId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.username) {
      router.replace("/");
    }
  }, [session]);

  const onChangeId = useCallback((e) => {
    setId(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const res = await signIn("credentials", {
          username,
          password,
          redirect: false,
        });
      } catch (error) {
        console.log(error);
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
                <Link href="">
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
                <Link href="" target="_blank" rel="noreferrer noopener">
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
                <Link href="">
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
