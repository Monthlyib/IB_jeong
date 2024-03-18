import { useSelector } from "react-redux";
import styles from "./CourseComponents.module.css";
import CourseItems from "./CourseItems";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { coursePostActions } from "../../reducers/coursePost";

export const courseCategoryList = {
  all: [],
  Group1: ["English Literature", "English Language ", "Korean"],
  Group2: ["English B", "Mandarin B", "Spanish B"],
  Group3: [
    "Economics",
    "Business & Management",
    "Psychology",
    "Geography",
    "History",
  ],
  Group4: ["Physics", "Chemistry", "Biology", "Design Technology"],
  Group5: ["Math AA", "Math AI"],
  Group6: ["Visual Arts"],
};

const CourseComponents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searching, setSeraching] = useState(false);

  const { User, logInDone } = useSelector((state) => state.user);

  const { coursePosts, getCoursePostDone } = useSelector(
    (state) => state.coursePost
  );
  const [group, setGroup] = useState("all");
  const [subject, setSubject] = useState("all");
  const [level, setLevel] = useState("all");
  const dispatch = useDispatch();

  const fillteredCoursePosts = coursePosts.filter((post) => {
    const groupFiltered = group === "all" ? true : post.group === group;
    const subjectFiltered = subject === "all" ? true : post.subject === subject;
    const levelFiltered = level === "all" ? true : post.level === level;
    return groupFiltered && subjectFiltered && levelFiltered;
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const onChange = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);
  const onClickSearchButton = useCallback(() => {
    setSearchedPosts([
      ...coursePosts.filter((v) => v.title.includes(searchKeyword)),
    ]);
    setCurrentPage(1);
    setSeraching(true);
  }, [searchKeyword]);

  useEffect(() => {
    if (getCoursePostDone === false)
      dispatch(coursePostActions.getCoursePostRequest());
  }, [getCoursePostDone]);

  useEffect(() => {
    setSubject("all");
    setLevel("all");
  }, [group]);

  // 뒤로가기 초기화안되게하기

  const handleGroupChange = (e) => {
    setGroup(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
  };

  return (
    <>
      <main className="width_content">
        <div className="header_flex">
          <div className="header_tit_wrap">
            <h2>영상강의</h2>
          </div>
        </div>

        <div className={styles.course_box_wrap}>
          <div className={styles.filter_header}>
            <div className={styles.ft_select}>
              <select onChange={handleGroupChange}>
                <option value="all">All</option>
                <option value="Group1">Group 1</option>
                <option value="Group2">Group 2</option>
                <option value="Group3">Group 3</option>
                <option value="Group4">Group 4</option>
                <option value="Group5">Group 5</option>
                <option value="Group6">Group 6</option>
              </select>

              <select
                onChange={handleSubjectChange}
                key={subject}
                defaultValue={subject}
              >
                <option value="all">All</option>
                {courseCategoryList[group].map((v, i) => (
                  <option key={i} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              <select onChange={handleLevelChange}>
                <option value="all">All</option>
                <option value="SL">SL</option>
                <option value="HL">HL</option>
              </select>
            </div>

            <div className={"ft_search"}>
              <input
                type="text"
                placeholder="강의명 검색"
                value={searchKeyword}
                onChange={onChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onClickSearchButton();
                  }
                }}
              />
              <button onClick={onClickSearchButton}>검색</button>
            </div>
          </div>
          {User.role === 100 && (
            <div className={styles.right_btn}>
              <Link href="/course/write" className={styles.btn_write}>
                <FontAwesomeIcon icon={faPenAlt} />
                <span>글쓰기</span>
              </Link>
            </div>
          )}
        </div>
        <div className={styles.course_wrap}>
          <CourseItems
            courseContents={searching ? searchedPosts : fillteredCoursePosts}
            currentPage={currentPage}
            numShowContents={5}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </>
  );
};

export default CourseComponents;
