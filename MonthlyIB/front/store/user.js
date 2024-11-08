import { removeCookie } from "@/apis/cookies";
import {
  openAPILogin,
  openAPINaverLogin,
  openAPISocialLoginCheck,
} from "@/apis/openAPI";
import { subscribeGetUserInfo } from "@/apis/subscribeAPI";
import {
  userDelete,
  userGetAllList,
  userGetInfo,
  userReviseInfo,
} from "@/apis/userAPI";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserInfo = create(
  persist(
    (set) => ({
      userInfo: {},
      signIn: async (username, password) => {
        try {
          const res = await openAPILogin(username, password);
          set({ userInfo: res.data });
          return res;
        } catch (error) {
          console.error(error);
        }
      },
      signOut: () => {
        set({ userInfo: {} });
        localStorage.removeItem("userInfo");
        removeCookie("accessToken");
        removeCookie("authority");
      },
      socialSignIn: async (oauthAccessToken, loginType) => {
        try {
          const res = await openAPISocialLoginCheck(
            oauthAccessToken,
            loginType
          );
          set({ userInfo: res.data });
        } catch (error) {
          console.error(error);
        }
      },
      signInNaver: async (authorizationCode, state) => {
        try {
          const res = await openAPINaverLogin(authorizationCode, state);
          set({ userInfo: res.data });
        } catch (error) {
          console.error(error);
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
    } catch (error) {
      console.error(error);
    }
  },
  getUserSubscribeInfo: async (userId, page, session) => {
    try {
      const res = await subscribeGetUserInfo(userId, page, session);
      set({ userSubscribeInfo: res.data });
    } catch (error) {
      console.error(error);
    }
  },
  signIn: async (username, password) => {
    try {
      const res = await openAPILogin(username, password);
      set({ userInfo: res.data });
      return res;
    } catch (error) {
      console.error(error);
    }
  },
  signOut: () => {
    set({ userInfo: {} });
    localStorage.removeItem("userInfo");
    removeCookie("accessToken");
    removeCookie("authority");
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
    } catch (error) {
      console.error(error);
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
