"use client";
import styles from "./CourseComponents.module.css";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import CoursePostCurriculum from "./CoursePostCurriculum";
import CoursePostCategory from "./CoursePostCategory";
import dynamic from "next/dynamic";
import { coursePostItem } from "@/apis/courseAPI";
import { useSession } from "next-auth/react";

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

const LEVELS = {
  all: -1,
  SL: 25,
  HL: 26,
};
// https://youtu.be/HYcesdzTJ18

const CoursePostWrite = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const imageInput = useRef();

  const [group, setGroup] = useState("all");
  const [level, setLevel] = useState("all");
  const [subject, setSubject] = useState("all");
  const [edit, setEdit] = useState(false);

  const [firstCategoryId, setFirstCategoryId] = useState(-1);
  const [secondCategoryId, setSecondCategoryId] = useState(-1);
  const [thirdCategoryId, setThirdCategoryId] = useState(-1);

  const [duration, setDuration] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lecturer, setLecturer] = useState("");

  const [subChapters, setSubChapters] = useState({
    0: [
      {
        chapterStatus: "MAIN_CHAPTER",
        chapterTitle: "",
        chapterIndex: 0,
        videoLessonsUrl: "",
      },
    ],
  });
  const [chapters, setChapters] = useState([
    {
      chapterStatus: "MAIN_CHAPTER",
      chapterTitle: "",
      chapterIndex: 0,
      subChapters: subChapters[0],
    },
  ]);

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

  const addNumCurriChapter = () => {
    let temp = [...chapters];
    const subTemp = { ...subChapters };
    let chptIndex = Number(temp.length);
    subTemp[chptIndex] = [
      {
        chapterStatus: "MAIN_CHAPTER",
        chapterTitle: "",
        chapterIndex: 0,
        videoLessonsUrl: "",
      },
    ];
    temp.push({
      chapterStatus: "MAIN_CHAPTER",
      chapterTitle: "",
      chapterIndex: chptIndex,
      subChapters: subTemp[chptIndex],
    });
    setSubChapters(subTemp);
    setChapters(temp);
  };

  const removeNumCurriChapter = () => {
    let tempNumCurriculumChapter = [...chapters];
    const subTemp = { ...subChapters };
    if (tempNumCurriculumChapter.length > 1) {
      delete subTemp[tempNumCurriculumChapter.length - 1];
      tempNumCurriculumChapter.pop();
      setChapters(tempNumCurriculumChapter);
      setSubChapters(subTemp);
    }
  };

  const addNumCurriSubChapter = () => {
    const subTemp = { ...subChapters };
    let chptIndex = Number(chapters.length - 1);

    subTemp[chptIndex].push({
      chapterStatus: "MAIN_CHAPTER",
      chapterTitle: "",
      chapterIndex: subTemp[chptIndex].length,
      videoLessonsUrl: "",
    });

    setSubChapters(subTemp);
  };

  const removeNumCurriSubChapter = (index) => {
    const subTemp = { ...subChapters };
    if (subTemp[chapters.length - 1].length > 1) {
      subTemp[chapters.length - 1].splice(index, 1);
      setSubChapters(subTemp);
    }
  };

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const onChangeLecturer = useCallback((e) => {
    setLecturer(e.target.value);
  }, []);

  const onClickImageUpload = useCallback(() => {}, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const chapterInfo =
      chapters.length == 1
        ? chapters.length.toString() + " Chapter"
        : chapters.length.toString() + " Chapters";
    if (duration == "") setDuration("구독기간 동안 무제한 제공");
    coursePostItem(
      title,
      content,
      lecturer,
      chapterInfo,
      duration,
      chapters,
      firstCategoryId,
      secondCategoryId,
      thirdCategoryId,
      session
    );
    router.push("/course");
  };

  return (
    <>
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
                handleGroupChange={handleGroupChange}
                handleSubjectChange={handleSubjectChange}
                handleLevelChange={handleLevelChange}
              />
            </div>
            <div className={styles.write_link_title}>
              <p>강의 커리큘럼</p>
            </div>
            <CoursePostCurriculum
              numCurriculumChapter={chapters}
              numCurriculumSubChapter={subChapters}
              addNumCurriSubChapter={addNumCurriSubChapter}
              removeNumCurriSubChapter={removeNumCurriSubChapter}
              setSubChapters={setSubChapters}
              setChapters={setChapters}
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
                <button type="Button" onClick={addNumCurriChapter}>
                  +
                </button>
                <button type="Button" onClick={removeNumCurriChapter}>
                  -
                </button>
              </div>
            </div>
            <div className={styles.write_btn_area}>
              <Link href="/course/" className={styles.cancel}>
                취소
              </Link>
              <button className={styles.submit} type="submit">
                등록
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default CoursePostWrite;