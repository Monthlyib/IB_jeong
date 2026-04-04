"use client";

import styles from "./CourseComponents.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

import CoursePostCurriculum from "./CoursePostCurriculum";
import CoursePostCategory from "./CoursePostCategory";
import {
  coursePostThumnail,
  coursePostVideoFile,
  courseReviseItem,
} from "@/apis/courseAPI";
import { useCourseStore } from "@/store/course";
import { getCookie } from "@/apis/cookies";
import { isYouTubeVideoUrl } from "@/components/courseComponents/courseProgressUtils";

const DynamicEditor = dynamic(
  () => import("@/components/boardComponents/EditorComponents"),
  {
    ssr: false,
  }
);

const GROUPS = {
  all: -1,
  Group1: 1,
  Group2: 2,
  Group3: 3,
  Group4: 4,
  Group5: 5,
  Group6: 6,
};

const SUBJECTS = {
  all: -1,
  "English Literature": 7,
  "English Language ": 8,
  Korean: 9,
  "English B": 10,
  "Mandarin B": 11,
  "Spanish B": 12,
  Economics: 13,
  "Business & Management": 14,
  Psychology: 15,
  Geography: 16,
  History: 17,
  Physics: 18,
  Chemistry: 19,
  Biology: 20,
  "Design Technology": 21,
  "Math AA": 22,
  "Math AI": 23,
  "Visual Arts": 24,
};

const LEVELS = { all: 27, SL: 25, HL: 26 };

const createTimestampedFile = (file) => {
  if (!file) {
    return file;
  }

  const dotIndex = file.name.lastIndexOf(".");
  const baseName =
    dotIndex === -1 ? file.name : file.name.slice(0, dotIndex);
  const extension = dotIndex === -1 ? "" : file.name.slice(dotIndex);
  const safeBaseName = baseName.replace(/\s+/g, "-");

  return new File([file], `${safeBaseName}-${Date.now()}${extension}`, {
    type: file.type,
    lastModified: file.lastModified,
  });
};

const deriveUploadedFileName = (videoFileUrl = "") => {
  if (!videoFileUrl || isYouTubeVideoUrl(videoFileUrl)) {
    return "";
  }

  try {
    const parsed = new URL(videoFileUrl);
    const fileName = parsed.pathname.split("/").pop() || "";
    return decodeURIComponent(fileName);
  } catch (error) {
    return "";
  }
};

const createLessonDraft = (lesson = {}, lessonIndex = 0) => {
  const videoFileUrl = lesson?.videoFileUrl || "";
  const isYouTube = !videoFileUrl || isYouTubeVideoUrl(videoFileUrl);

  return {
    chapterId: lesson?.chapterId ?? null,
    chapterStatus: "SUB_CHAPTER",
    chapterTitle: lesson?.chapterTitle || "",
    chapterIndex: lesson?.chapterIndex ?? lessonIndex,
    videoFileUrl,
    videoInputMode: isYouTube ? "youtube" : "upload",
    uploadedFileName: deriveUploadedFileName(videoFileUrl),
    uploading: false,
  };
};

const createChapterDraft = (chapter = {}, chapterIndex = 0) => {
  const subChapters = Array.isArray(chapter?.subChapters)
    ? chapter.subChapters.map((lesson, lessonIndex) =>
        createLessonDraft(lesson, lessonIndex)
      )
    : [createLessonDraft({}, 0)];

  return {
    chapterId: chapter?.chapterId ?? null,
    chapterStatus: "MAIN_CHAPTER",
    chapterTitle: chapter?.chapterTitle || "",
    chapterIndex: chapter?.chapterIndex ?? chapterIndex,
    subChapters,
  };
};

const reindexSubChapters = (subChapters = []) =>
  subChapters.map((lesson, index) => ({
    ...lesson,
    chapterIndex: index,
  }));

const reindexChapters = (chapters = []) =>
  chapters.map((chapter, chapterIndex) => ({
    ...chapter,
    chapterIndex,
    subChapters: reindexSubChapters(chapter.subChapters || []),
  }));

const normalizeChapters = (chapters = []) => {
  if (!Array.isArray(chapters) || chapters.length === 0) {
    return [createChapterDraft({}, 0)];
  }

  return reindexChapters(
    chapters.map((chapter, chapterIndex) =>
      createChapterDraft(chapter, chapterIndex)
    )
  );
};

