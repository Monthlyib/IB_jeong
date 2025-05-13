"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getChapterTests } from "@/apis/AiChapterTestAPI";
import styles from "./ChapterTestList.module.css";
import Pagination from "./Pagination";
import { useUserInfo } from "@/store/user";
import ChapterTestCardList from "./ChapterTestCardList";

import { chapterOptions } from "../chapterOptions";


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
        console.log(response);
        setQuestions(response.data);
        setTotalPages(response.pageInfo.totalPages);
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
            const newSubject = e.target.value;
            setSelectedSubject(newSubject);
            setSelectedChapter("");
            localStorage.setItem("subject", newSubject);
            localStorage.removeItem("chapter");
          }}>
            <option value="">과목 선택</option>
            {Object.keys(chapterOptions).map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </label>
        <label>
          챕터:
          <select value={selectedChapter} onChange={(e) => {
            setSelectedChapter(e.target.value);
            localStorage.setItem("chapter", e.target.value);
          }}>
            <option value="">챕터 선택</option>
            {(chapterOptions[selectedSubject] || []).map((chapter, idx) => (
              <option key={idx} value={chapter}>{chapter}</option>
            ))}
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
