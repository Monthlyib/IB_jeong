"use client";


import React, { useState, useEffect } from "react";
import { chapterOptions } from "../chapterOptions";
import { useRouter } from "next/navigation"; 
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
    getDescriptiveTestById,
    updateDescriptiveTest,
    uploadDescriptiveImage,
    deleteDescriptiveImage,
} from "@/apis/AiDescriptiveTestAPI";
import styles from "./AdminDescriptiveTestEdit.module.css";
import { useUserInfo } from "@/store/user";

const DynamicEditor = dynamic(
    () => import("@/components/aiComponents/chapter_test/EditorComponents"),
    {
        ssr: false,
    }
);

const AdminDescriptiveTestEdit = () => {
    const params = useParams();
    const id = typeof params.id === "string" ? parseInt(params.id) : params.id;
    const router = useRouter();
    const [question, setQuestion] = useState("");
    const [subject, setSubject] = useState("");
    const [chapter, setChapter] = useState("");
    const [imagePath, setImagePath] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    const [maxScore, setMaxScore] = useState("");
    const { userInfo } = useUserInfo();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getDescriptiveTestById(id, userInfo);
                setQuestion(data.question);
                setSubject(data.subject);
                setChapter(data.chapter);
                setImagePath(data.imagePath || "");
                setMaxScore(data.maxScore);
            } catch (err) {
                setError("Failed to fetch test data.");
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageUploading(true);
        try {
            const res = await uploadDescriptiveImage(id, file, userInfo);
            setImagePath(res.imagePath);
        } catch (err) {
            setError("Image upload failed.");
        }
        setImageUploading(false);
    };

    const handleImageDelete = async () => {
        const confirm = window.confirm("정말로 그림을 삭제하시겠습니까?");
        if (!confirm) return;
        try {
            await deleteDescriptiveImage(id, userInfo);
            setImagePath("");
            alert("이미지가 삭제되었습니다.");
        } catch (error) {
            console.error(error);
            alert("이미지 삭제에 실패했습니다.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const data = { question, subject, chapter, maxScore };
            await updateDescriptiveTest(id, data, userInfo);
            alert("문제가 성공적으로 수정되었습니다.");
            router.push("/aitools/descriptive");
        } catch (err) {
            alert("문제 수정 중 오류가 발생했습니다.");
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Edit Descriptive Test</h2>
            {loading && <div>Loading...</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Subject:</label>
                    <select
                        value={subject}
                        onChange={(e) => {
                            setSubject(e.target.value);
                            setChapter("");
                        }}
                        required
                        className={styles.input}
                    >
                        <option value="">과목을 선택하세요</option>
                        {Object.keys(chapterOptions).map((subj) => (
                            <option key={subj} value={subj}>
                                {subj}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Chapter:</label>
                    <select
                        value={chapter}
                        onChange={(e) => setChapter(e.target.value)}
                        required
                        disabled={!subject}
                        className={styles.input}
                    >
                        <option value="">챕터를 선택하세요</option>
                        {subject &&
                            chapterOptions[subject]?.map((chap) => (
                                <option key={chap} value={chap}>
                                    {chap}
                                </option>
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
                    <DynamicEditor
                        className={`${styles.editor} ${styles.question}`}
                        content={question}
                        setContent={setQuestion}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Image:</label>
                    {imagePath && (
                        <div className={styles.imagePreview}>
                            <img
                                src={imagePath}
                                alt="Descriptive"
                                style={{ maxWidth: "400px", height: "auto", borderRadius: "8px" }}
                            />
                            <button
                                type="button"
                                onClick={handleImageDelete}
                                disabled={imageUploading}
                                style={{
                                    marginTop: "0.5rem",
                                    padding: "6px 12px",
                                    backgroundColor: "#e74c3c",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                }}
                            >
                                Delete Image
                            </button>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={imageUploading}
                        className={styles.input}
                    />
                </div>
                <div className={styles.buttons} style={{ marginTop: "16px" }}>
                    <button type="submit" disabled={loading} className={styles.submitBtn}>
                        Save
                    </button>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        style={{ marginLeft: "8px" }}
                        onClick={() => router.push("/aitools/descriptive-test")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminDescriptiveTestEdit;