import NextAuth from "next-auth/next";
import CredentialProvider from "next-auth/providers/credentials";

const loginPost = async (credentials) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}open-api/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials?.username,
          password: credentials?.password,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed POST Status: ${res.status}`);
    }
    const json = await res.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const authOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialProvider({
      name: "credentials",
      credentails: {},
      async authorize(credentails) {
        try {
          const user = await loginPost(credentails);
          console.log("success?", user);
          return user.data;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.userId) {
        token.userId = user.userId;
      }
      if (user?.username) {
        token.username = user.username;
      }

      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }

      if (user?.nickname) {
        token.nickname = user.nickname;
      }
      return token;
    },

    async session({ session, token, user }) {
      session.userId = token.userId;
      session.username = token.username;
      session.nickname = token.nickname;
      session.accessToken = token.accessToken;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
