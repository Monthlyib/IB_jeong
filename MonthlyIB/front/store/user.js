import { removeCookie } from "@/apis/cookies";
import {
  openAPILogin,
  openAPINaverLogin,
  openAPIReissueToken,
  openAPISocialLoginCheck,
} from "@/apis/openAPI";
import { userGetAllList, userGetInfo } from "@/apis/userAPI";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      userInfo: {},
      userDetailInfo: {},
      userList: [],
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
