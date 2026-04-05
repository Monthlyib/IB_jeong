import { tokenRequireApi } from "./refreshToken";

const MAIL_API_URL = "api/mail";

export const mailPost = async (userId, subject, content, session) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: session?.accessToken,
    },
  };
  const data = { targetUserId: [userId], subject, content };
  const response = await tokenRequireApi.post(`${MAIL_API_URL}`, data, config);
  return response.data;
};
