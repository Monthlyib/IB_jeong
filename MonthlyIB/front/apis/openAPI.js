import { getCookie, setCookie } from "./cookies";
import { tokenRequireApi } from "./refreshToken";

const OPEN_API_URL = "open-api";

const getErrorMessage = async (res, fallbackMessage) => {
  try {
    const json = await res.json();
    return json?.message || fallbackMessage;
  } catch (error) {
    return fallbackMessage;
  }
};

const getAxiosErrorMessage = (error, fallbackMessage) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
};

const readJsonSafely = async (res) => {
  try {
    return await res.json();
  } catch (error) {
    return null;
  }
};

const normalizeFetchResponse = async (res, fallbackMessage) => {
  const json = await readJsonSafely(res);

  if (json) {
    return json;
  }

  if (res.ok) {
    return {
      result: {
        status: res.status,
        message: "Success",
      },
      data: null,
    };
  }

  return {
    result: {
      status: res.status,
      message: "Error",
    },
    message: fallbackMessage,
    data: null,
  };
};

const applyLoginCookies = (loginData) => {
  if (!loginData || loginData.userStatus !== "ACTIVE") {
    return;
  }

  setCookie("accessToken", loginData.accessToken, {
    path: "/",
    sameSite: "lax",
  });
  setCookie("refreshToken", loginData.refreshToken, {
    path: "/",
    sameSite: "lax",
  });
  setCookie("authority", loginData.authority, {
    path: "/",
    sameSite: "lax",
  });
};

const resolveFieldValue = (value) => {
  if (typeof value === "string") {
    return value;
  }

  return value?.current ?? "";
};

export const openAPIVerifyUsername = async (username) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/verify-username`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      }
    );
    return normalizeFetchResponse(
      res,
      "아이디 중복 확인 중 문제가 발생했습니다."
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const openAPIVerifyEmail = async (email) => {
  try {
    const resolvedEmail = resolveFieldValue(email);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/verify-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resolvedEmail }),
      }
    );
    return normalizeFetchResponse(
      res,
      "인증 메일 발송에 실패했습니다. 다시 시도해주세요."
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const openAPIVerifyNum = async (email, verifyNum, pwdReset = false) => {
  try {
    const resolvedEmail = resolveFieldValue(email);
    const resolvedVerifyNum = resolveFieldValue(verifyNum);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/verify-num`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resolvedEmail,
          verifyNum: resolvedVerifyNum,
          pwdReset: pwdReset,
        }),
      }
    );
    return normalizeFetchResponse(
      res,
      "인증번호 확인에 실패했습니다. 다시 시도해주세요."
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const openAPIRegister = async (
  username,
  password,
  name,
  email,
  dob,
  school,
  grade,
  address,
  country,
  verifyNum,
  consent_marketing
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          nickName: name.current,
          email: email.current,
          birth: dob.current,
          school: school.current,
          grade: grade.current,
          address: address.current,
          country,
          verifyNum: verifyNum.current,
          termsOfUseCheck: true,
          privacyTermsCheck: true,
          marketingTermsCheck: consent_marketing,
        }),
      }
    );

    return normalizeFetchResponse(
      res,
      "회원가입 처리 중 문제가 발생했습니다. 다시 시도해주세요."
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const openAPIReissueToken = async (userId) => {
  try {
    const refreshToken = getCookie("refreshToken");
    if (!refreshToken) {
      return null;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/reissue-token/${userId}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const openAPIFindPwd = async (username, email, verifyNum) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: resolveFieldValue(username),
          email: resolveFieldValue(email),
          verifyNum: resolveFieldValue(verifyNum),
        }),
      }
    );
    return normalizeFetchResponse(
      res,
      "비밀번호 초기화에 실패했습니다. 다시 시도해주세요."
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const openAPILogin = async (username, password) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = { username, password };
    const res = await tokenRequireApi.post(
      `${OPEN_API_URL}/login`,
      data,
      config
    );

    setCookie("accessToken", res.data.data.accessToken, {
      path: "/",
      sameSite: "lax",
    });
    setCookie("refreshToken", res.data.data.refreshToken, {
      path: "/",
      sameSite: "lax",
    });
    setCookie("authority", res.data.data.authority, {
      path: "/",
      sameSite: "lax",
    });

    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error(
      getAxiosErrorMessage(error, "로그인에 실패했습니다. 다시 시도해주세요.")
    );
  }
};

export const openAPISocialLoginCheck = async (oauthAccessToken, loginType) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/login/social`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oauthAccessToken,
        loginType,
      }),
    }
  );

  if (!res.ok) {
    const message = await getErrorMessage(
      res,
      "소셜 로그인에 실패했습니다."
    );
    throw new Error(message);
  }

  const json = await res.json();
  applyLoginCookies(json?.data);
  return json;
};

export const openAPINaverLogin = async (authorizationCode, state) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/login/naver`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grantType: "authorization_code",
        clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
        authorizationCode,
        state,
      }),
    }
  );

  if (!res.ok) {
    const message = await getErrorMessage(
      res,
      "네이버 로그인에 실패했습니다."
    );
    throw new Error(message);
  }

  const json = await res.json();
  applyLoginCookies(json?.data);
  return json;
};

export const openAPIGoogleLogin = async (authorizationCode, redirectUri) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/login/google`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorizationCode,
        redirectUri,
      }),
    }
  );

  if (!res.ok) {
    const message = await getErrorMessage(
      res,
      "Google 로그인에 실패했습니다."
    );
    throw new Error(message);
  }

  const json = await res.json();
  applyLoginCookies(json?.data);
  return json;
};

export const monthlyIBGetList = async (keyWord, page) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/monthly-ib/list?page=${page}&keyWord=${keyWord}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const questionGetList = async (
  questionStatus,
  keyWord,
  page,
  size = 10
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/question?page=${page}&size=${size}&keyWord=${keyWord}&questionStatus=${questionStatus}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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

export const questionGetItem = async (questionId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/question/${questionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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

export const boardGetList = async (page, keyWord) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/board?page=${page}&keyWord=${keyWord}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      console.log("success");
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const boardGetItem = async (boardId, replyPage) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/board/${boardId}?replyPage=${replyPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      console.log("success");
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const newsGetList = async (page, keyWord) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/news?page=${page}&keyWord=${keyWord}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      console.log("success");
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const courseGetCategory = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/video-category`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      console.log("success");
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const courseGetList = async (
  page,
  keyWord,
  status,
  firstCategoryId,
  secondCategoryId,
  thirdCategoryId
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/video?page=${page}&keyWord=${keyWord}&firstCategoryId=${firstCategoryId}&secondCategoryId=${secondCategoryId}&thirdCategoryId=${thirdCategoryId}&status=${status}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      console.log("success");
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const courseGetItem = async (videoLessonsId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/video/${videoLessonsId}?replyPage=0`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      console.log("success");
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const storageGetMain = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/storage`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      console.log("success");
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const storageGetList = async (parentsFolderId, keyWord) => {
  try {
    const url =
      parentsFolderId === ""
        ? `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/storage/detail?keyWord=${keyWord}`
        : `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/storage/detail?parentsFolderId=${parentsFolderId}&keyWord=${keyWord}`;
    console.log(url)
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      console.log("success");
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const subscribeGetList = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/subscribe`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