const serializeChaptersForSubmit = (chapters = []) =>
  reindexChapters(chapters).map((chapter) => ({
    chapterId: chapter.chapterId ?? undefined,
    chapterStatus: "MAIN_CHAPTER",
    chapterTitle: chapter.chapterTitle,
    chapterIndex: chapter.chapterIndex,
    subChapters: (chapter.subChapters || []).map((lesson) => ({
      chapterId: lesson.chapterId ?? undefined,
      chapterStatus: "SUB_CHAPTER",
      chapterTitle: lesson.chapterTitle,
      chapterIndex: lesson.chapterIndex,
      videoFileUrl: lesson.videoFileUrl,
    })),
  }));

const CoursePostWrite = () => {
  const router = useRouter();
  const imageInput = useRef();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const videoLessonsId = searchParams.get("videoLessonsId");
  const isEditMode = type === "edit";
  const { courseDetail, postCourseItem, getCourseDetail } = useCourseStore();
  const accessToken = getCookie("accessToken");

  const [group, setGroup] = useState("all");
  const [level, setLevel] = useState("all");
  const [subject, setSubject] = useState("all");

  const [firstCategoryId, setFirstCategoryId] = useState(-1);
  const [secondCategoryId, setSecondCategoryId] = useState(-1);
  const [thirdCategoryId, setThirdCategoryId] = useState(27);

  const [duration, setDuration] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [videoLessonsStatus, setVideoLessonsStatus] = useState("");
  const [chapters, setChapters] = useState(() => normalizeChapters());

  useEffect(() => {
    if (videoLessonsId) {
      getCourseDetail(videoLessonsId);
    }
  }, [getCourseDetail, videoLessonsId]);

  useEffect(() => {
    if (!isEditMode || !videoLessonsId) {
      return;
    }

    if (Number(courseDetail?.videoLessonsId) !== Number(videoLessonsId)) {
      return;
    }

    setTitle(courseDetail?.title || "");
    setContent(courseDetail?.content || "");
    setLecturer(courseDetail?.instructor || "");
    setChapters(normalizeChapters(courseDetail?.chapters));
    setFirstCategoryId(courseDetail?.firstCategory?.videoCategoryId ?? -1);
    setSecondCategoryId(courseDetail?.secondCategory?.videoCategoryId ?? -1);
    setThirdCategoryId(courseDetail?.thirdCategory?.videoCategoryId ?? 27);
    setGroup(courseDetail?.firstCategory?.categoryName || "all");
    setSubject(courseDetail?.secondCategory?.categoryName || "all");
    setLevel(courseDetail?.thirdCategory?.categoryName || "all");
    setDuration(courseDetail?.duration || "");
    setVideoLessonsStatus(courseDetail?.videoLessonsStatus || "");
  }, [courseDetail, isEditMode, videoLessonsId]);

  const handleGroupChange = (e) => {
    setGroup(e.target.value);
    setFirstCategoryId(GROUPS[e.target.value]);
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    setThirdCategoryId(LEVELS[e.target.value]);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    setSecondCategoryId(SUBJECTS[e.target.value]);
  };

  const updateChapters = useCallback((updater) => {
    setChapters((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return reindexChapters(next);
    });
  }, []);

  const addNumCurriChapter = () => {
    updateChapters((prev) => [...prev, createChapterDraft({}, prev.length)]);
  };

  const removeNumCurriChapter = () => {
    updateChapters((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.slice(0, -1);
    });
  };

  const addNumCurriSubChapter = (chapterIndex) => {
    updateChapters((prev) =>
      prev.map((chapter, index) => {
        if (index !== chapterIndex) {
          return chapter;
        }

        return {
          ...chapter,
          subChapters: [
            ...(chapter.subChapters || []),
            createLessonDraft({}, chapter.subChapters?.length || 0),
          ],
        };
      })
    );
  };

  const removeNumCurriSubChapter = (chapterIndex, subIndex) => {
    updateChapters((prev) =>
      prev.map((chapter, index) => {
        if (index !== chapterIndex) {
          return chapter;
        }

        return {
          ...chapter,
          subChapters: (chapter.subChapters || []).filter(
            (_, lessonIndex) => lessonIndex !== subIndex
          ),
        };
      })
    );
  };

  const handleCurriculumChange = useCallback(
    (chapterIndex, subIndex, patch) => {
      updateChapters((prev) =>
        prev.map((chapter, currentChapterIndex) => {
          if (currentChapterIndex !== chapterIndex) {
            return chapter;
          }

          if (typeof subIndex !== "number") {
            return { ...chapter, ...patch };
          }

          return {
            ...chapter,
            subChapters: (chapter.subChapters || []).map((lesson, lessonIndex) =>
              lessonIndex === subIndex ? { ...lesson, ...patch } : lesson
            ),
          };
        })
      );
    },
    [updateChapters]
  );

  const handleLessonVideoModeChange = useCallback(
    (chapterIndex, subIndex, nextMode) => {
      handleCurriculumChange(chapterIndex, subIndex, {
        videoInputMode: nextMode,
        videoFileUrl: "",
        uploadedFileName: "",
        uploading: false,
      });
    },
    [handleCurriculumChange]
  );

  const handleLessonVideoUpload = useCallback(
    async (chapterIndex, subIndex, file) => {
      if (!file) {
        return;
      }

      const renamedFile = createTimestampedFile(file);
      handleCurriculumChange(chapterIndex, subIndex, {
        uploading: true,
      });

      try {
        const response = await coursePostVideoFile(renamedFile, { accessToken });
        const uploadedUrl = response?.data?.fileUrl;
        if (!uploadedUrl) {
          throw new Error("Video upload failed");
        }

        handleCurriculumChange(chapterIndex, subIndex, {
          videoFileUrl: uploadedUrl,
          uploadedFileName:
            response?.data?.fileName || renamedFile.name || file.name,
          videoInputMode: "upload",
          uploading: false,
        });
      } catch (error) {
        console.error("Failed to upload course lesson video:", error);
        handleCurriculumChange(chapterIndex, subIndex, {
          uploading: false,
        });
        alert("동영상 업로드에 실패했습니다.");
      }
    },
    [accessToken, handleCurriculumChange]
  );

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const onChangeLecturer = useCallback((e) => {
    setLecturer(e.target.value);
  }, []);

  const onClickImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    imageInput.current = createTimestampedFile(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const serializedChapters = serializeChaptersForSubmit(chapters);
    const chapterInfo =
      serializedChapters.length === 1
        ? "1 Chapter"
        : `${serializedChapters.length} Chapters`;

    if (isEditMode) {
      await courseReviseItem(
        parseInt(videoLessonsId, 10),
        title,
        content,
        lecturer,
        chapterInfo,
        duration,
        serializedChapters,
        firstCategoryId,
        secondCategoryId,
        thirdCategoryId,
        videoLessonsStatus,
        { accessToken }
      );

      if (imageInput.current) {
        await coursePostThumnail(videoLessonsId, imageInput.current, {
          accessToken,
        });
      }
    } else {
      await postCourseItem(
        title,
        content,
        lecturer,
        chapterInfo,
        duration,
        serializedChapters,
        firstCategoryId,
        secondCategoryId,
        thirdCategoryId,
        imageInput.current,
        { accessToken }
      );
    }

    router.push("/course");
  };

  return (
    <main className="width_content">
      <form onSubmit={onSubmit}>
        <div className={styles.write_wrap}>
          <input
            type="text"
            value={title}
            onChange={onChangeTitle}
            className={styles.write_tit}
            placeholder="강의제목"
          />
          <DynamicEditor
            styleName={styles.write_content}
            content={content}
            setContent={setContent}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className={styles.write_link_title}>
                <p>강사 이름</p>
              </div>
              <input
                type="text"
                className={styles.write_link_lecturer}
                value={lecturer}
                onChange={onChangeLecturer}
              />
              <div className={styles.write_link_title}>
                <p>강의 유효기간</p>
              </div>
              <input
                type="text"
                className={styles.write_link_lecturer}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="구독기간 동안 무제한 제공"
              />
            </div>
            <CoursePostCategory
              group={group}
              subject={subject}
              level={level}
              handleGroupChange={handleGroupChange}
              handleSubjectChange={handleSubjectChange}
              handleLevelChange={handleLevelChange}
            />
          </div>
          <div className={styles.write_link_title}>
            <p>강의 커리큘럼</p>
          </div>
          <CoursePostCurriculum
            chapters={chapters}
            addNumCurriSubChapter={addNumCurriSubChapter}
            removeNumCurriSubChapter={removeNumCurriSubChapter}
            setChapters={updateChapters}
            handleCurriculumChange={handleCurriculumChange}
            handleLessonVideoModeChange={handleLessonVideoModeChange}
            handleLessonVideoUpload={handleLessonVideoUpload}
          />
          <div className={styles.write_block}>
            <label>썸네일 등록 ( jpg, png, gif 파일 )</label>
            <input
              type="file"
              accept="image/jpg,impge/png,image/jpeg,image/gif"
              className={styles.write_img}
              onChange={onClickImageUpload}
            />

            <label>커리큘럼 추가 / 제거</label>
            <div className={styles.curriculum_buttons}>
              <button type="button" onClick={addNumCurriChapter}>
                +
              </button>
              <button type="button" onClick={removeNumCurriChapter}>
                -
              </button>
            </div>
          </div>
          <div className={styles.write_btn_area}>
            <Link href="/course/" className={styles.cancel}>
              취소
            </Link>
            <button className={styles.submit} type="submit">
              {isEditMode ? "수정" : "등록"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default CoursePostWrite;
