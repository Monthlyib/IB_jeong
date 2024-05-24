const MONTHLYIB_API_URL = "api/monthly-ib";

import axios from "axios";

export const monthlyIBPostThumbnail = async (
  monthlyIbId,
  image,
  accessToken
) => {
  try {
    const formData = new FormData(); // formData 생성
    formData.append("image", image);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: accessToken,
      },
    };
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}${MONTHLYIB_API_URL}/monthly-ib-thumbnail/${monthlyIbId}`,
      formData,
      config
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

export const monthlyIBPostPDFFile = async (monthlyIbId, file, accessToken) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: accessToken,
      },
    };
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}${MONTHLYIB_API_URL}/monthly-ib-pdf/${monthlyIbId}`,
      formData,
      config
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

export const monthlyIBPostItem = async (title, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${MONTHLYIB_API_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify({
          title,
        }),
      }
    );
    if (res.ok) {
      console.log("success");
      return res.json();
    }
    if (!res.ok) {
      console.log(res);
      return res;
    }
  } catch (error) {
    console.error(error);
  }
};

export const monthlyIBReviseItem = async (monthlyIbId, title, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${MONTHLYIB_API_URL}/${monthlyIbId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({ title }),
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

export const monthlyIBGetItem = async (monthlyIbId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${MONTHLYIB_API_URL}/${monthlyIbId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
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

export const monthlyIBDeleteItem = async (monthlyIbId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${MONTHLYIB_API_URL}/${monthlyIbId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};
