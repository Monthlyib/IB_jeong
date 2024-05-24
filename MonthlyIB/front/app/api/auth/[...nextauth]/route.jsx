import NextAuth from "next-auth/next";
import CredentialProvider from "next-auth/providers/credentials";
import {
  openAPILogin,
  openAPIReissueToken,
  openAPISocialLoginCheck,
  openAPINaverLogin,
} from "@/api/openAPI";

async function refreshAcessToken(userId) {
  try {
    const res = await openAPIReissueToken(userId);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export const authOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          const user = await openAPILogin(credentials);
          return user.data;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
    CredentialProvider({
      id: "social",
      name: "social",
      credentials: {},
      async authorize(credentials) {
        try {
          const user = await openAPISocialLoginCheck(credentials);

          return user.data;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),

    CredentialProvider({
      id: "naver",
      name: "naver",
      credentials: {},
      async authorize(credentials) {
        try {
          const user = await openAPINaverLogin(credentials);
          console.log(user.data);
          return user.data;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, user }) {
      if (user?.userId) {
        token.userId = user.userId;
      }
      if (user?.username) {
        token.username = user.username;
      }

      if (user?.email) {
        token.email = user.email;
      }

      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }

      if (user?.nickname) {
        token.nickname = user.nickname;
      }
      if (user?.authority) {
        token.authority = user.authority;
      }

      if (user?.userStatus) {
        token.userStatus = user.userStatus;
      }

      if (trigger === "update" && token?.userId) {
        console.log("updating");
        return refreshAcessToken(token?.userId);
      }
      return token;
    },

    async session({ session, token }) {
      session.userId = token.userId;
      session.username = token.username;
      session.email = token.email;
      session.nickname = token.nickname;
      session.accessToken = token.accessToken;
      session.authority = token.authority;
      session.expires = token.expires;
      session.accessExpireTime = token.accessExpireTime;
      session.userStatus = token.userStatus;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
