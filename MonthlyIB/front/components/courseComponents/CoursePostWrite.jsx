"use client";
import styles from "./CourseComponents.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import CoursePostCurriculum from "./CoursePostCurriculum";
import CoursePostCategory from "./CoursePostCategory";
import dynamic from "next/dynamic";
import { coursePostThumnail, courseReviseItem } from "@/apis/courseAPI";
import { useCourseStore } from "@/store/course";
import { getCookie } from "@/apis/cookies";

// DynamicEditor: 서버사이드 렌더링을 비활성화한 에디터 컴포넌트
const DynamicEditor = dynamic(
  () => import("@/components/boardComponents/EditorComponents"),
  {
    ssr: false,
  }
);

// 카테고리 그룹 정보 상수
const GROUPS = { all: -1, Group1: 1, Group2: 2, Group3: 3, Group4: 4, Group5: 5, Group6: 6 };

// 과목 목록 상수
const SUBJECTS = {
  all: -1, "English Literature": 7, "English Language ": 8, Korean: 9, "English B": 10,
  "Mandarin B": 11, "Spanish B": 12, Economics: 13, "Business & Management": 14,
  Psychology: 15, Geography: 16, History: 17, Physics: 18, Chemistry: 19, Biology: 20,
  "Design Technology": 21, "Math AA": 22, "Math AI": 23, "Visual Arts": 24
};

// 레벨 정보 상수
const LEVELS = { all: 27, SL: 25, HL: 26 };

