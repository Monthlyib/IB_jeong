import { removeCookie } from "@/apis/cookies";
import {
  openAPIGoogleLogin,
  openAPILogin,
  openAPINaverLogin,
  openAPISocialLoginCheck,
} from "@/apis/openAPI";
import { subscribeActiveUserInfo, subscribeGetUserInfo } from "@/apis/subscribeAPI";
import {
  userDelete,
  userGetAllList,
  userGetInfo,
  userReviseInfo,
} from "@/apis/userAPI";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const SOCIAL_ONBOARDING_STORAGE_KEY = "socialOnboarding";

const readPendingSocialAuth = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.sessionStorage.getItem(SOCIAL_ONBOARDING_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    window.sessionStorage.removeItem(SOCIAL_ONBOARDING_STORAGE_KEY);
    return null;
  }
};

const writePendingSocialAuth = (payload) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!payload) {
    window.sessionStorage.removeItem(SOCIAL_ONBOARDING_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(
    SOCIAL_ONBOARDING_STORAGE_KEY,
    JSON.stringify(payload)
  );
};

const clearPendingSocialAuthState = () => {
  useSocialOnboardingStore.getState().clearPendingSocialAuth();
};

const handleSocialLoginResult = (set, res) => {
  const loginData = res?.data;
  if (!loginData) {
    throw new Error(res?.message || "소셜 로그인 응답이 올바르지 않습니다.");
  }

  if (loginData.userStatus === "ACTIVE") {
    clearPendingSocialAuthState();
    set({ userInfo: loginData });
    return res;
  }

  if (loginData.userStatus === "WAIT_INFO") {
    useSocialOnboardingStore.getState().setPendingSocialAuth({
      userId: loginData.userId,
      email: loginData.email,
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
      authority: loginData.authority,
      userStatus: loginData.userStatus,
    });
    set({ userInfo: {} });
    return res;
  }

  throw new Error("처리할 수 없는 소셜 로그인 상태입니다.");
};

export const useSocialOnboardingStore = create((set) => ({
  pendingSocialAuth: readPendingSocialAuth(),
  hydratePendingSocialAuth: () => {
    set({ pendingSocialAuth: readPendingSocialAuth() });
  },
  setPendingSocialAuth: (payload) => {
    writePendingSocialAuth(payload);
    set({ pendingSocialAuth: payload });
  },
  clearPendingSocialAuth: () => {
    writePendingSocialAuth(null);
    set({ pendingSocialAuth: null });
  },
}));

export const useUserInfo = create(
  persist(
    (set) => ({
      userInfo: {},
      loading: false,
      signIn: async (username, password) => {
        try {
          const res = await openAPILogin(username, password);
          clearPendingSocialAuthState();
          set({ userInfo: res.data });
          return res;
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      signOut: () => {
        set({ userInfo: {} });
        localStorage.removeItem("userInfo");
        removeCookie("accessToken");
        removeCookie("refreshToken");
        removeCookie("authority");
        clearPendingSocialAuthState();
      },
      socialSignIn: async (oauthAccessToken, loginType) => {
        try {
          const res = await openAPISocialLoginCheck(
            oauthAccessToken,
            loginType
          );
          return handleSocialLoginResult(set, res);
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      signInNaver: async (authorizationCode, state) => {
        try {
          const res = await openAPINaverLogin(authorizationCode, state);
          return handleSocialLoginResult(set, res);
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      signInGoogle: async (authorizationCode, redirectUri) => {
        try {
          const res = await openAPIGoogleLogin(authorizationCode, redirectUri);
          return handleSocialLoginResult(set, res);
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      updateUserInfo: (res) => {
        set({ userInfo: res });
      },
    }),

    {
      name: "userInfo",
    }
  )
);

export const useUserStore = create((set, get) => ({
  userDetailInfo: {},
  userList: [],
  userSubscribeInfo: {},
  activeSubscribeInfo: null,
  getUserList: async (session) => {
    try {
      const res = await userGetAllList(session);
      set({ userList: res.data });
    } catch (error) {
      console.error(error);
    }
  },
  getUserInfo: async (userId, session) => {
    try {
      const res = await userGetInfo(userId, session);
      set({ userDetailInfo: res.data });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getUserSubscribeInfo: async (userId, page, session) => {
    try {
      const res = await subscribeGetUserInfo(userId, page, session);
      let activeSubscribeInfo = null;
      try {
        const activeRes = await subscribeActiveUserInfo(userId, session);
        activeSubscribeInfo = activeRes?.data ?? null;
      } catch (error) {
        activeSubscribeInfo = null;
      }
      set({ userSubscribeInfo: res.data, activeSubscribeInfo });
    } catch (error) {
      console.error(error);
    }
  },
  getActiveSubscribeInfo: async (userId, session) => {
    try {
      const res = await subscribeActiveUserInfo(userId, session);
      set({ activeSubscribeInfo: res?.data ?? null });
      return res?.data ?? null;
    } catch (error) {
      console.error(error);
      set({ activeSubscribeInfo: null });
      return null;
    }
  },
  signIn: async (username, password) => {
    try {
      const res = await openAPILogin(username, password);
      clearPendingSocialAuthState();
      set({ userInfo: res.data });
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  signOut: () => {
    set({ userInfo: {} });
    localStorage.removeItem("userInfo");
    removeCookie("accessToken");
    removeCookie("refreshToken");
    removeCookie("authority");
    clearPendingSocialAuthState();
  },

  reviseUserInfo: async (
    userId,
    email,
    nickName,
    birth,
    school,
    grade,
    address,
    country,
    userStatus,
    authority,
    memo,
    marketingTermsCheck,
    userInfo
    ) => {
    try {
      const res = await userReviseInfo(
        userId,
        "",
        email,
        nickName,
        birth,
        school,
        grade,
        address,
        country,
        userStatus,
        authority,
        memo,
        marketingTermsCheck,
        userInfo
      );
      set({ userDetailInfo: res.data });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteUser: async (userId, session) => {
    try {
      await userDelete(userId, session);
      get().getUserList(session);
    } catch (error) {
      console.error(error);
    }
  },
}));
