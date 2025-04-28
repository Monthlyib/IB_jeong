"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AIChapterTest.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUserInfo } from "@/store/user";
import Link from "next/link";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { getActiveQuizSession } from "@/apis/AiChapterTestAPI";
import { useChapterTestStore } from "@/store/chaptertest";

const chapterOptions = {
  Econ: [
    "What is economics?",
    "How do economists approach the world?",
    "Demand",
    "Supply",
    "Competitive market equilibrium",
    "Critique of the maximizing behaviour of consumers and producers",
    "Elasticity of demand",
    "Elasticity of supply",
    "Role of government in microeconomics",
    "Market failure—externalities and common pool or common access resources",
    "Market failure—public goods",
    "Market failure—asymmetric information",
    "Market failure—market power",
    "The market’s inability to achieve equity",
    "Measuring economic activity and illustrating its variations",
    "Variations in economic activity—aggregate demand and aggregate supply",
    "Macroeconomic objectives",
    "Economics of inequality and poverty",
    "Demand management (demand-side policies)—monetary policy",
    "Demand management—fiscal policy",
    "Supply-side policies",
    "Benefits of international trade",
    "Types of trade protection",
    "Arguments for and against trade control/protection",
    "Economic integration",
    "Exchange rates",
    "Balance of payments",
    "Sustainable development",
    "Measuring development",
    "Barriers to economic growth and/or economic development",
    "Economic growth and/or economic development strategies"
  ],
  English: [
    "Novel",
    "Poem",
    "Play",
    "Article",
    "Opinion Column",
    "Speech",
    "Advertisement",
    "Essay",
    "Graphic Novel",
    "Cartoon",
    "Advertisement",
    "Film",
    "Illustration",
    "Photograph"
  ],
  Business: [
    "Introduction to business management",
    "Types of organizations",
    "Organizational objectives",
    "Stakeholders",
    "External environment",
    "Growth and evolution",
    "Organizational planning tools",
    "Functions and evolution of human resource management",
    "Organizational structure",
    "Leadership and management",
    "Motivation",
    "Organizational (corporate) culture",
    "Industrial/employee relations",
    "Sources of finance",
    "Costs and revenues",
    "Break-even analysis",
    "Final accounts",
    "Profitability and liquidity ratio analysis",
    "Efficiency ratio analysis",
    "Cash flow",
    "Investment appraisal",
    "Budgets",
    "The role of marketing",
    "Marketing planning (including introduction to the four Ps)",
    "Sales forecasting",
    "Market research",
    "The four Ps (product, price, promotion, place)",
    "The extended marketing mix of seven Ps",
    "International marketing",
    "E-commerce",
    "The role of operations management",
    "Production methods",
    "Lean production and quality management",
    "Location",
    "Production planning",
    "Research and development",
    "Crisis management and contingency planning"
  ],
  Psychology: [
    "Brain and behaviour", "Localization", "Neuroplasticity", "Neurotransmitters and behaviour",
    "Techniques used to study the brain in relation to behaviour", "Hormones and pheromones and behaviour",
    "The influence of hormones on behaviour", "The influence of pheromones on behaviour",
    "Genetics and behaviour", "Genes and behaviour, genetic similarities",
    "Evolutionary explanations for behaviour", "The role of animal research in understanding human behaviour",
    "Cognitive processing", "Models of memory", "Schema theory", "Thinking and decision-making",
    "Reliability of cognitive processes", "Reconstructive memory", "Biases in thinking and decision-making",
    "Emotion and cognition", "The influence of emotion on cognitive processes",
    "Cognitive processing in the digital world", "The individual and the group",
    "Social identity theory", "Social cognitive theory", "Stereotypes",
    "Cultural origins of behaviour and cognition", "Culture and its influence on behaviour and cognition",
    "Cultural dimensions", "Cultural influences on individual attitudes, identity and behaviours",
    "Enculturation", "Acculturation", "The influence of globalization on individual behaviour",
    "Factors influencing diagnosis", "Normality versus abnormality", "Classification systems",
    "Validity and reliability of diagnosis", "The role of clinical biases in diagnosis",
    "Etiology of abnormal psychology", "Prevalence rates and disorders",
    "Explanations for disorders: Biological explanations for depression",
    "Explanations for disorders: Cognitive explanations for depression",
    "Explanations for disorders: Sociocultural explanations for depression", "Treatment of disorders",
    "Assessing the effectiveness of treatment", "Biological treatment of depression",
    "Psychological treatment of depression", "The role of culture in treatment",
    "Determinants of health", "Prevalence rates of health problems",
    "Biopsychosocial (BPS) model of health and well-being", "Health problems",
    "Biological explanations of health problems", "Psychological explanations of health problems: Dispositional factors and health beliefs",
    "Social explanations of health problems", "Risk and protective factors", "Health promotion",
    "Effectiveness of health promotion programmes", "Personal relationships",
    "Formation of personal relationships", "Role of communication in personal relationships",
    "Explanations for why relationships change or end", "Group dynamics", "Cooperation and competition",
    "Prejudice and discrimination", "Origins of conflict and conflict resolution", "Social responsibility",
    "Bystanderism", "Prosocial behaviour", "Promoting prosocial behaviour", "Developing as a learner",
    "Brain development", "Cognitive development", "Development of empathy and theory of mind",
    "Developing an identity", "Gender identity and social roles", "Attachment",
    "Influences on cognitive and social development", "Role of peers and play",
    "Childhood trauma and resilience", "Effects of poverty on development",
    "Quantitative and qualitative research: Comparison", "Overarching concepts: Sampling, credibility, generalizability and bias",
    "The experiment", "Correlational studies", "Qualitative research",
    "Specific qualitative research methods: Overview", "Identifying the research method",
    "Ethics in psychological research"
  ],
  Chemistry: [
    "Introduction to the particulate nature of matter",
    "The nuclear atom",
    "Electron configurations",
    "Counting particles by mass: the mole",
    "Ideal gases",
    "The ionic model",
    "The covalent model",
    "The metallic model",
    "From models to materials",
    "The periodic table—classification of elements",
    "Functional groups—classification of organic compounds",
    "Measuring enthalpy change",
    "Energy cycles in reactions",
    "Energy from fuels",
    "Entropy & spontaneity",
    "How much? The amount of chemical change (stoichiometry)",
    "How fast? The rate of chemical change (kinetics)",
    "How far? The extent of chemical change (equilibrium)",
    "Proton‑transfer reactions (acid–base)",
    "Electron‑transfer reactions (redox)",
    "Electron‑sharing reactions (organic)",
    "Electron‑pair‑sharing reactions (coordination / complex formation)"
  ],
  Biology: [
    "Water", "Nucleic acids", "Origins of cells", "Cell structure", "Viruses",
    "Diversity of organisms", "Classification & cladistics", "Evolution & speciation",
    "Conservation of biodiversity", "Carbohydrates & lipids", "Proteins",
    "Membranes & membrane transport", "Organelles & compartmentalisation", "Cell specialisation",
    "Gas exchange", "Transport", "Muscle & motility", "Adaptation to environment",
    "Ecological niches", "Enzymes & metabolism", "Cell respiration", "Photosynthesis",
    "Chemical signalling", "Neural signalling", "Integration of body systems",
    "Defence against disease", "Populations & communities", "Transfers of energy & matter",
    "DNA replication", "Protein synthesis", "Mutations & gene editing", "Cell & nuclear division",
    "Gene expression", "Water potential", "Reproduction", "Inheritance", "Homeostasis",
    "Natural selection", "Stability & change", "Climate change"
  ],
  Physics: [
    "Describing motion",
    "Newton’s laws, impulse",
    "Mechanical energy, power",
    "Rotation, torque, stability",
    "Inertial frames, time dilation",
    "Specific‑heat, latent heat",
    "Energy balance, IR absorption",
    "Ideal/real gases, pressure",
    "First & second laws, engines",
    "Ohm’s law, Kirchhoff rules",
    "Oscillators, energy exchange",
    "Superposition, reflection",
    "Diffraction, interference",
    "Nodes, antinodes, Q‑factor",
    "Applications to light & sound",
    "Field strength, potential",
    "Coulomb, Biot–Savart, Gauss",
    "Charged‑particle dynamics",
    "Faraday, Lenz, AC generators",
    "Energy levels, spectra",
    "Wave–particle duality, models",
    "Half‑life, decay series",
    "Chain reactions, reactors",
    "Stellar processes, mass–energy"
  ]
};

