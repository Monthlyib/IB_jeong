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
          nickname: name.current,
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
      await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
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

export const openAPILogin = async (credentials) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/login`,
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
    const json = await res.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const openAPISocialLoginCheck = async (credentials) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}/login/social`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oauthAccessToken: credentials?.oauthAccessToken,
          loginType: credentials?.loginType,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed POST Status: ${res.status}`);
    }
    const json = await res.json();
    console.log(json.data);
    return json;
  } catch (error) {
    console.log("hehehehe");
    console.error(error);
  }
};

export const openAPINaverLogin = async (credentials) => {
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
          authorizationCode: credentials?.authorizationCode,
          state: credentials?.state,
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
