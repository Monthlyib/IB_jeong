import axios from "axios";
import { openAPIReissueToken } from "./openAPI";
import { useUserInfo } from "@/store/user";
import { setCookie } from "./cookies";

export const tokenRequireApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

tokenRequireApi.defaults.withCredentials = true;

let refreshPromise = null;

const parseJwtPayload = (token) => {
  try {
    const normalizedToken = token?.replace(/^Bearer\s+/i, "");
    if (!normalizedToken) {
      return null;
    }

    const base64Payload = normalizedToken.split(".")[1];
    if (!base64Payload) {
      return null;
    }

    const normalizedBase64 = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 =
      normalizedBase64 + "=".repeat((4 - (normalizedBase64.length % 4)) % 4);

    return JSON.parse(window.atob(paddedBase64));
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds + 10;
};

const handleExpiredSession = () => {
  useUserInfo.getState().signOut();
  alert("다시 로그인 해주세요.");
  window.location.replace("/login");
};

const reissueAccessToken = async () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?.state?.userInfo?.userId;

  if (!userId) {
    handleExpiredSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = openAPIReissueToken(userId)
      .then((res) => {
        if (res?.result?.status !== 200) {
          throw new Error("Failed to reissue token");
        }

        const newToken = res.data.accessToken;
        setCookie("accessToken", newToken, { path: "/", sameSite: "lax" });
        setCookie("authority", res.data.authority, {
          path: "/",
          sameSite: "lax",
        });

        userInfo.state.userInfo.accessToken = newToken;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        useUserInfo.getState().updateUserInfo(userInfo.state.userInfo);

        return newToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  try {
    return await refreshPromise;
  } catch (error) {
    console.error(error);
    handleExpiredSession();
    return null;
  }
};

tokenRequireApi.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const currentAuthorization = config.headers?.Authorization;
  if (!currentAuthorization || !isTokenExpired(currentAuthorization)) {
    return config;
  }

  const newToken = await reissueAccessToken();
  if (newToken) {
    config.headers.Authorization = newToken;
  }

  return config;
});

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
      const originRequest = error.config;
      const newToken = await reissueAccessToken();
      if (newToken) {
        originRequest.headers.Authorization = newToken;
        return axios(originRequest);
      }
    }

    return Promise.reject(error);
  }
);
