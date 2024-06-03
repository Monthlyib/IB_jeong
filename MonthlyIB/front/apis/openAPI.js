const OPEN_API_URL = "open-api";

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
    if (!res.ok && res?.status === 400) {
      return res.json();
    }
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const openAPIVerifyEmail = async (email) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/verify-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.current }),
      }
    );
    if (res.ok) {
      console.log("yay");
    }
  } catch (error) {
    console.error(error);
  }
};

export const openAPIVerifyNum = async (email, verifyNum) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/verify-num`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.current,
          verifyNum: verifyNum.current,
        }),
      }
    );
    if (!res.ok && res?.status === 400) {
      return res.json();
    }
    return res.json();
  } catch (error) {
    console.error(error);
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
  consent_marketing,
  signIn
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}open-api/register`,
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
    if (res.ok) {
      signIn(username, password);
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

export const openAPIReissueToken = async (userId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/reissue-token/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      console.log("succes");
      return res.json();
    }
  } catch (error) {
    console.error(error);
  }
};

export const openAPIFindPwd = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/pwd-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (res.ok) {
      console.log("succes");
    }
  } catch (error) {
    console.error(error);
  }
};

export const openAPILogin = async (username, password) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );
    const json = await res.json();

    return json;
  } catch (error) {
    console.error(error);
  }
};

export const openAPISocialLoginCheck = async (oauthAccessToken, loginType) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/login/social`,
      {
        method: "POST",
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
      throw new Error(`Failed POST Status: ${res.status}`);
    }
    const json = await res.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const openAPINaverLogin = async (authorizationCode, state) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/login/naver`,
      {
        method: "POST",
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
    if (!res.ok && res?.status === 400) {
      const json = await res.json();
      return json;
    }
    const json = await res.json();
    return json;
  } catch (error) {
    console.error(error);
  }
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

export const questionGetList = async (questionStatus, keyWord, page) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/question?page=${page}&keyWord=${keyWord}&questionStatus=${questionStatus}`,
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/storage/detail?parentsFolderId=${parentsFolderId}&keyWord=${keyWord}`,
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
