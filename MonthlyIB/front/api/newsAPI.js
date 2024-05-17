const NEWS_API_URL = "api/news";

export const newsDeleteItem = async (boardId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${NEWS_API_URL}/${boardId}`,
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

export const newsGetList = async (keyWord, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${NEWS_API_URL}?keyWord=${keyWord}`,
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

export const newsGetItem = async (newsId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${NEWS_API_URL}/${newsId}`,
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

export const newsReviseItem = async (newsId, session, title, content) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${NEWS_API_URL}/${newsId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({ title, content }),
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

export const newsPost = async (session, title, content) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${NEWS_API_URL}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({ title, content }),
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

export const newsFilePost = async (newsId, session, file) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${NEWS_API_URL}/news-file/${newsId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({ file }),
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};
