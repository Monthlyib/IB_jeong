import { tokenRequireApi } from "./refreshToken";

const FINANCE_API_URL = "api/admin/finance";

export const getAdminFinanceOverview = async (months, session) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: session?.accessToken,
    },
  };
  const res = await tokenRequireApi.get(
    `${FINANCE_API_URL}/overview?months=${months}`,
    config
  );
  return res.data?.data;
};

export const getAdminFinanceDetails = async (yearMonth, session) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: session?.accessToken,
    },
  };
  const res = await tokenRequireApi.get(
    `${FINANCE_API_URL}/details?yearMonth=${yearMonth}`,
    config
  );
  return res.data?.data;
};
