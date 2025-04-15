"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getChapterTests } from "@/apis/AiChapterTestAPI";
import styles from "./ChapterTestList.module.css";
import Pagination from "./Pagination";
import { useUserInfo } from "@/store/user";
import ChapterTestCardList from "./ChapterTestCardList";

const ChapterTestList = () => {
  const searchParams = useSearchParams();
  
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [page, setPage] = useState(1);
  const [initialized, setInitialized] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const { userInfo } = useUserInfo();

  useEffect(() => {
    const savedSubject = localStorage.getItem("subject") || "";
    const savedChapter = localStorage.getItem("chapter") || "";
    const savedPage = parseInt(localStorage.getItem("page")) || 1;

    setSelectedSubject(savedSubject);
    setSelectedChapter(savedChapter);
    setPage(savedPage);
    setInitialized(true);
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedSubject || !selectedChapter) return;

      setLoading(true);
      try {
        const response = await getChapterTests(
          {
            subject: selectedSubject,
            chapter: selectedChapter,
            page: page - 1,
          },
          userInfo
        );
        setQuestions(response.data); // response.data contains the array of questions
        setTotalPages(response.pageInfo.totalPages); // total pages from response.pageInfo
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedSubject, selectedChapter, page]);

  if (loading) return <div>Loading...</div>;
  if (!initialized) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.filterRow}>
        <label>
          과목:
          <select value={selectedSubject} onChange={(e) => {
            setSelectedSubject(e.target.value);
            localStorage.setItem("subject", e.target.value);
          }}>
            <option value="">과목 선택</option>
            <option value="Econ">Economics</option>
            <option value="English">English</option>
            <option value="Business">Business</option>
            <option value="Psychology">Psychology</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Physics">Physics</option>
            <option value="MathAA">Math AA</option>
          </select>
        </label>
        <label>
          챕터:
          <select value={selectedChapter} onChange={(e) => {
            setSelectedChapter(e.target.value);
            localStorage.setItem("chapter", e.target.value);
          }}>
            <option value="">챕터 선택</option>
            <option value="Chapter1">Chapter 1</option>
            <option value="Chapter2">Chapter 2</option>
            <option value="Chapter3">Chapter 3</option>
          </select>
        </label>
      </div>
      <h1>{`${selectedSubject} - ${selectedChapter} 문제 목록`}</h1>
      {questions.length === 0 ? (
        <p>문제가 없습니다.</p>
      ) : (
        <ChapterTestCardList questions={questions} userInfo={userInfo} />
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
            localStorage.setItem("page", newPage);
          }}
        />
      )}
    </div>
  );
};

export default ChapterTestList;
