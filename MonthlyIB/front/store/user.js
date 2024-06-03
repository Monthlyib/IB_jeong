import {
  openAPILogin,
  openAPINaverLogin,
  openAPIReissueToken,
  openAPISocialLoginCheck,
} from "@/apis/openAPI";
import { userGetInfo } from "@/apis/userAPI";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      userInfo: {},
      userDetailInfo: {},
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
        } catch (error) {
          console.error(error);
        }
      },
      signOut: () => {
        set({ userInfo: {} });
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

      reissueToken: async (userId) => {
        try {
          console.log("called");
          const res = await openAPIReissueToken(userId);
          set({ userInfo: res.data });
        } catch (error) {
          console.error(error);
        }
      },
    }),
    {
      name: "userInfo",
    }
  )
);
