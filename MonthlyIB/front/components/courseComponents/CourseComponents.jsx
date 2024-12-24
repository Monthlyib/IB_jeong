"use client";
import styles from "./CourseComponents.module.css";
import CourseItems from "./CourseItems";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { useCourseStore } from "@/store/course";
import { courseGetCategory } from "@/apis/openAPI";
import { useUserStore } from "@/store/user";
import Loading from "../Loading";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/store/user";

export const courseCategoryList = {
  all: [],
  Group1: ["English Literature", "English Language", "Korean"],
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

const subjectList = {
  "English Literature": 7,
  "English Language": 8,
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

const CourseComponents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const searchKeyword = useRef();
  const [searching, setSeraching] = useState(false);

  const { coursePosts, getCourseList, loading, PageInfo } = useCourseStore();

  const [firstCategoryId, setFirstCategoryId] = useState("");
  const [secondCategoryId, setSecondCategoryId] = useState("");
  const [thirdCategoryId, setThirdCategoryId] = useState("");
  const [status, setStatus] = useState("");

  const { userDetailInfo } = useUserStore();

  const { userInfo } = useUserInfo();

  const [group, setGroup] = useState("all");
  const [subject, setSubject] = useState("all");
  const [level, setLevel] = useState("all");

  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태
  const router = useRouter(); // Router 추가


  useEffect(() => {
    const search =
      searchKeyword.current === undefined ? "" : searchKeyword.current;
    getCourseList(
      currentPage,
      search,
      status,
      firstCategoryId,
      secondCategoryId,
      thirdCategoryId
    );

    console.log("userinfo:", userInfo);
    if (userInfo?.authority === undefined) {
      setIsPopupOpen(true);
    }

  }, [firstCategoryId, secondCategoryId, thirdCategoryId, searching, currentPage]);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    router.push("/login"); // 로그인 페이지로 이동
  };

  if (loading) return <div>loading</div>;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onChange = useCallback((e) => {
    searchKeyword.current = e.target.value;
  }, []);
  const onClickSearchButton = () => {
    setSeraching(!searching);
  };

  useEffect(() => {
    setSubject("all");
    setLevel("all");
  }, [group]);

  const handleGroupChange = (e) => {
    setGroup(e.target.value);
    if (e.target.value !== "all")
      setFirstCategoryId(e.target.value.split("Group")[1]);
    else setFirstCategoryId("");
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    if (e.target.value !== "all")
      setSecondCategoryId(subjectList[e.target.value]);
    else setSecondCategoryId("");
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    if (e.target.value === "all") setThirdCategoryId("");
    else if (e.target.value === "SL") setThirdCategoryId(25);
    else if (e.target.value === "HL") setThirdCategoryId(26);
  };
  

  return (
    <>
      <main className="width_content">
        {/* 로그인 팝업 */}
        {isPopupOpen && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "30px",
                textAlign: "center",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                width: "400px",
              }}
            >
              <h2
                style={{
                  marginBottom: "20px",
                  fontSize: "20px",
                  color: "#5a2d82",
                }}
              >
                로그인 필요
              </h2>
              <p style={{ marginBottom: "30px", fontSize: "16px" }}>
                로그인하시면 더 많은 정보를 확인하실 수 있습니다.
              </p>
              <button
                onClick={handleClosePopup}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#5a2d82",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                확인
              </button>
            </div>
          </div>
        )}
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
                defaultValue={searchKeyword.current}
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

          {userDetailInfo?.authority === "ADMIN" && (
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
            courseContents={coursePosts}
            currentPage={currentPage}
            totalPages={PageInfo.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </>
  );
};

export default CourseComponents;
