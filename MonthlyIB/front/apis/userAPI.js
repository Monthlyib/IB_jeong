import { tokenRequireApi } from "./refreshToken";

const USER_API_URL = "api/user";

export const userDelete = async (userId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(`${USER_API_URL}/${userId}`, config);
  } catch (error) {
    console.error(error);
  }
};

export const userGetInfo = async (userId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.get(`${USER_API_URL}/${userId}`, config);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const userGetAllList = async (session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.get(`${USER_API_URL}/list`, config);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const userReviseInfo = async (
  userId,
  password,
  email,
  nickName,
  birth,
  school,
  grade,
  address,
  country,
  userStatus,
  authority,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    let data = {};
    if (password === "") {
      data = {
        email,
        nickName,
        birth,
        school,
        grade,
        address,
        country,
        userStatus,
        authority,
      };
    } else {
      data = {
        password,
        email,
        nickName,
        birth,
        school,
        grade,
        address,
        country,
        userStatus,
        authority,
      };
    }

    await tokenRequireApi.patch(`${USER_API_URL}/${userId}`, data, config);
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
  consent_marketing
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    };
    const data = {
      username,
      nickName: name.current,
      birth: dob.current,
      school: school.current,
      grade: grade.current,
      address: address.current,
      termsOfUseCheck: true,
      privacyTermsCheck: true,
      marketingTermsCheck: consent_marketing,
    };
    const res = await tokenRequireApi.patch(
      `${USER_API_URL}/social/${userId}`,
      data,
      config
    );

    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const userVerifyUser = async (username, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.get(
      `${USER_API_URL}/verify/${username}`,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
