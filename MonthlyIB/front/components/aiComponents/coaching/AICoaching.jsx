"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { chapterOptions } from "@/components/aiComponents/chapterOptions";
const subjects = ["Science", "Math", "Langauge A English", "Psychology", "Business", "History", "Geography", "Economics"];
const ENGLISH_SUBJECT = "Langauge A English";
const ENGLISH_TEXT_TYPES = ["Literature", "Language"]; // step 2 for English
const ENGLISH_MODES = [
    { key: "generative", label: "✨ 새로운 질문 생성하기 (Generative)" },
    { key: "evaluate", label: "📝 작성한 질문 평가받기 (evaluate)" }
];
import { fetchRecommendedTopics, createGuide, postEnglishChatMessage } from "@/apis/AiIAAPI"; // Adjust the import path as necessary
import EnglishLanguageGenerativeResult from "./EnglishLanguageGenerativeResult";
import EnglishLiteratureGenerativeResult from "./EnglishLiteratureGenerativeResult";
import EnglishLanguageEvaluateResult from "./EnglishLanguageEvaluateResult";
import EnglishLiteratureEvaluateResult from "./EnglishLiteratureEvaluateResult";
import styles from "./AICoaching.module.css";
import ChatOption from "./ChatOption";
import { useUserInfo } from "@/store/user";