// 강의 작성 컴포넌트
const CoursePostWrite = () => {
  const router = useRouter();
  const imageInput = useRef();
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // type 파라미터 (수정 또는 새로 등록)
  const videoLessonsId = searchParams.get("videoLessonsId"); // 수정 시 기존 강의 ID
  const { courseDetail, postCourseItem, getCourseDetail } = useCourseStore();
  const accessToken = getCookie("accessToken"); // 사용자 액세스 토큰

  // 상태 관리 변수들
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

  const [subChapters, setSubChapters] = useState({
    0: [
      {
        chapterStatus: "SUB_CHAPTER",
        chapterTitle: "",
        chapterIndex: 0,
        videoFileUrl: "",
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

  // 파일명 변경 함수: 파일명에 타임스탬프 추가
  const changeFileName = (file) => {
    const fileExtention = file.name.split(".")[1];
    const oldFileName = file.name.split(".")[0];
    const date = new Date();
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);
    var timeString = hours + ":" + minutes + ":" + seconds;
    const newFile = new File(
      [file],
      `${oldFileName}_${timeString}.${fileExtention}`,
      {
        type: file.type,
      }
    );
    return newFile;
  };

  // 강의 정보를 로드하는 함수
  const loadingInfo = async (videoLessonsId) => {
    await getCourseDetail(videoLessonsId);
  };

  // 강의 ID가 있을 경우 강의 정보를 로드
  useEffect(() => {
    if (videoLessonsId) {
      loadingInfo(videoLessonsId);
    }
  }, []);
  // 수정 모드일 때 기존 데이터를 불러오는 함수
  useEffect(() => {
    if (videoLessonsId) {
      if (!courseDetail?.title) {
        alert("잘못된 접근입니다.");
        router.push("/course/");
      }
      getCourseDetail(videoLessonsId);
      setTitle(courseDetail?.title);
      setContent(courseDetail?.content);
      setLecturer(courseDetail?.instructor);
      setChapters(courseDetail?.chapters);
      const temp = [];
      courseDetail?.chapters?.map((v) => temp.push(v.subChapters));
      setSubChapters(temp);
      setFirstCategoryId(courseDetail?.firstCategory?.videoCategoryId);
      setSecondCategoryId(courseDetail?.secondCategory?.videoCategoryId);
      setThirdCategoryId(courseDetail?.thirdCategory?.videoCategoryId);
      setGroup(courseDetail?.firstCategory?.categoryName);
      setSubject(courseDetail?.secondCategory?.categoryName);
      setLevel(courseDetail?.thirdCategory?.categoryName);
      setDuration(courseDetail?.duration);
      setVideoLessonsStatus(courseDetail?.videoLessonsStatus);
    }
  }, []);

  // 그룹 변경 시 호출되는 핸들러 함수
  const handleGroupChange = (e) => {
    setGroup(e.target.value);
    setFirstCategoryId(GROUPS[e.target.value]);
  };

  // 레벨 변경 시 호출되는 핸들러 함수
  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    setThirdCategoryId(LEVELS[e.target.value]);
  };

  // 과목 변경 시 호출되는 핸들러 함수
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    setSecondCategoryId(SUBJECTS[e.target.value]);
  };

  // 새로운 챕터 추가
  const addNumCurriChapter = () => {
    let temp = [...chapters];
    const subTemp = { ...subChapters };
    let chptIndex = Number(temp.length);
    subTemp[chptIndex] = [
      {
        chapterStatus: "SUB_CHAPTER",
        chapterTitle: "",
        chapterIndex: 0,
        videoFileUrl: "",
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

  // 마지막 챕터 제거
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

  // 서브 챕터 추가
  const addNumCurriSubChapter = (chapterIndex) => {
    const subTemp = { ...subChapters };

    subTemp[chapterIndex].push({
      chapterStatus: "SUB_CHAPTER",
      chapterTitle: "",
      chapterIndex: subTemp[chapterIndex].length,
      videoFileUrl: "",
    });

    setSubChapters(subTemp);
  };

  // 특정 메인 챕터의 특정 서브 챕터를 삭제하는 함수
  const removeNumCurriSubChapter = (index, index_sub) => {
    const subTemp = { ...subChapters };

    if (subTemp[index] && subTemp[index][index_sub] !== undefined) {
      subTemp[index] = subTemp[index].filter((_, idx) => idx !== index_sub);

      setSubChapters(subTemp);

      // chapters 상태도 업데이트하여 동기화
      const updatedChapters = [...chapters];
      updatedChapters[index] = {
        ...updatedChapters[index],
        subChapters: subTemp[index],
      };
      setChapters(updatedChapters);
    }
  };

  useEffect(() => {
    console.log("subChapters", subChapters);
  }, [subChapters]);



  // 제목 변경 핸들러
  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  // 강사 이름 변경 핸들러
  const onChangeLecturer = useCallback((e) => {
    setLecturer(e.target.value);
  }, []);

  // 썸네일 업로드 핸들러
  const onClickImageUpload = (e) => {
    imageInput.current = changeFileName(e.target.files[0]);
  };

  // 폼 제출 핸들러 (새 강의 생성 또는 기존 강의 수정)
  const onSubmit = async (e) => {
    e.preventDefault();
    const chapterInfo =
      chapters.length == 1
        ? chapters.length.toString() + " Chapter"
        : chapters.length.toString() + " Chapters";

    // 수정 모드일 때
    console.log("type", type);
    console.log(parseInt(videoLessonsId),
      title,
      content,
      lecturer,
      chapterInfo,
      duration,
      chapters,
      firstCategoryId,
      secondCategoryId,
      thirdCategoryId,
      videoLessonsStatus);
    if (type === "edit") {
      await courseReviseItem(
        parseInt(videoLessonsId),
        title,
        content,
        lecturer,
        chapterInfo,
        duration,
        chapters,
        firstCategoryId,
        secondCategoryId,
        thirdCategoryId,
        videoLessonsStatus,
        { accessToken }
      );
      if (imageInput.current)
        coursePostThumnail(videoLessonsId, imageInput.current, { accessToken });
    } else {
      // 새 강의 등록 모드일 때
      const res = await postCourseItem(
        title,
        content,
        lecturer,
        chapterInfo,
        duration,
        chapters,
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
