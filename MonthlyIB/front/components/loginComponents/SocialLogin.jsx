"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SyncLoader } from "react-spinners";
import { getCookie } from "@/apis/cookies";
import styles from "./SocialLogin.module.css";
import {
  useSocialOnboardingStore,
  useUserInfo,
} from "@/store/user";

const GOOGLE_LOGIN_STATE_KEY = "monthlyib.google.login.state";
const NAVER_LOGIN_STATE = "dijDIJFDIdk";
const SOCIAL_LABELS = {
  1: "GOOGLE",
  2: "KAKAO",
  3: "NAVER",
};

const normalizeSocialErrorMessage = (message) => {
  if (!message) {
    return "소셜 로그인에 실패했습니다. 다시 시도해주세요.";
  }

  if (message === "USER EXIST") {
    return "이미 가입된 계정입니다. 기존 방식으로 로그인하거나 관리자에게 문의해주세요.";
  }

  return message;
};

const SocialLogin = ({ social }) => {
  const router = useRouter();
  const socialType = SOCIAL_LABELS[social];
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState(
    `${socialType} 로그인 중입니다.`
  );

  const { signInGoogle, socialSignIn, signInNaver } = useUserInfo();
  const clearPendingSocialAuth = useSocialOnboardingStore(
    (state) => state.clearPendingSocialAuth
  );

  useEffect(() => {
    if (getCookie("authority")) {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    let ignore = false;

    const handleLoginSuccess = (response) => {
      const loginData = response?.data;
      if (!loginData) {
        throw new Error(response?.message || "소셜 로그인 응답이 올바르지 않습니다.");
      }

      if (loginData.userStatus === "ACTIVE") {
        router.replace("/");
        return;
      }

      if (loginData.userStatus === "WAIT_INFO") {
        router.replace("/signup");
        return;
      }

      throw new Error("처리할 수 없는 회원 상태입니다.");
    };

    const handleGoogleLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const authorizationCode = params.get("code");
      const state = params.get("state");
      const savedState = window.sessionStorage.getItem(GOOGLE_LOGIN_STATE_KEY);
      window.sessionStorage.removeItem(GOOGLE_LOGIN_STATE_KEY);

      if (!authorizationCode) {
        throw new Error("Google 로그인 인증 코드가 없습니다.");
      }

      if (!state || !savedState || state !== savedState) {
        throw new Error("Google 로그인 state 검증에 실패했습니다.");
      }

      setStatusMessage("Google 계정을 확인하고 있습니다.");
      const response = await signInGoogle(
        authorizationCode,
        process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL
      );
      handleLoginSuccess(response);
    };

    const handleKakaoLogin = async () => {
      const code = new URL(window.location.href).searchParams.get("code");
      if (!code) {
        throw new Error("Kakao 로그인 인증 코드가 없습니다.");
      }

      setStatusMessage("Kakao 계정을 확인하고 있습니다.");

      const url = `https://kauth.kakao.com/oauth/token?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&code=${code}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL}&grant_type=authorization_code`;
      const tokenResponse = await fetch(url, { method: "GET" });

      if (!tokenResponse.ok) {
        throw new Error("Kakao access token 요청에 실패했습니다.");
      }

      const tokenJson = await tokenResponse.json();
      const response = await socialSignIn(tokenJson.access_token, "KAKAO");
      handleLoginSuccess(response);
    };

    const handleNaverLogin = async () => {
      const code = new URL(window.location.href).searchParams.get("code");
      if (!code) {
        throw new Error("NAVER 로그인 인증 코드가 없습니다.");
      }

      setStatusMessage("Naver 계정을 확인하고 있습니다.");
      const response = await signInNaver(code, NAVER_LOGIN_STATE);
      handleLoginSuccess(response);
    };

    const completeLogin = async () => {
      try {
        clearPendingSocialAuth();

        if (social === 1) {
          await handleGoogleLogin();
          return;
        }

        if (social === 2) {
          await handleKakaoLogin();
          return;
        }

        if (social === 3) {
          await handleNaverLogin();
          return;
        }

        throw new Error("지원하지 않는 소셜 로그인 타입입니다.");
      } catch (error) {
        if (ignore) {
          return;
        }
        console.error(error);
        setErrorMessage(
          normalizeSocialErrorMessage(error?.message)
        );
      }
    };

    completeLogin();

    return () => {
      ignore = true;
    };
  }, [
    clearPendingSocialAuth,
    router,
    signInGoogle,
    signInNaver,
    social,
    socialSignIn,
  ]);

  if (errorMessage) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <span className={styles.eyebrow}>Social Login</span>
          <h1 className={styles.title}>로그인을 완료하지 못했습니다.</h1>
          <p className={`${styles.message} ${styles.error}`}>{errorMessage}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.button}
              onClick={() => router.replace("/login")}
            >
              로그인으로 돌아가기
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.eyebrow}>Social Login</span>
        <h1 className={styles.title}>계정을 확인하고 있습니다.</h1>
        <p className={styles.message}>{statusMessage}</p>
        <div className={styles.loaderWrap}>
          <SyncLoader color="#5b417d" />
        </div>
      </section>
    </main>
  );
};

export default SocialLogin;
