const USER_API_URL = "api/user";

export const userDelete = async (userId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${USER_API_URL}/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: session?.accessToken,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed POST Status: ${res.status}`);
    }
    console.log(success);
    const json = await res.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const userGetInfo = async (userId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${USER_API_URL}/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: session?.accessToken,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed POST Status: ${res.status}`);
    }
    console.log("success");
    const json = await res.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const userGetAllList = async (session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${USER_API_URL}/list`,
      {
        method: "GET",
        headers: {
          Authorization: session?.accessToken,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed POST Status: ${res.status}`);
    }
    console.log(success);
    const json = await res.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const userReviseInfo = async (
  userId,
  session,
  password,
  name,
  dob,
  school,
  grade,
  address
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${USER_API_URL}/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({
          password,
          nickname: name.current,
          birth: dob.current,
          school: school.current,
          grade: grade.current,
          address: address.current,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed POST Status: ${res.status}`);
    }
    console.log("success");
    const json = await res.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const userRegisterWithSocialInfo = async (
  userId,
  accessToken,
  username,
  name,
  dob,
  school,
  grade,
  address,
  consent_marketing,
  signIn,
  authCode,
  social
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${USER_API_URL}/social/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify({
          username,
          nickname: name.current,
          birth: dob.current,
          school: school.current,
          grade: grade.current,
          address: address.current,
          termsOfUseCheck: true,
          privacyTermsCheck: true,
          marketingTermsCheck: consent_marketing,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed POST Status: ${res.status}`);
    }

    if (res.ok) {
      await signIn("social", { oauthAccessToken: authCode, loginType: social });
    }

    console.log("success");
  } catch (error) {
    console.error(error);
  }
};

export const userVerifyUser = async (credentials) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${USER_API_URL}/verify/${credentials?.username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials?.accessToken,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed POST Status: ${res.status}`);
    }

    console.log("success");
    return res.json();
  } catch (error) {
    console.error(error);
  }
};
