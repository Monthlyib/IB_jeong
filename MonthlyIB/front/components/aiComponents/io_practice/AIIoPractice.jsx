"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useIOStore } from "@/store/AIIostore"; // 전역 스토어
import styles from "./AIIoPractice.module.css";

const AIIoPractice = () => {
  const router = useRouter();

  // 로컬 상태
  const [iocTopic, setIocTopicLocal] = useState("");
  const [workTitle, setWorkTitleLocal] = useState("");
  const [author, setAuthorLocal] = useState("");
  const [scriptFile, setScriptFileLocal] = useState(null);

  // 전역 상태 set 함수
  const {
    setIocTopic,
    setWorkTitle,
    setAuthor,
    setScriptFile,
  } = useIOStore();

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // 파일 확장자 검사 (소문자 변환 후 검사)
      const allowedExtensions = [".pdf", ".txt", ".doc", ".docx"];
      const fileName = file.name.toLowerCase();
      const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext));
      if (!isAllowed) {
        alert("업로드 가능한 파일 형식은 PDF, TXT, DOC, DOCX 입니다.");
        e.target.value = "";
        return;
      }
      setScriptFileLocal(file);
    }
  };

  const handleNext = () => {
    // 필수값 검사
    if (!iocTopic || !workTitle || !author || !scriptFile) {
      alert("IOC 주제, 작품 제목, 작가, 그리고 대본 파일을 모두 등록하세요.");
      return;
    }

    // 전역 상태에 저장
    setIocTopic(iocTopic);
    setWorkTitle(workTitle);
    setAuthor(author);
    setScriptFile(scriptFile);

    // 다음 단계로 이동
    router.push("/aitools/io-practice/recording");
  };

  return (
    <main className={styles.container}>
      <section className={styles.introSection}>
        <h1 className={styles.title}>AI IO 연습 코치</h1>
        <p className={styles.description}>
          IO 연습 코치와 함께 대본을 작성하고 Oral 연습을 해보세요!
        </p>
      </section>

      <section className={styles.formSection}>
        <div className={styles.formGroup}>
          <label htmlFor="iocTopic" className={styles.mainLabel}>
            IOC 주제
          </label>
          <input
            id="iocTopic"
            type="text"
            placeholder="IOC 주제를 입력하세요"
            value={iocTopic}
            onChange={(e) => setIocTopicLocal(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.mainLabel}>문학작품</label>
          <div className={styles.subGroup}>
            <div className={styles.inputRow}>
              <label htmlFor="workTitle">제목</label>
              <input
                id="workTitle"
                type="text"
                placeholder="작품 제목"
                value={workTitle}
                onChange={(e) => setWorkTitleLocal(e.target.value)}
              />
            </div>
            <div className={styles.inputRow}>
              <label htmlFor="author">작가</label>
              <input
                id="author"
                type="text"
                placeholder="작가 이름"
                value={author}
                onChange={(e) => setAuthorLocal(e.target.value)}
              />
            </div>
            <div className={styles.inputRow}>
              <label htmlFor="scriptFile">
                [대본 파일(스크립트) 업로드] (필수)
              </label>
              <input id="scriptFile" type="file" onChange={handleFileChange} />
            </div>
          </div>
        </div>

        <button className={styles.nextButton} onClick={handleNext}>
          다음
        </button>
      </section>
    </main>
  );
};

export default AIIoPractice;