import { tokenRequireApi } from "./refreshToken";

const PAY_API_URL = "api/order";

export const payGetSubscribeHistory = async (subscribeId, page, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.get(
      `${PAY_API_URL}/sub/list/${subscribeId}?page=${page}`,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const payGetUserPurchaseHistory = async (userId, page, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.get(
      `${PAY_API_URL}/list/${userId}?page=${page}`,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const payConfirm = async (
  subscribeId,
  orderId,
  amount,
  paymentKey,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { subscribeId, orderId, amount, paymentKey };
    const res = await tokenRequireApi.post(
      `${PAY_API_URL}/confirm`,
      data,
      config
    );
    return res;
    if (!res.ok) {
      // 결제 실패 비즈니스 로직을 구현하세요.
      return false;
    } else {
      console.log("pay success");
    }
    return json;
  } catch (error) {
    console.error(error);
  }
};
