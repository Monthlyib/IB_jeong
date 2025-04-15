"use client";

import React, { useEffect, useState } from "react";
import styles from "./AdminChapterTest.module.css";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useUserInfo } from "@/store/user";
import { useRouter, useParams } from "next/navigation";
import {
    getChapterTestById,
    updateAiChapterTest,
    uploadAiChapterImage,
} from "../../../apis/AiChapterTestAPI";

const DynamicEditor = dynamic(
    () => import("@/components/aiComponents/chapter_test/EditorComponents"),
    {
        ssr: false,
    }
);

const AdminChapterTestEdit = () => {
    const [question, setQuestion] = useState("");
    const [image, setImage] = useState(null);
    const [choices, setChoices] = useState({ A: "", B: "", C: "", D: "" });
    const [answer, setAnswer] = useState("");
    const [subject, setSubject] = useState("");
    const [chapter, setChapter] = useState("");
    const { userInfo } = useUserInfo();
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const id = typeof params.id === "string" ? parseInt(params.id) : params.id;
            const data = await getChapterTestById(id, userInfo);
            setQuestion(data.question);
            setChoices({
                A: data.choiceA,
                B: data.choiceB,
                C: data.choiceC,
                D: data.choiceD,
            });
            setAnswer(data.answer);
            setSubject(data.subject);
            setChapter(data.chapter);
        };
        fetchData();
    }, [params.id, userInfo]);

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

            const res = await updateAiChapterTest(params.id, data, userInfo);
            if (res?.result.status === 200) {
                if (image) {
                    await uploadAiChapterImage(params.id, image, userInfo);
                }
                alert("문제가 성공적으로 수정되었습니다.");
                router.push("/aitools/chapter-test");
            } else {
                throw new Error("문제 수정 실패");
            }
        } catch (err) {
            console.error(err);
            alert("문제 수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>문제 수정</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Subject:</label>
                    <select className={styles.input} value={subject} onChange={(e) => setSubject(e.target.value)}>
                        <option value="">과목을 선택하세요</option>
                        <option value="Econ">Economics</option>
                        <option value="English">English</option>
                        <option value="Business">Business</option>
                        <option value="Psychology">Psychology</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Physics">Physics</option>
                        <option value="MathAA">Math AA</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Chapter:</label>
                    <select className={styles.input} value={chapter} onChange={(e) => setChapter(e.target.value)}>
                        <option value="">챕터를 선택하세요</option>
                        <option value="Chapter1">Chapter 1</option>
                        <option value="Chapter2">Chapter 2</option>
                        <option value="Chapter3">Chapter 3</option>
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
                    <button type="submit" className={styles.submitBtn}>문제 수정</button>
                </div>
            </form>
        </div>
    );
};

export default AdminChapterTestEdit;
