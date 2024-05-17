const BOARD_API_URL = "api/board";

export const boardDeleteItem = async (boardId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${BOARD_API_URL}/${boardId}`,
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

export const boardReplyDeleteItem = async (boardReplyId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${BOARD_API_URL}/reply/${boardReplyId}`,
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

// need to test

export const boardGetList = async (session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${BOARD_API_URL}?keyWord=""`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken, // 없앨것
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

export const boardGetItem = async (boardId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${BOARD_API_URL}/${boardId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken, // 없앨것
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

export const boardReviseItem = async (boardId, content, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${BOARD_API_URL}/${boardId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: { content },
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

export const boardReplyReviseItem = async (boardReplyId, content, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${BOARD_API_URL}/reply/${boardReplyId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({ content }),
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

export const boardPost = async (title, content, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${BOARD_API_URL}/`,
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

export const boardReplyPost = async (boardId, content, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${BOARD_API_URL}/reply/${boardId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({ content }),
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

export const boardReplyVote = async (boardReplyId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${BOARD_API_URL}/reply-vote/${boardReplyId}`,
      {
        method: "POST",
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

export const boardFilePost = async (boardId, file, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${BOARD_API_URL}/board-file/${boardId}`,
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
