import { Form } from "antd";
import styles from "./CourseComponents.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Link from "next/link";

import { coursePostActions } from "../../reducers/coursePost";
import CoursePostCurriculum from "../../page_components/course/CoursePostCurriculum";
import CoursePostCategory from "../../page_components/course/CoursePostCategory";
import dynamic from "next/dynamic";

const DynamicEditor = dynamic(() => import("../board/EditorComponents"), {
  ssr: false,
});

const CoursePostWrite = () => {
  const [numCurriculumChapter, setNumCurriculumChapter] = useState(["chpt1"]);
  const [numCurriculumSubChapter, setNumCurriculumSubChapter] = useState({
    chpt1: [1],
  });
  const [curriculumChapter, setCurriculumChapter] = useState([""]);
  const [subCurriculumChapter, setSubCurriculumChapter] = useState([[""]]);
  const [curriculumWrap, setCurriculumWrap] = useState([]);

  const router = useRouter();
  const dispatch = useDispatch();
  const imageInput = useRef();

  const [group, setGroup] = useState("all");
  const [level, setLevel] = useState("all");
  const [subject, setSubject] = useState("all");
  const [edit, setEdit] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [embeddedVideoLink, setEmbeddedVideoLink] = useState("http://");

  const handleGroupChange = (e) => {
    setGroup(e.target.value);
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const addNumCurriChapter = () => {
    let temp = [...numCurriculumChapter];
    let chptName = Number(temp[temp.length - 1].split("chpt")[1]);
    temp.push("chpt" + String(chptName + 1));
    setNumCurriculumChapter(temp);

    let tempCC = [...curriculumChapter];
    tempCC.push("");

    let tempSCC = [...subCurriculumChapter];
    tempSCC.push([""]);

    setCurriculumChapter(tempCC);
    setSubCurriculumChapter(tempSCC);
  };

  const removeNumCurriChapter = () => {
    let tempNumCurriculumChapter = [...numCurriculumChapter];
    let tempCC = [...curriculumChapter];
    if (tempNumCurriculumChapter.length > 1) {
      tempNumCurriculumChapter.pop();
      tempCC.pop();
      setNumCurriculumChapter(tempNumCurriculumChapter);
      setCurriculumChapter(tempCC);
    }
  };

  const addNumCurriSubChapter = (v, j) => {
    const temp = [...numCurriculumSubChapter[v]];
    temp.push(1);
    const tempObj = { ...numCurriculumSubChapter };
    tempObj[v] = temp;

    const subTemp = [...subCurriculumChapter];
    subTemp[j].push("");
    setNumCurriculumSubChapter(tempObj);
    setSubCurriculumChapter(subTemp);
  };

  const removeNumCurriSubChapter = (v, i, j) => {
    const temp = [...numCurriculumSubChapter[v]];
    const tempSCC = [...subCurriculumChapter];
    if (temp.length > 1) {
      temp.splice(j, 1);
      const tempObj = { ...numCurriculumSubChapter };
      tempObj[v] = temp;
      tempSCC[i].splice(j, 1);
      setNumCurriculumSubChapter(tempObj);
      setSubCurriculumChapter(tempSCC);
    }
  };

  useEffect(() => {
    const i = numCurriculumChapter[numCurriculumChapter.length - 1];
    const tempObj = { ...numCurriculumSubChapter };
    tempObj[i] = [1];
    setNumCurriculumSubChapter(tempObj);
  }, [numCurriculumChapter.length]);

  useEffect(() => {
    let temp = [];
    for (let i = 0; i < curriculumChapter.length; i++) {
      temp.push({
        chapter: curriculumChapter[i],
        chapter_content: subCurriculumChapter[i],
      });
    }

    setCurriculumWrap(temp);
  }, [curriculumChapter, subCurriculumChapter]);

  useEffect(() => {
    // 수정할 때
    if (router.query.edit) {
      setEdit(true);
      setTitle(router.query.prevTitle);
      setContent(router.query.prevContent);
      setLecturer(router.query.prevLecturer);
      // setGroup();
      // setLevel();
      // setSubject();
      const temp = JSON.parse(router.query.prevCurriculum);

      let tempCurriculumChapter = [];
      let tempSubCurriculumChapter = [];
      let tempNumCurriChapter = [];
      let tempNumSubChapter = [];
      let tempNumSubChapterObj = {};
      for (let i = 0; i < temp.length; i++) {
        tempCurriculumChapter.push(temp[i].chapter);
        tempSubCurriculumChapter.push(temp[i].chapter_content);
        temp[i].chapter_content.map((v) => tempNumSubChapter.push(1));
        tempNumCurriChapter.push("chpt" + String(i + 1));
        tempNumSubChapterObj["chpt" + String(i + 1)] = tempNumSubChapter;
        tempNumSubChapter = [];
      }

      setCurriculumChapter(tempCurriculumChapter);
      setSubCurriculumChapter(tempSubCurriculumChapter);
      setNumCurriculumChapter(tempNumCurriChapter);
      setNumCurriculumSubChapter(tempNumSubChapterObj);
    }
  }, [router.query]);

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const onChangeContent = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  const onChangeLecturer = useCallback((e) => {
    setLecturer(e.target.value);
  }, []);

  const onChangeVideoLink = useCallback((e) => {
    setEmbeddedVideoLink(e.target.value);
  }, []);

  const onClickImageUpload = useCallback(() => {}, []);

  const onSubmit = useCallback(() => {
    if (curriculumWrap.length > 0) {
      if (edit) {
        let num = router.query.pageId;
        dispatch(
          coursePostActions.editCoursePostRequest({
            num,
            title,
            content,
            // group,
            // subject,
            // level,
            image: 1,
            subtitle: group + " /" + subject + " /" + level,
            lecturer,
            curriculum: curriculumWrap,
          })
        );
      } else {
        dispatch(
          coursePostActions.addCoursePostRequest({
            title,
            content,
            // group,
            // subject,
            // level,
            image: 1,
            subtitle: group + " /" + subject + " /" + level,
            lecturer,
            curriculum: curriculumWrap,
          })
        );
      }
    }

    router.push("/course");
  }, [title, content, group, subject, level, lecturer, curriculumWrap]);

  return (
    <>
      <main className="width_content">
        <Form onFinish={onSubmit} noValidate>
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

            {/* <div className={styles.write_link_title}>
              <p>강의 영상 링크를 넣어주세요.</p>
            </div>
            <input
              type="url"
              value={embeddedVideoLink}
              className={styles.write_link}
              onChange={onChangeVideoLink}
            /> */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div className={styles.write_link_title}>
                  <p>강사이름</p>
                </div>
                <input
                  type="text"
                  className={styles.write_link_lecturer}
                  value={lecturer}
                  onChange={onChangeLecturer}
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
              numCurriculumChapter={numCurriculumChapter}
              numCurriculumSubChapter={numCurriculumSubChapter}
              addNumCurriSubChapter={addNumCurriSubChapter}
              removeNumCurriSubChapter={removeNumCurriSubChapter}
              curriculumChapter={curriculumChapter}
              setCurriculumChapter={setCurriculumChapter}
              subCurriculumChapter={subCurriculumChapter}
              setSubCurriculumChapter={setSubCurriculumChapter}
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
        </Form>
      </main>
    </>
  );
};

export default CoursePostWrite;
