import axios from "axios";
import { openAPIReissueToken } from "./openAPI";
import { useUserInfo } from "@/store/user";
import { setCookie } from "./cookies";

export const tokenRequireApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

tokenRequireApi.defaults.withCredentials = true;

tokenRequireApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const errorStatus = error?.response?.data?.status;
    const errorMessage = error?.response?.data?.message;
    if (
      errorStatus === 403 &&
      errorMessage === "Expired Access Token"
    ) {
      const handleExpiredSession = () => {
        useUserInfo.getState().signOut();
        alert("다시 로그인 해주세요.");
        window.location.replace("/login");
      };

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.state?.userInfo?.userId) {
        handleExpiredSession();
        return Promise.reject(error);
      }

      try {
        const originRequest = error.config;
        const res = await openAPIReissueToken(userInfo.state.userInfo.userId);
        if (res?.result?.status === 200) {
          const newToken = res.data.accessToken;
          setCookie("accessToken", newToken, { path: "/", sameSite: "lax" });
          setCookie("authority", res.data.authority, {
            path: "/",
            sameSite: "lax",
          });
          userInfo.state.userInfo.accessToken = newToken;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          useUserInfo.getState().updateUserInfo(userInfo.state.userInfo);
          originRequest.headers.Authorization = newToken;
          return axios(originRequest);
        }
      } catch (reissueError) {
        console.error(reissueError);
      }

      handleExpiredSession();
    }

    return Promise.reject(error);
  }
);
