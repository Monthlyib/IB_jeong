const userDelete = async (userId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/user/${userId}`,
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

const userGetInfo = async (userId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/user/${userId}`,
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

const userGetAllList = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/user/list`, {
      method: "GET",
      headers: {
        Authorization: session?.accessToken,
      },
    });
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

const userReviseInfo = async (userId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/user/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: {
          password,
          nickname,
          birth,
          school,
          grade,
          address,
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

export default userDelete;
