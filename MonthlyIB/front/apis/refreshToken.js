import axios from "axios";
import { openAPIReissueToken } from "./openAPI";
import { useUserStore } from "@/store/user";

export const tokenRequireApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

tokenRequireApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response.data.status === 403 &&
      error.response.data.message === "Expired Access Token"
    ) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const originRequest = error.config;
      const res = await openAPIReissueToken(userInfo.state.userInfo.userId);
      if (res.result.status === 200) {
        const newToken = res.data.accessToken;
        userInfo.state.userInfo.accessToken = newToken;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        useUserStore.getState().updateUserInfo(userInfo.state.userInfo);
        originRequest.headers.Authorization = newToken;
        return axios(originRequest);
      } else {
        alert("다시 로그인 해주세요.");
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);
