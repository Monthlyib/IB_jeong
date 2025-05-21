"use client";

import React, { useEffect, useState } from "react";
import {
  getDescriptiveTests,
} from "@/apis/AiDescriptiveTestAPI";
import DescriptiveTestCardList from "./DescriptiveTestCardList";
import { chapterOptions } from "../chapterOptions";
import styles from "./Descriptive_testList.module.css";
import { useUserInfo } from "@/store/user";

const DescriptiveTestList = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [descriptiveTests, setDescriptiveTests] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
    const { userInfo } = useUserInfo();
  const pageSize = 10;

  useEffect(() => {
    const savedSubject = localStorage.getItem("subject") || "";
    const savedChapter = localStorage.getItem("chapter") || "";
    const savedPage = parseInt(localStorage.getItem("page")) || 1;

    setSelectedSubject(savedSubject);
    setSelectedChapter(savedChapter);
    setPage(savedPage);
  }, []);

  useEffect(() => {
    if (selectedSubject && selectedChapter) {
      fetchDescriptiveTests();
    }
  }, [selectedSubject, selectedChapter, page]);

  const fetchDescriptiveTests = async () => {
    try {
      // Assume userInfo is available in your context or props
      const data = await getDescriptiveTests(
        { subject: selectedSubject, chapter: selectedChapter, page: page - 1 },
        userInfo
      );
      setDescriptiveTests(data.data||[]);
    } catch (err) {
      setDescriptiveTests([]);
    }
  };


  const handlePageChange = (newPage) => {
    setPage(newPage);
    localStorage.setItem("page", newPage);
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterRow}>
        <label>
          과목:
          <select
            value={selectedSubject}
            onChange={(e) => {
              const newSubject = e.target.value;
              setSelectedSubject(newSubject);
              setSelectedChapter("");
              localStorage.setItem("subject", newSubject);
              localStorage.removeItem("chapter");
            }}
          >
            <option value="">과목 선택</option>
            {Object.keys(chapterOptions).map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>
        <label>
          챕터:
          <select
            value={selectedChapter}
            onChange={(e) => {
              setSelectedChapter(e.target.value);
              localStorage.setItem("chapter", e.target.value);
            }}
          >
            <option value="">챕터 선택</option>
            {(chapterOptions[selectedSubject] || []).map((chapter, idx) => (
              <option key={idx} value={chapter}>
                {chapter}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h1>{`${selectedSubject} - ${selectedChapter} 서술형 문제 목록`}</h1>
      {Array.isArray(descriptiveTests) && descriptiveTests.length > 0 ? (
        <DescriptiveTestCardList questions={descriptiveTests} />
      ) : (
        <p>문제가 없습니다.</p>
      )}
      {totalCount > pageSize && (
        <div className={styles.pagination}>
          {Array.from({ length: Math.ceil(totalCount / pageSize) }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => handlePageChange(idx + 1)}
              disabled={page === idx + 1}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DescriptiveTestList;