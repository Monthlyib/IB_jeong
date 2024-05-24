const QUESTION_API_URL = "api/question";

export const questionDelete = async (questionId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${QUESTION_API_URL}/${questionId}`,
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
  } catch (error) {
    console.error(error);
  }
};

export const questionDeleteAnswer = async (answerId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${QUESTION_API_URL}/answer/${answerId}`,
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
  } catch (error) {
    console.error(error);
  }
};

export const questionGetUserList = async (
  questionStatus,
  page,
  keyWord,
  session
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${QUESTION_API_URL}?keyWord=${keyWord}&questionStatus=${questionStatus}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
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

export const questionReviseItem = async (
  questionId,
  title,
  content,
  subject,
  questionStatus,
  session
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${QUESTION_API_URL}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({
          questionId,
          title,
          content,
          subject,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed POST Status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};

export const questionReviseAnswerItem = async (answerId, content, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${QUESTION_API_URL}/answer`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({
          answerId,
          content,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed POST Status: ${res.status}`);
    }
  } catch (error) {
    console.error(error);
  }
};

export const questionPostItem = async (
  title,
  content,
  subject,
  authorId,
  session
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${QUESTION_API_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({
          title,
          content,
          subject,
          authorId,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed POST Status: ${res.status}`);
    }
    const json = res.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const questionPostAnswerItem = async (questionId, content, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${QUESTION_API_URL}/answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({
          questionId,
          content,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed POST Status: ${res.status}`);
    }
  } catch (error) {
    console.error(error);
  }
};
