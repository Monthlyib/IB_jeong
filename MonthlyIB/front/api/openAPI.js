const openAPIReissueToken = async (userId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/open-api/reissue-token/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      console.log("succes");
    }
  } catch (error) {
    console.error(error);
  }
};

const openAPIFindPwd = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/open-api/pwd-email`,
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
