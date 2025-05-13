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
import { deleteAiChapterImage } from "../../../apis/AiChapterTestAPI";

// Chapter options for each subject
const chapterOptions = {
    Biology: [
      "Water", "Nucleic acids", "Origins of cells", "Cell structure", "Viruses", "Diversity of organisms", "Classification & cladistics", "Evolution & speciation", "Conservation of biodiversity", "Carbohydrates & lipids", "Proteins", "Membranes & membrane transport", "Organelles & compartmentalisation", "Cell specialisation", "Gas exchange", "Transport", "Muscle & motility", "Adaptation to environment", "Ecological niches", "Enzymes & metabolism", "Cell respiration", "Photosynthesis", "Chemical signalling", "Neural signalling", "Integration of body systems", "Defence against disease", "Populations & communities", "Transfers of energy & matter", "DNA replication", "Protein synthesis", "Mutations & gene editing", "Cell & nuclear division", "Gene expression", "Water potential", "Reproduction", "Inheritance", "Homeostasis", "Natural selection", "Stability & change", "Climate change"
    ],
    Chemistry: [
      "Introduction to the particulate nature of matter", "The nuclear atom", "Electron configurations", "Counting particles by mass: the mole", "Ideal gases", "The ionic model", "The covalent model", "The metallic model", "From models to materials", "The periodic table—classification of elements", "Functional groups—classification of organic compounds", "Measuring enthalpy change", "Energy cycles in reactions", "Energy from fuels", "Entropy & spontaneity", "How much? The amount of chemical change (stoichiometry)", "How fast? The rate of chemical change (kinetics)", "How far? The extent of chemical change (equilibrium)", "Proton‑transfer reactions (acid–base)", "Electron‑transfer reactions (redox)", "Electron‑sharing reactions (organic)", "Electron‑pair‑sharing reactions (coordination / complex formation)"
    ],
    Physics: [
      "Describing motion", "Newton’s laws, impulse", "Mechanical energy, power", "Rotation, torque, stability", "Inertial frames, time dilation", "Specific‑heat, latent heat", "Energy balance, IR absorption", "Ideal/real gases, pressure", "First & second laws, engines", "Ohm’s law, Kirchhoff rules", "Oscillators, energy exchange", "Superposition, reflection", "Diffraction, interference", "Nodes, antinodes, Q‑factor", "Applications to light & sound", "Field strength, potential", "Coulomb, Biot–Savart, Gauss", "Charged‑particle dynamics", "Faraday, Lenz, AC generators", "Energy levels, spectra", "Wave–particle duality, models", "Half‑life, decay series", "Chain reactions, reactors", "Stellar processes, mass–energy"
    ],
    English: [
      "Novel",
      "Poem",
      "Play",
      "Article",
      "Opinion Column",
      "Speech",
      "Essay",
      "Graphic Novel",
      "Cartoon",
      "Advertisement",
      "Film",
      "Illustration",
      "Photograph"
    ],
    Econ: [
      "What is economics?", "How do economists approach the world?", "Demand", "Supply", "Competitive market equilibrium", "Critique of the maximizing behaviour of consumers and producers", "Elasticity of demand", "Elasticity of supply", "Role of government in microeconomics", "Market failure—externalities and common pool or common access resources", "Market failure—public goods", "Market failure—asymmetric information", "Market failure—market power", "The market’s inability to achieve equity", "Measuring economic activity and illustrating its variations", "Variations in economic activity—aggregate demand and aggregate supply", "Macroeconomic objectives", "Economics of inequality and poverty", "Demand management (demand-side policies)—monetary policy", "Demand management—fiscal policy", "Supply-side policies", "Benefits of international trade", "Types of trade protection", "Arguments for and against trade control/protection", "Economic integration", "Exchange rates", "Balance of payments", "Sustainable development", "Measuring development", "Barriers to economic growth and/or economic development", "Economic growth and/or economic development strategies"
    ],
    Business: [
      "Introduction to business management", "Types of organizations", "Organizational objectives", "Stakeholders", "External environment", "Growth and evolution", "Organizational planning tools", "Functions and evolution of human resource management", "Organizational structure", "Leadership and management", "Motivation", "Organizational (corporate) culture", "Industrial/employee relations", "Sources of finance", "Costs and revenues", "Break-even analysis", "Final accounts", "Profitability and liquidity ratio analysis", "Efficiency ratio analysis", "Cash flow", "Investment appraisal", "Budgets", "The role of marketing", "Marketing planning", "Sales forecasting", "Market research", "The four Ps", "The extended marketing mix of seven Ps", "International marketing", "E-commerce", "The role of operations management", "Production methods", "Lean production and quality management", "Location", "Production planning", "Research and development", "Crisis management and contingency planning"
    ],
    Psychology: [
      "Brain and behaviour", "Localization", "Neuroplasticity", "Neurotransmitters and behaviour", "Techniques used to study the brain in relation to behaviour", "Hormones and pheromones and behaviour", "The influence of hormones on behaviour", "The influence of pheromones on behaviour", "Genetics and behaviour", "Genes and behaviour, genetic similarities", "Evolutionary explanations for behaviour", "The role of animal research in understanding human behaviour", "Cognitive processing", "Models of memory", "Schema theory", "Thinking and decision-making", "Reliability of cognitive processes", "Reconstructive memory", "Biases in thinking and decision-making", "Emotion and cognition", "The influence of emotion on cognitive processes", "Cognitive processing in the digital world", "The individual and the group", "Social identity theory", "Social cognitive theory", "Stereotypes", "Cultural origins of behaviour and cognition", "Culture and its influence on behaviour and cognition", "Cultural dimensions", "Cultural influences on individual attitudes, identity and behaviours", "Enculturation", "Acculturation", "The influence of globalization on individual behaviour", "Factors influencing diagnosis", "Normality versus abnormality", "Classification systems", "Validity and reliability of diagnosis", "The role of clinical biases in diagnosis", "Etiology of abnormal psychology", "Prevalence rates and disorders", "Explanations for disorders: Biological explanations for depression", "Explanations for disorders: Cognitive explanations for depression", "Explanations for disorders: Sociocultural explanations for depression", "Treatment of disorders", "Assessing the effectiveness of treatment", "Biological treatment of depression", "Psychological treatment of depression", "The role of culture in treatment", "Determinants of health", "Prevalence rates of health problems", "Biopsychosocial (BPS) model of health and well-being", "Health problems", "Biological explanations of health problems", "Psychological explanations of health problems", "Social explanations of health problems", "Risk and protective factors", "Health promotion", "Effectiveness of health promotion programmes", "Personal relationships", "Formation of personal relationships", "Role of communication in personal relationships", "Explanations for why relationships change or end", "Group dynamics", "Cooperation and competition", "Prejudice and discrimination", "Origins of conflict and conflict resolution", "Social responsibility", "Bystanderism", "Prosocial behaviour", "Promoting prosocial behaviour", "Developing as a learner", "Brain development", "Cognitive development", "Development of empathy and theory of mind", "Developing an identity", "Gender identity and social roles", "Attachment", "Influences on cognitive and social development", "Role of peers and play", "Childhood trauma and resilience", "Effects of poverty on development", "Quantitative and qualitative research: Comparison", "Overarching concepts: Sampling, credibility, generalizability and bias", "The experiment", "Correlational studies", "Qualitative research", "Specific qualitative research methods: Overview", "Identifying the research method", "Ethics in psychological research"
    ],
    MathAA: [
      "Number & Algebra Basic",
      "Exponentials & Log",
      "Sequences & Series",
      "Simple Proof & Reasoning",
      "Proof by Induction & Contradiction",
      "Binomial Theorem",
      "Permutations & Combinations",
      "Complex Numbers",
      "Further Complex Numbers",
      "Systems of Linear Equations",
      "Linear Functions & Graphs",
      "Quadratic Functions & Graphs",
      "Functions Basic",
      "Other Functions & Graphs",
      "Reciprocal & Rational Functions",
      "Transformations of Graphs",
      "Polynomial Functions",
      "Inequalities",
      "Modulus Functions & Further Transformations",
      "Geometry Basic",
      "Geometry of 3D shapes",
      "Trigonometry",
      "The Unit Circle & Exact Values",
      "Trigonometric Functions & Graphs",
      "Trigonometric Equations & Identities",
      "Inverse & Reciprocal Trig Functions",
      "Trig Proof & Equation Strategies",
      "Vector Properties",
      "Vector Equations of Lines",
      "Vector Planes",
      "Statistics Basic",
      "Correlation & Regression",
      "Probability",
      "Discrete Random Variables",
      "Binomial Distribution",
      "Normal Distribution",
      "Continuous Random Variables",
      "Differentiation",
      "Integration",
      "Techniques & Applications of Integration",
      "Optimisation",
      "Kinematics",
      "Basic Limits & Continuity",
      "Further Differentiation",
      "Further Integration",
      "Differential Equations",
      "Maclaurin Series",
      "Limits using l’Hôpital’s Rule & Maclaurin"
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
    const [imagePath, setImagePath] = useState("");
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
            setImagePath(data.imagePath || "");
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
                    <div className={styles.fileInputWrapper}>
                        <input className={styles.fileInput} type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    {imagePath && (
                        <div style={{ marginTop: "1rem", textAlign: "center" }}>
                            <img src={imagePath} alt="미리보기" style={{ maxWidth: "400px", height: "auto", borderRadius: "8px" }} />
                            <div>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const id = typeof params.id === "string" ? parseInt(params.id) : params.id;
                                        if (window.confirm("정말로 그림을 삭제하시겠습니까?")) {
                                            try {
                                                await deleteAiChapterImage(id, userInfo);
                                                setImage(null);
                                                setImagePath("");
                                                alert("이미지가 삭제되었습니다.");
                                            } catch (error) {
                                                console.error(error);
                                                alert("이미지 삭제에 실패했습니다.");
                                            }
                                        }
                                    }}
                                    style={{
                                        marginTop: "0.5rem",
                                        padding: "6px 12px",
                                        backgroundColor: "#e74c3c",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "14px"
                                    }}
                                >
                                    그림 삭제하기
                                </button>
                            </div>
                        </div>
                    )}
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
