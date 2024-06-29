"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SyncLoader } from "react-spinners";
import { useUserInfo } from "@/store/user";
import { getCookie } from "@/apis/cookies";

const SocialLogin = ({ social }) => {
  const socialMethod = { 1: "GOOGLE", 2: "KAKAO", 3: "NAVER" };
  const [authCode, setAuthCode] = useState("");
  const [socialType, setSocialType] = useState(socialMethod[social]);
  let code = null;
  let access_token = null;

  const { userInfo, socialSignIn, signInNaver } = useUserInfo();

  useEffect(() => {
    if (getCookie("authority")) {
      router.replace("/");
    } else if (userInfo?.userStatus === "WAIT_INFO") {
      handleNewUser(userInfo, authCode, socialType);
    }
  }, [userInfo]);

  useEffect(() => {
    if (social === 1) {
      let loc = window.location.href.replace("#", "?");
      access_token = new URL(loc).searchParams.get("access_token");
      setAuthCode(access_token);
      handleGoogleLogin(access_token, "GOOGLE");
    } else if (social === 2 || social === 3) {
      code = new URL(window.location.href).searchParams.get("code");
      if (social === 2) handleKakaoLogin(code, "KAKAO");
      else if (social === 3) handleNaverLogin(code, "NAVER");
    }
  }, []);

  const router = useRouter();

  const handleKakaoLogin = async (code, social) => {
    const url = `https://kauth.kakao.com/oauth/token?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&code=${code}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL}&grant_type=authorization_code`;
    const res = await fetch(url, {
      method: "GET",
    });
    const json = await res.json();
    setAuthCode(json.access_token);
    handleExistUser(json.access_token, social);
  };

  const handleGoogleLogin = async (oauthAccessToken, social) => {
    handleExistUser(oauthAccessToken, social);
  };

  const handleNaverLogin = async (code) => {
    try {
      signInNaver(code, "dijDIJFDIdk");
    } catch (error) {
      console.error(error);
    }
  };

  const handleExistUser = async (oauthAccessToken, social) => {
    try {
      socialSignIn(oauthAccessToken, social);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewUser = (res, authCode, social) => {
    router.push(
      `/signup?id=${res?.userId}&email=${res?.email}&access_token=${res?.accessToken}&auth_code=${authCode}&social=${social}`,
      "/signup/"
    );
  };

  return (
    <divs
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "50vh auto",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h3> {socialMethod[social]} 로그인 중입니다.</h3>
      <SyncLoader />
    </divs>
  );
};

export default SocialLogin;