const AICoaching = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [iaTopics, setIaTopics] = useState([]); // 최신 IA 토픽(객체 배열) 저장
    const [pendingTopicTitle, setPendingTopicTitle] = useState(null); // 사용자가 선택한 후보 타이틀
    const [expandedTopics, setExpandedTopics] = useState({}); // { [index]: boolean }
    const [lastInterest, setLastInterest] = useState("");
    const [resetKey, setResetKey] = useState(0);
    const [englishTextType, setEnglishTextType] = useState(null); // "Literature" | "Language"
    const [englishMode, setEnglishMode] = useState(null); // "generative" | "evaluative"
    const [englishGenData, setEnglishGenData] = useState(null);
    const [englishLoading, setEnglishLoading] = useState(false);
    const [awaitingFinalTopic, setAwaitingFinalTopic] = useState(false); // 최종 주제 확정 입력 대기
    const [isComposing, setIsComposing] = useState(false);

    const chatBoxRef = useRef(null);
    const latestInterestRef = useRef("");
    const bottomRef = useRef(null);
    const isInitialRender = useRef(true);
    const router = useRouter();
    const { userInfo } = useUserInfo();

    const getErrorMessage = (error, fallbackMessage) =>
        error?.response?.data?.message || error?.message || fallbackMessage;

    // === Callbacks for restarting English flows (Language track) ===
    const restartEnglishWith = (modeKey /* "generative" | "evaluative" */) => {
        // Fix subject and text type for English flow
        setSelectedSubject(ENGLISH_SUBJECT);
        setEnglishTextType("Language");
        setEnglishMode(modeKey);

        // Reset states related to results/topics/inputs
        setEnglishGenData(null);
        setIaTopics([]);
        setExpandedTopics({});
        setPendingTopicTitle(null);
        setMessage("");

        // Compose guide message by mode
        const guideMsg =
            modeKey === "generative"
                ? "분석하고 싶은 텍스트와 주제를 입력해 주세요 (예: Hamlet의 도덕적 갈등)."
                : "평가받고 싶은 연구 질문을 그대로 입력해 주세요 (예: How does… / To what extent…).";

        // Reset chat messages to minimal prompts for the chosen mode
        setMessages([
            { sender: "bot", text: "Langauge A English · Language 모드로 다시 시작합니다." },
            { sender: "bot", text: guideMsg },
        ]);
    };

    const initConversation = () => {
        const intro = {
            sender: "bot",
            text: "안녕하세요! 저는 IA를 도와드리는 AI 코치입니다. 우선 과목을 선택해 주세요.",
        };
        const subjectOptions = {
            sender: "bot",
            options: subjects,
        };
        setMessages([intro, subjectOptions]);
        setSelectedSubject(null);
        setIaTopics([]);
        setPendingTopicTitle(null);
        setExpandedTopics({});
        setLastInterest("");
        setEnglishTextType(null);
        setEnglishMode(null);
        setMessage("");
        latestInterestRef.current = "";
        setEnglishGenData(null);
        // scroll to top
        if (chatBoxRef.current) chatBoxRef.current.scrollTop = 0;
    };

    const resetConversation = () => {
        const confirmed = typeof window !== "undefined" ? window.confirm("정말 대화를 초기화하시겠습니까?") : true;
        if (!confirmed) return;
        initConversation();
        setEnglishGenData(null);
        setResetKey((k) => k + 1); // 강제 리렌더링으로 상태 완전 초기화
    };

    const toggleExpand = (idx) => {
        setExpandedTopics((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };
    // 주제 전체 객체(ia_topic)를 그대로 백엔드에 전달
    const onPickTopic = async (topic) => {
        const picked = topic || null;
        if (!picked) return;
        setPendingTopicTitle(picked.title);
        // 사용자 액션 표시 및 생성 안내
        setMessages(prev => [
            ...prev,
            { sender: "user", text: picked.title },
            { sender: "bot", text: "가이드를 생성하고 있습니다..." }
        ]);
        try {
            const interestForGuide = latestInterestRef.current || lastInterest || "";
            // createGuide는 이제 가이드 "객체 전체"를 반환한다고 가정
            const guideData = await createGuide({
                subject: selectedSubject,
                interestTopic: interestForGuide,   // camelCase for some backends
                interest_topic: interestForGuide,  // snake_case for others
                topic: picked,                     // send entire ia_topic object
                session: userInfo,
            });

            if (!guideData || typeof guideData !== "object") {
                setMessages(prev => [
                    ...prev,
                    { sender: "bot", text: "가이드 데이터를 받지 못했습니다. 잠시 후 다시 시도해 주세요." }
                ]);
                return;
            }

            // 세션 스토리지에 동적 가이드 데이터 저장 후 뷰 페이지로 이동
            try {
                if (typeof window !== "undefined" && window.sessionStorage) {
                    window.sessionStorage.setItem(
                        "ai_coaching_guide_payload",
                        JSON.stringify({
                            ...guideData,
                            __meta: {
                                subject: selectedSubject,
                                interestTopic: interestForGuide,
                                topicTitle: picked.title,
                                createdAt: new Date().toISOString(),
                            },
                        })
                    );
                }
            } catch (ssErr) {
                console.warn("sessionStorage 저장 실패:", ssErr);
            }

            // 동적 가이드 뷰 페이지로 이동 (해당 페이지에서 sessionStorage 데이터를 읽어 렌더링)
            router.push(`/aitools/coaching/form`);
        } catch (e) {
            console.error("가이드 생성 실패:", e);
            setMessages(prev => [
                ...prev,
                { sender: "bot", text: getErrorMessage(e, "가이드 생성에 실패했습니다. 다시 시도해 주세요.") }
            ]);
        }
    };

    const handleRefetchTopics = async () => {
        if (!selectedSubject || !lastInterest) return;
        // 사용자 액션 메시지 및 진행 안내
        setMessages(prev => [
            ...prev,
            { sender: "user", text: "🔄 새로 추천받기" },
            {
                sender: "bot",
                text: `같은 subject(${selectedSubject})와 관심 주제("${lastInterest}")로 새 추천을 생성 중...`
            }
        ]);
        try {
            const data = await fetchRecommendedTopics(selectedSubject, lastInterest, userInfo);
            const topicsArray = data?.ia_topics;
            if (Array.isArray(topicsArray) && topicsArray.length > 0) {
                setIaTopics(topicsArray);
                setExpandedTopics({});
                setMessages(prev => [
                    ...prev,
                    {
                        sender: "bot",
                        text: `새로 추천된 IA 토픽 목록이에요 (subject: ${data.subject}, interest: ${data.interest_topic}).`,
                        topicList: topicsArray
                    }
                ]);
            } else if (data?.raw) {
                setMessages(prev => [
                    ...prev,
                    {
                        sender: "bot",
                        text: `받은 응답을 해석할 수 없어요. 관리자에게 문의해주세요.\n\n원문:\n${data.raw}`
                    }
                ]);
            } else {
                setMessages(prev => [
                    ...prev,
                    { sender: "bot", text: "새로운 토픽을 찾지 못했어요. 관심 주제를 바꿔 다시 시도해 주세요." }
                ]);
            }
        } catch (err) {
            console.error("재추천 요청 실패:", err);
            setMessages(prev => [
                ...prev,
                { sender: "bot", text: getErrorMessage(err, "새 추천을 가져오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.") }
            ]);
        }
    };

    useEffect(() => {
        initConversation();
    }, []);

    useEffect(() => {
        if (!chatBoxRef.current) return;
        // First render: jump directly to bottom without smooth animation
        if (isInitialRender.current) {
            isInitialRender.current = false;
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            return;
        }
        // Subsequent updates: smoothly scroll to the bottom sentinel
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        } else {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages, resetKey]);

    const handleOptionSelect = (option) => {
        // IA 토픽 확정/재선택 처리 (공통)
        if (option === "✅ 이 주제로 진행") {
            const chosen = iaTopics.find(t => t.title === pendingTopicTitle);
            setMessages(prev => [
                ...prev,
                { sender: "user", text: option },
                {
                    sender: "bot",
                    text: `좋아요! "${chosen?.title}" 주제로 진행할게요.\n\n요약: ${chosen?.description}`
                }
            ]);
            setPendingTopicTitle(null);
            return;
        }
        if (option === "🔁 토픽 다시 고르기") {
            setMessages(prev => [
                ...prev,
                { sender: "user", text: option },
                {
                    sender: "bot",
                    text: "다음 중에서 토픽을 선택해 주세요!",
                    topicList: iaTopics
                }
            ]);
            setPendingTopicTitle(null);
            return;
        }
        if (option === "🔁 다시 선택하기") {
            setSelectedSubject(null);
            setEnglishTextType(null);
            setEnglishMode(null);
            const intro = {
                sender: "bot",
                text: "새로운 과목을 다시 선택해 주세요!",
            };
            const subjectOptions = {
                sender: "bot",
                options: subjects,
            };
            setMessages(prev => [...prev, intro, subjectOptions]);
            return;
        }
        if (option === "✨ 주제 추천받기") {
            if (selectedSubject) {
                router.push(`/aitools/coaching/recommend?subject=${encodeURIComponent(selectedSubject)}`);
            }
            return;
        }

        // 1) 과목 선택
        if (!selectedSubject && subjects.includes(option)) {
            setSelectedSubject(option);
            if (option === ENGLISH_SUBJECT) {
                // 영어 과목 전용: Step 2로 텍스트 유형 선택
                setIaTopics([]);
                setExpandedTopics({});
                setPendingTopicTitle(null);
                setEnglishTextType(null);
                setEnglishMode(null);
                setMessages(prev => [
                    ...prev,
                    { text: option, sender: "user" },
                    {
                        sender: "bot",
                        text: `좋아요! ${option} 과목을 선택하셨습니다. 어떤 텍스트 유형으로 작업하시나요?`,
                    },
                    {
                        sender: "bot",
                        options: ENGLISH_TEXT_TYPES,
                    }
                ]);
            } else {
                // 다른 과목: 기존 플로우 유지
                setMessages(prev => [
                    ...prev,
                    { text: option, sender: "user" },
                    {
                        sender: "bot",
                        text: `${option} 과목을 선택하셨군요!`,
                    },
                    {
                        sender: "bot",
                        text: "이제 관심 있는 주제를 입력해 주세요!"
                    }
                ]);
            }
            return;
        }

        // 2) (English 전용) 텍스트 유형 선택
        if (selectedSubject === ENGLISH_SUBJECT && !englishTextType && ENGLISH_TEXT_TYPES.includes(option)) {
            setEnglishTextType(option);
            setMessages(prev => [
                ...prev,
                { sender: "user", text: option },
                {
                    sender: "bot",
                    text: "어떤 도움이 필요하신가요?",
                },
                {
                    sender: "bot",
                    options: ENGLISH_MODES.map(m => m.label),
                }
            ]);
            return;
        }

        // 3) (English 전용) 모드 선택
        if (selectedSubject === ENGLISH_SUBJECT && englishTextType && !englishMode) {
            const pickedMode = ENGLISH_MODES.find(m => m.label === option);
            if (pickedMode) {
                setEnglishMode(pickedMode.key);
                setMessages(prev => [
                    ...prev,
                    { sender: "user", text: option },
                    {
                        sender: "bot",
                        text: pickedMode.key === "generative"
                            ? "분석하고 싶은 텍스트와 주제를 입력해 주세요 (예: Hamlet의 도덕적 갈등)."
                            : "평가받고 싶은 연구 질문을 그대로 입력해 주세요 (예: How does Shakespeare use language in Hamlet?)."
                    }
                ]);
                return;
            }
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() === "") return;
        const userInput = message;
        // 최종 주제 확정 단계: 입력 즉시 드래프트 페이지로 이동
        if (awaitingFinalTopic && selectedSubject === ENGLISH_SUBJECT && englishTextType) {
            const finalInput = userInput;

            // Path A: Generative → Evaluate the user's final topic and render result (no navigation yet)
            if (englishMode === "generative") {
                setMessages(prev => [
                    ...prev,
                    { sender: "user", text: finalInput },
                    { sender: "bot", text: "입력하신 주제를 Evaluate 모드로 평가 중입니다..." }
                ]);
                setMessage("");
                setEnglishLoading(true);
                try {
                    const evalData = await postEnglishChatMessage({
                        prompt: finalInput,
                        subject: ENGLISH_SUBJECT,
                        textType: englishTextType,
                        responseMode: "evaluate",
                        session: userInfo
                    });
                    if (evalData && evalData.response_mode === "evaluative_feedback") {
                        const evalType = englishTextType === "Literature" ? "english_lit_eval" : "english_lang_eval";
                        setMessages(prev => [
                            ...prev,
                            { type: evalType, payload: evalData }
                        ]);
                        // 이제 다음 입력은 드래프트 생성 트리거
                        setEnglishMode("evaluate");
                        setAwaitingFinalTopic(true);
                        setMessages(prev => ([
                            ...prev,
                            { sender: "bot", text: "이 평가를 반영해 최종 주제를 확정해 주세요." },
                            { sender: "bot", text: "확정한 주제를 입력하시면 드래프트를 생성합니다." }
                        ]));
                    } else {
                        const reply = evalData?.reply || "평가 결과를 해석할 수 없습니다.";
                        setMessages(prev => [...prev, { sender: "bot", text: reply }]);
                        setAwaitingFinalTopic(false);
                    }
                } catch (err) {
                    console.error("Evaluate 호출 실패:", err);
                    setMessages(prev => [
                        ...prev,
                        { sender: "bot", text: getErrorMessage(err, "평가 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.") }
                    ]);
                    setAwaitingFinalTopic(false);
                } finally {
                    setEnglishLoading(false);
                }
                return;
            }

            // Path B: Evaluate 모드에서 최종 입력 → 가이드(드래프트) 생성(onPickTopic 재사용)
            if (englishMode === "evaluate") {
                setMessage("");
                setAwaitingFinalTopic(false);
                // onPickTopic은 ia_topic 객체를 기대하므로 최소 구조로 래핑
                onPickTopic({ title: finalInput, description: "" });
                return;
            }
        }
        // === English subject dedicated chat flow ===
        if (selectedSubject === ENGLISH_SUBJECT) {
            if (!englishTextType) {
                setMessages(prev => [...prev, { sender: "bot", text: "먼저 텍스트 유형(Literature/Language)을 선택해 주세요." }]);
                return;
            }
            if (!englishMode) {
                setMessages(prev => [...prev, { sender: "bot", text: "먼저 모드(Generative/Evaluative)를 선택해 주세요." }]);
                return;
            }
            setMessages(prev => [
                ...prev,
                { sender: "user", text: userInput }
            ]);
            setMessage("");
            setEnglishLoading(true);
            try {
                const data = await postEnglishChatMessage({
                    prompt: userInput,
                    subject: ENGLISH_SUBJECT,
                    textType: englishTextType,
                    responseMode: englishMode,
                    session: userInfo
                });
                if (!data) {
                    setMessages(prev => [
                        ...prev,
                        { sender: "bot", text: "응답을 받지 못했습니다. 잠시 후 다시 시도해 주세요." }
                    ]);
                    setEnglishLoading(false);
                    return;
                }

                if (data.response_mode === "generative") {
                    // 텍스트 유형에 따라 다른 컴포넌트로 렌더링
                    const guideType = englishTextType === "Literature" ? "english_lit_guide" : "english_lang_guide";
                    setMessages(prev => [
                        ...prev,
                        { type: guideType, payload: data }
                    ]);
                    setEnglishGenData(null);
                    setEnglishLoading(false);
                    return;
                }

                if (data.response_mode === "evaluative_feedback") {
                    // Evaluate 렌더링 (Language / Literature 분기)
                    const evalType = englishTextType === "Literature" ? "english_lit_eval" : "english_lang_eval";
                    setMessages(prev => [
                        ...prev,
                        { type: evalType, payload: data }
                    ]);
                    setEnglishLoading(false);
                    return;
                }

                // Fallback 텍스트 응답
                const reply = data?.reply || data?.message || "응답을 해석할 수 없습니다.";
                setMessages(prev => [
                    ...prev,
                    { sender: "bot", text: reply }
                ]);
                setEnglishLoading(false);
            } catch (err) {
                console.error("English chat error:", err);
                setMessages(prev => [
                    ...prev,
                    { sender: "bot", text: getErrorMessage(err, "영어 과목 전용 채팅 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.") }
                ]);
                setEnglishLoading(false);
            }
            return;
        }
        setLastInterest(userInput);
        latestInterestRef.current = userInput;
        setMessages(prev => [
            ...prev,
            { text: userInput, sender: "user" },
            {
                sender: "bot",
                text: `좋아요! "${userInput}" 주제로 토픽을 생성하고 있습니다...`
            }
        ]);
        setMessage("");

        try {

            const data = await fetchRecommendedTopics(
                selectedSubject,
                userInput,
                userInfo
            );
            console.log("토픽 추천 결과:", data);

            // 백엔드가 Map 형태로 내려주는 객체를 기대: { subject, interest_topic, ia_topics: [...] }
            const topicsArray = data?.ia_topics;
            if (Array.isArray(topicsArray) && topicsArray.length > 0) {
                setIaTopics(topicsArray);
                setExpandedTopics({}); // reset expand states
                setMessages(prev => [
                    ...prev,
                    {
                        sender: "bot",
                        text: `추천된 IA 토픽 목록이에요 (subject: ${data.subject}, interest: ${data.interest_topic}).\n원하는 토픽을 선택해 주세요!`,
                        topicList: topicsArray
                    }
                ]);
            } else if (data?.raw) {
                // 파싱 실패하여 raw가 왔을 때 표시
                setMessages(prev => [
                    ...prev,
                    {
                        sender: "bot",
                        text: `받은 응답을 해석할 수 없어요. 관리자에게 문의해주세요.\n\n원문:\n${data.raw}`
                    }
                ]);
            } else {
                setMessages(prev => [
                    ...prev,
                    { sender: "bot", text: "토픽을 찾지 못했어요. 관심 주제를 바꿔 다시 시도해 주세요." }
                ]);
            }
        } catch (error) {
            console.error("토픽 요청 실패:", error);
            setMessages(prev => [
                ...prev,
                { sender: "bot", text: getErrorMessage(error, "토픽을 생성하는 데 실패했습니다. 다시 시도해 주세요.") }
            ]);
        }
    };

    const handleKeyPress = (e) => {
        // Ignore Enter key while IME (e.g., Korean) composition is ongoing
        const composing = isComposing || e.nativeEvent.isComposing || e.keyCode === 229;
        if (e.key === "Enter" && !composing) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // 문자열 안의 URL을 자동으로 링크 처리
    const renderWithLinks = (str) => {
        if (typeof str !== "string") return String(str);
        const parts = str.split(/(https?:\/\/\S+)/g);
        return parts.map((part, i) => {
            if (/^https?:\/\/\S+/.test(part)) {
                return (
                    <a key={`url-${i}`} href={part} target="_blank" rel="noreferrer">
                        {part}
                    </a>
                );
            }
            return <span key={`txt-${i}`}>{part}</span>;
        });
    };

    return (
        <main className={styles.container}>
            <section className={styles.introSection}>
                <h1 className={styles.title}>AI IA/EE 코칭</h1>
                <p className={styles.description}>
                    IA/EE 과목과 주제를 선정하고 아웃라인을 함께 짜보세요!
                </p>
            </section>

            <section className={styles.chatSection}>
                <div className={styles.chatBox} ref={chatBoxRef}>
                    {messages.map((msg, index) => {
                        // 영어 가이드 카드 렌더링 (Language / Literature 분기)
                        if ((msg.type === "english_lang_guide" || msg.type === "english_lit_guide") && msg.payload) {
                            const isLiterature = msg.type === "english_lit_guide";
                            const GuideComponent = isLiterature ? EnglishLiteratureGenerativeResult : EnglishLanguageGenerativeResult;
                            return (
                                <div className={styles.topicList} key={`guide-${resetKey}-${index}`}>
                                    <GuideComponent
                                        data={msg.payload}
                                        onReset={resetConversation}
                                        onEnterTopic={() => {
                                            // Generative → 사용자 입력을 Evaluate 모드로 평가하도록 유도
                                            setAwaitingFinalTopic(true);
                                            setMessages(prev => ([
                                                ...prev,
                                                { sender: "bot", text: "가이드를 바탕으로 ✅ 최종 주제를 한 줄로 입력해 주세요." },
                                                { sender: "bot", text: "입력하시면 Evaluate 모드로 바로 평가 결과를 보여드릴게요." }
                                            ]));
                                            setMessage("");
                                        }}
                                    />
                                </div>
                            );
                        }

                        // Render English Language · Evaluate result
                        if (msg.type === "english_lang_eval" && msg.payload) {
                            return (
                                <div className={styles.topicList} key={`eval-${resetKey}-${index}`}>
                                    <EnglishLanguageEvaluateResult
                                        data={msg.payload}
                                        onReset={resetConversation}
                                        onCreateDraft={() => {
                                            const finalTopic = msg.payload?.student_question || "";
                                            if (!finalTopic) {
                                                setMessages(prev => [
                                                    ...prev,
                                                    { sender: "bot", text: "최종 질문을 확인할 수 없습니다. 다시 시도해 주세요." }
                                                ]);
                                                return;
                                            }
                                            setMessages(prev => [
                                                ...prev,
                                                { sender: "bot", text: "해당 질문으로 Draft 생성을 시작합니다." }
                                            ]);
                                            setAwaitingFinalTopic(false);
                                            onPickTopic({ title: finalTopic, description: "" });
                                        }}
                                    />
                                </div>
                            );
                        }

                        // Render English Literature · Evaluate result
                        if (msg.type === "english_lit_eval" && msg.payload) {
                            return (
                                <div className={styles.topicList} key={`eval-lit-${resetKey}-${index}`}>
                                    <EnglishLiteratureEvaluateResult
                                        data={msg.payload}
                                        onReset={resetConversation}
                                        onCreateDraft={() => {
                                            const finalTopic = msg.payload?.student_question || "";
                                            if (!finalTopic) {
                                                setMessages(prev => [
                                                    ...prev,
                                                    { sender: "bot", text: "최종 질문을 확인할 수 없습니다. 다시 시도해 주세요." }
                                                ]);
                                                return;
                                            }
                                            setMessages(prev => [
                                                ...prev,
                                                { sender: "bot", text: "해당 질문으로 Draft 생성을 시작합니다." }
                                            ]);
                                            setAwaitingFinalTopic(false);
                                            onPickTopic({ title: finalTopic, description: "" });
                                        }}
                                    />
                                </div>
                            );
                        }

                        // ➋ 기본 말풍선 렌더 (기존 로직 유지)
                        return (
                            <div
                                key={index}
                                className={msg.sender === "user" ? styles.chatMessageUser : styles.chatMessageBot}
                            >
                                {msg.text}

                                {msg.options && (
                                    <ChatOption
                                        key={`chatopts-${resetKey}-${index}`}
                                        options={msg.options}
                                        onSelect={handleOptionSelect}
                                    />
                                )}

                                {msg.topicList && Array.isArray(msg.topicList) && (
                                    <>
                                        <div className={styles.topicList} key={`topics-${resetKey}`}>
                                            {msg.topicList.map((t, idx) => (
                                                <div key={idx} className={styles.topicItem}>
                                                    <button
                                                        type="button"
                                                        className={styles.topicTitleBtn}
                                                        onClick={() => onPickTopic(t)}
                                                    >
                                                        {t.title}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={styles.expandBtn}
                                                        onClick={() => toggleExpand(idx)}
                                                    >
                                                        {expandedTopics[idx] ? "접기" : "펼치기"}
                                                    </button>

                                                    {expandedTopics[idx] && (
                                                        <div className={styles.topicDesc}>
                                                            {t.description && (
                                                                <div className={styles.topicMeta}>
                                                                    {typeof t.description === "string"
                                                                        ? t.description
                                                                        : JSON.stringify(t.description)}
                                                                </div>
                                                            )}
                                                            <div className={styles.topicMeta}>
                                                                {Object.entries(t)
                                                                    .filter(([k]) => k && k.toLowerCase() !== "title" && k.toLowerCase() !== "description")
                                                                    .map(([k, v], metaIdx) => (
                                                                        <div key={`meta-${idx}-${metaIdx}`} className={styles.topicMetaRow}>
                                                                            <div className={styles.topicMetaKey}>{k}</div>
                                                                            <div className={styles.topicMetaValue}>
                                                                                {typeof v === "string"
                                                                                    ? renderWithLinks(v)
                                                                                    : Array.isArray(v)
                                                                                        ? v.map((item, ii) => (
                                                                                            <div key={`val-${ii}`}>
                                                                                                {typeof item === "string" ? renderWithLinks(item) : JSON.stringify(item)}
                                                                                            </div>
                                                                                        ))
                                                                                        : JSON.stringify(v)}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className={styles.topicListActions}>
                                            <button
                                                type="button"
                                                className={styles.refreshBtn}
                                                onClick={handleRefetchTopics}
                                                disabled={!selectedSubject || !lastInterest}
                                                title={!selectedSubject || !lastInterest ? "과목과 관심 주제를 먼저 입력하세요" : "같은 조건으로 새로운 추천 받기"}
                                            >
                                                🔄 새로 추천받기
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                    {englishLoading && (<div className={styles.chatMessageBot}>⏳ 영어 응답을 생성 중입니다...</div>)}
                    <div ref={bottomRef} />
                </div>
                <div className={styles.inputArea}>
                    <input
                        type="text"
                        placeholder="원하는 주제를 입력하세요..."
                        className={styles.chatInput}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={() => setIsComposing(false)}
                    />
                    <button className={styles.sendButton} onClick={handleSendMessage}>전송</button>
                    <div className={styles.resetRow}>
                        <button
                            type="button"
                            className={styles.resetBtn}
                            onClick={resetConversation}
                            title="대화를 처음 상태로 초기화합니다"
                        >
                            🧹 초기화
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AICoaching;
