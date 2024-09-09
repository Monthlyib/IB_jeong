import { tokenRequireApi } from "./refreshToken";

const MAIL_API_URL = "api/mail";

export const mailPost = async (userId, content, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { targetUserId: [userId], content };
    await tokenRequireApi.post(`${MAIL_API_URL}`, data, config);
  } catch (error) {
    console.error(error);
  }
};
