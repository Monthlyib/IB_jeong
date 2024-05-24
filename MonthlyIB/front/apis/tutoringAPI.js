const TUTORING_API_URL = "api/tutoring";

export const TutoringDeleteItem = async (tutoringId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${TUTORING_API_URL}/${tutoringId}`,
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

export const TutoringGetUserData = async (userId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${TUTORING_API_URL}/user/${userId}`,
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
  } catch (error) {
    console.error(error);
  }
};

export const TutoringGetTime = async (date, hour, minute, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${TUTORING_API_URL}/time?date=${date}&hour=${hour}&minute=${minute}`,
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
  } catch (error) {
    console.error(error);
  }
};

export const TutoringGetDate = async (date, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${TUTORING_API_URL}/date?date=${date}`,
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
  } catch (error) {
    console.error(error);
  }
};

export const TutoringGetDateSimple = async (date, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${TUTORING_API_URL}/date-simple?date=${date}`,
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
  } catch (error) {
    console.error(error);
  }
};

export const TutoringReviseItem = async (
  tutoringId,
  detail,
  tutoringStatus,
  session
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${TUTORING_API_URL}/${tutoringId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({
          detail,
          tutoringStatus,
        }),
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

export const TutoringPostItem = async (
  requestUserId,
  date,
  hour,
  minute,
  detail,
  session
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${TUTORING_API_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({
          requestUserId,
          date,
          hour,
          minute,
          detail,
        }),
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};
