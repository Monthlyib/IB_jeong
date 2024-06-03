import axios from "axios";

const COURSE_API_URL = "api/video";
const COURSE_REPLY_API_URL = "api/video-reply";
const COURSE_CATEGORY_API_URL = "api/video-category";
const COURSE_IMAGE_API_URL = "api/video-image";

export const courseDeleteItem = async (videoLessonsId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${COURSE_API_URL}/${videoLessonsId}`,
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

export const courseDeleteRelpyItem = async (videoLessonsReplyId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${COURSE_REPLY_API_URL}/${videoLessonsReplyId}`,
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

export const courseDeleteCategoryItem = async (videoCategoryId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${COURSE_CATEGORY_API_URL}/${videoCategoryId}`,
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
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const coursePostItem = async (
  title,
  content,
  instructor,
  chapterInfo,
  duration,
  chapters,
  firstCategoryId,
  secondCategoryId,
  thirdCategoryId,
  session
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${COURSE_API_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({
          title,
          content,
          instructor,
          chapterInfo,
          duration,
          chapters,
          firstCategoryId,
          secondCategoryId,
          thirdCategoryId,
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

export const coursePostRelpyItem = async (
  videoLessonsId,
  authorId,
  content,
  star,
  session
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${COURSE_REPLY_API_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({
          videoLessonsId,
          authorId,
          content,
          star,
        }),
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

export const courseVoteRelpyItem = async (videoLessonsReplyId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${COURSE_REPLY_API_URL}/vote/${videoLessonsReplyId}`,
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

export const coursePostThumnail = async (videoLessonsId, image, session) => {
  try {
    const formData = new FormData(); // formData 생성
    formData.append("image", image);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: session?.accessToken,
      },
    };
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}${COURSE_IMAGE_API_URL}/${videoLessonsId}`,
      formData,
      config
    );
    if (res.ok) {
      console.log("success");
      return res.json();
    }
    if (!res.ok) {
      console.log(res);
      return res.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const coursePostCateogry = async (
  videoCategoryStatus,
  categoryName,
  parentsId,
  session
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${COURSE_CATEGORY_API_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({
          videoCategoryStatus,
          categoryName,
          parentsId,
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

export const courseReviseItem = async (
  videoLessonsId,
  title,
  content,
  instructor,
  chapterInfo,
  duration,
  chapters,
  firstCategoryId,
  secondCategoryId,
  thirdCategoryId,
  videoLessonsStatus,
  session
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${COURSE_API_URL}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({
          videoLessonsId,
          title,
          content,
          instructor,
          chapterInfo,
          duration,
          chapters,
          firstCategoryId,
          secondCategoryId,
          thirdCategoryId,
          videoLessonsStatus,
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

export const courseReviseRelpyItem = async (
  videoLessonsId,
  videoLessonsReplyId,
  content,
  star,
  session
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${COURSE_REPLY_API_URL}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({
          videoLessonsReplyId,
          videoLessonsId,
          content,
          star,
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

export const courseUserList = async (userId, page, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${COURSE_API_URL}/enrolment/${userId}?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
      }
    );

    if (!res.ok) {
      console.log(res);
      return res;
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const courseReviseCateogry = async (
  videoCategoryId,
  videoCategoryStatus,
  categoryName,
  parentsId,
  session
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${COURSE_CATEGORY_API_URL}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({
          videoCategoryId,
          videoCategoryStatus,
          categoryName,
          parentsId,
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

export const coursePostUser = async (videoLessonsId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${COURSE_API_URL}/enrolment/${videoLessonsId}`,
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
