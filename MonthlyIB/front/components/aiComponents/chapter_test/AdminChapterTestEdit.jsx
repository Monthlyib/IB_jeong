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

// Chapter options for each subject
const chapterOptions = {
  Econ: [
    "Introduction to Economics",
    "Microeconomics: Demand and Supply",
    "Elasticities",
    "Government Intervention",
    "Market Failure",
    "Theory of the Firm",
    "Market Structures",
    "Macroeconomics: Introduction",
    "Aggregate Demand and Supply",
    "Macroeconomic Objectives",
    "Fiscal Policy",
    "Monetary Policy",
    "Supply-side Policies",
    "International Economics: Free Trade and Protectionism",
    "Exchange Rates",
    "Balance of Payments",
    "Economic Development",
    "Measuring Development",
    "Barriers to Economic Growth and Development",
    "Trade and Development",
    "Foreign Direct Investment (FDI)",
    "Aid and Debt",
    "Sustainability and the Environment"
  ],
  English: [
    "Literature Analysis",
    "Poetry",
    "Prose",
    "Drama",
    "Unseen Texts",
    "Comparative Essays",
    "World Literature",
    "Language and Context",
    "Paper 1 Techniques",
    "Paper 2 Techniques"
  ],
  Business: [
    "Business Organization and Environment",
    "Human Resource Management",
    "Finance and Accounts",
    "Marketing",
    "Operations Management",
    "Business Strategy",
    "Growth and Evolution",
    "Change Management"
  ],
  Psychology: [
    "Biological Approach",
    "Cognitive Approach",
    "Sociocultural Approach",
    "Research Methods",
    "Abnormal Psychology",
    "Developmental Psychology",
    "Health Psychology",
    "Human Relationships"
  ],
  Chemistry: [
    "Stoichiometric Relationships",
    "Atomic Structure",
    "Periodicity",
    "Chemical Bonding and Structure",
    "Energetics/Thermochemistry",
    "Chemical Kinetics",
    "Equilibrium",
    "Acids and Bases",
    "Redox Processes",
    "Organic Chemistry",
    "Measurement and Data Processing"
  ],
  Biology: [
    "Cell Biology",
    "Molecular Biology",
    "Genetics",
    "Ecology",
    "Evolution and Biodiversity",
    "Human Physiology",
    "Nucleic Acids",
    "Metabolism, Cell Respiration and Photosynthesis",
    "Plant Biology",
    "Genetics and Evolution",
    "Animal Physiology"
  ],
  Physics: [
    "Measurements and Uncertainties",
    "Mechanics",
    "Thermal Physics",
    "Waves",
    "Electricity and Magnetism",
    "Circular Motion and Gravitation",
    "Atomic, Nuclear and Particle Physics",
    "Energy Production"
  ]
};

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
                    <select
                        className={styles.input}
                        value={subject}
                        onChange={(e) => {
                            setSubject(e.target.value);
                            setChapter(""); // reset chapter when subject changes
                        }}
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
                        className={styles.input}
                        value={chapter}
                        onChange={(e) => setChapter(e.target.value)}
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
