"use client";
import React, { useState } from "react";
import styles from "./AdminDescriptiveTest.module.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/store/user";
import { chapterOptions } from "../chapterOptions";
import { createAiDescriptiveTest, uploadDescriptiveImage } from "@/apis/AiDescriptiveTestAPI";

const DynamicEditor = dynamic(
  () => import("@/components/aiComponents/chapter_test/EditorComponents"),
  { ssr: false }
);

const AdminDescriptiveTest = () => {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState(null);
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const { userInfo } = useUserInfo();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        question,
        subject,
        chapter,
        maxScore,
      };

      const res = await createAiDescriptiveTest(data, userInfo);
      if (res?.result?.status === 200) {
        if (image) {
          await uploadDescriptiveImage(res?.data?.id, image, userInfo);
        }
        alert("문제가 성공적으로 저장되었습니다.");
        router.push("/aitools/descriptive");
      } else {
        throw new Error("문제 저장 실패");
      }
    } catch (err) {
      console.error(err);
      alert("문제 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>서술형 문제 입력</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Subject:</label>
          <select className={styles.input} value={subject} onChange={(e) => { setSubject(e.target.value); setChapter(""); }}>
            <option value="">과목을 선택하세요</option>
            {Object.keys(chapterOptions).map((subj, idx) => (
              <option key={idx} value={subj}>{subj}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Chapter:</label>
          <select className={styles.input} value={chapter} onChange={(e) => setChapter(e.target.value)}>
            <option value="">챕터를 선택하세요</option>
            {chapterOptions[subject]?.map((ch, idx) => (
              <option key={idx} value={ch}>{ch}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Max Score:</label>
          <select
            value={maxScore}
            onChange={(e) => setMaxScore(parseInt(e.target.value))}
            required
            className={styles.input}
          >
            {Array.from({ length: 21 }, (_, i) => i).map((score) => (
              <option key={score} value={score}>
                {score}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Question:</label>
          <DynamicEditor className={`${styles.editor} ${styles.question}`} content={question} setContent={setQuestion} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Image:</label>
          <input className={styles.fileInput} type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className={styles.buttons}>
          <button type="submit" className={styles.submitBtn}>문제 저장</button>
        </div>
      </form>
    </div>
  );
};

export default AdminDescriptiveTest;