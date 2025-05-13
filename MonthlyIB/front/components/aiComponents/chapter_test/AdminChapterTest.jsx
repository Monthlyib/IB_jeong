"use client";
import React, { useState } from "react";
import styles from "./AdminChapterTest.module.css"; // CSS 모듈을 사용하여 스타일링
import dynamic from "next/dynamic"; // 동적 import를 위해 next/dynamic 사용
import Link from "next/link"; // Link 컴포넌트 사용
import { useUserInfo } from "@/store/user";
import { createAiChapterTest, uploadAiChapterImage } from "../../../apis/AiChapterTestAPI";
import { useRouter } from "next/navigation"; // useRouter 훅을 사용하여 라우팅 처리
import { chapterOptions } from "../chapterOptions";

const DynamicEditor = dynamic(
    () => import("@/components/aiComponents/chapter_test/EditorComponents"),
    {
        ssr: false,
    }
);
const AdminChapterTest = () => {
    const [question, setQuestion] = useState("");
    const [image, setImage] = useState(null);
    const [choices, setChoices] = useState({ A: "", B: "", C: "", D: "" });
    const [answer, setAnswer] = useState("");
    const [subject, setSubject] = useState("");
    const [chapter, setChapter] = useState("");
    const { userInfo } = useUserInfo();
    const router = useRouter();


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                question,
                choiceA: choices.A,
                choiceB: choices.B,
                choiceC: choices.C,
                choiceD: choices.D,
                answer,
                subject,
                chapter,
            };

            const res = await createAiChapterTest(data, userInfo);
            console.log("Response from API:", res);

            if (res?.result.status === 200) {
                console.log("Text saved, question ID:", res?.data.id);

                if (image) {
                    await uploadAiChapterImage(res?.data.id, image, userInfo);
                }

                alert("문제가 성공적으로 저장되었습니다.");
                router.push("/aitools/chapter-test");
            } else {
                throw new Error("텍스트 저장 실패");
            }
        } catch (err) {
            console.error(err);
            alert("문제 저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>문제 입력</h2>
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
                    <label className={styles.label}>Question:</label>
                    <DynamicEditor className={`${styles.editor} ${styles.question}`} content={question} setContent={setQuestion} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Image:</label>
                    <input className={styles.fileInput} type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Choice A:</label>
                    <DynamicEditor className={styles.editor} content={choices.A} setContent={(value) => setChoices({ ...choices, A: value })} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Choice B:</label>
                    <DynamicEditor className={styles.editor} content={choices.B} setContent={(value) => setChoices({ ...choices, B: value })} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Choice C:</label>
                    <DynamicEditor className={styles.editor} content={choices.C} setContent={(value) => setChoices({ ...choices, C: value })} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Choice D:</label>
                    <DynamicEditor className={styles.editor} content={choices.D} setContent={(value) => setChoices({ ...choices, D: value })} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Answer:</label>
                    <select className={styles.input} value={answer} onChange={(e) => setAnswer(e.target.value)}>
                        <option value="">정답을 선택하세요</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </div>
                <div className={styles.buttons}>
                    <Link href="/aitools/chapter-test" className={styles.cancelBtn}>
                        취소
                    </Link>
                    <button type="submit" className={styles.submitBtn}>문제 저장</button>
                </div>
            </form>
        </div>
    );
};

export default AdminChapterTest;