const AIChapterTest = () => {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const { userInfo } = useUserInfo();
  const [pendingSessionId, setPendingSessionId] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const { fetchAndSetQuizSession } = useChapterTestStore();

  const handleStartTest = async () => {
    if (!subject || !chapter) {
      alert("과목과 챕터를 모두 선택하세요.");
      return;
    }

    try {
      const result = await getActiveQuizSession({ subject, chapter }, userInfo);
      console.log("result", result);
      if (result?.data?.quizSessionId) {
        setPendingSessionId(result.data.quizSessionId);
        setShowResumeModal(true);
      } else {
        const sessionData = await fetchAndSetQuizSession(
          { subject, chapter, questionCount, durationMinutes },
          userInfo
        );
        router.push(`/aitools/chapter-test/exam?sessionId=${sessionData.quizSessionId}`);
      }
    } catch (err) {
      console.error("시험 시작 실패:", err?.response?.data?.code);  
      if (err?.response?.data?.code === 14034) {
        alert("문제 수가 부족하여 시험을 시작할 수 없습니다.");
      } else {
        console.error("시험 시작 실패:", err);
        alert("시험 세션을 시작할 수 없습니다.");
      }
    }
  };

  const handleContinueTest = () => {
    router.push(`/aitools/chapter-test/exam?sessionId=${pendingSessionId}`);
  };

  const handleForceNewTest = async () => {
    const confirmed = confirm("이전에 완료되지 않은 시험 기록이 삭제됩니다. 새로 시작하시겠습니까?");
    if (!confirmed) return;

    try {
      const sessionData = await fetchAndSetQuizSession(
        { subject, chapter, questionCount, durationMinutes },
        userInfo
      );
      router.push(`/aitools/chapter-test/exam?sessionId=${sessionData.quizSessionId}`);
    } catch (err) {
      console.error("시험 세션 새로 시작 실패:", err);
      alert("시험 세션을 새로 시작할 수 없습니다.");
    }
  };

  return (
    <main className={styles.container}>
      {/* 상단 영역: 제목 + 간단 소개 문구 */}
      <section className={styles.introSection}>
        <h1 className={styles.title}>AI Chapter Test</h1>
        <p className={styles.description}>
          과목과 챕터를 선택하고 테스트를 시작해 보세요!
        </p>
      </section>
      {userInfo?.authority === "ADMIN" && (
        <div className={styles.right_btn}>
          <Link
            href={`/aitools/chapter-test/admin-input`}
            className={styles.btn_write}
          >
            <FontAwesomeIcon icon={faPenAlt} />
            <span>문제 입력</span>
          </Link>
        </div>
      )}
      {userInfo?.authority === "ADMIN" && (
        <div className={styles.right_btn}>
          <Link
            href={`/aitools/chapter-test/list`}
            className={styles.btn_write}
          >
            <FontAwesomeIcon icon={faPenAlt} />
            <span>문제 목록 보기</span>
          </Link>
        </div>
      )}
      {/* 드롭다운 + 버튼 영역 */}
      <section className={styles.formSection}>

        <div className={styles.selectWrapper}>
          <label htmlFor="subjectSelect">과목 선택</label>
          <select
            id="subjectSelect"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setChapter(""); // subject가 바뀔 때 chapter도 초기화
            }}
          >
            <option value="">과목을 선택하세요</option>
            {Object.keys(chapterOptions).map((subjectKey) => (
              <option key={subjectKey} value={subjectKey}>
                {subjectKey}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <label htmlFor="chapterSelect">챕터/토픽 선택</label>
          <select
            id="chapterSelect"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
          >
            <option value="">챕터를 선택하세요</option>
            {chapterOptions[subject]?.map((ch, index) => (
              <option key={index} value={ch}>
                {ch}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <label htmlFor="questionCount">문제 개수 선택</label>
          <select
            id="questionCount"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className={styles.input}
          >
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}문제
              </option>
            ))}
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <label htmlFor="durationMinutes">시험 시간 선택</label>
          <select
            id="durationMinutes"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
            className={styles.input}
          >
            {[10, 15, 20, 25, 30].map((min) => (
              <option key={min} value={min}>
                {min}분
              </option>
            ))}
          </select>
        </div>

        <button className={styles.startButton} onClick={handleStartTest}>
          테스트 시작
        </button>

        {pendingSessionId && showResumeModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <p>진행 중인 시험이 있습니다. 어떻게 하시겠습니까?</p>
              <div className={styles.modalButtons}>
                <button className={styles.continueButton} onClick={handleContinueTest}>
                  시험 이어보기
                </button>
                <button className={styles.resetButton} onClick={handleForceNewTest}>
                  시험 새로보기
                </button>
                <button className={styles.cancelButton} onClick={() => setShowResumeModal(false)}>
                  취소
                </button>
              </div>
              <p className={styles.notice}>※ 새로 시작하면 이전 시험 기록은 삭제됩니다.</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default AIChapterTest;