"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { chapterOptions } from "@/components/aiComponents/chapterOptions";
const subjects = ["Science", "Math", "Langauge A English", "Psychology", "Business", "History", "Geography", "Economics"];
import {fetchRecommendedTopics} from "@/apis/AiIAAPI"; // Adjust the import path as necessary
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
        setMessage("");
        // scroll to top
        if (chatBoxRef.current) chatBoxRef.current.scrollTop = 0;
    };

    const resetConversation = () => {
        const confirmed = typeof window !== "undefined" ? window.confirm("정말 대화를 초기화하시겠습니까?") : true;
        if (!confirmed) return;
        initConversation();
        setResetKey((k) => k + 1); // 강제 리렌더링으로 상태 완전 초기화
    };

    const toggleExpand = (idx) => {
        setExpandedTopics((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };
    const onPickTopic = (title) => {
        const picked = iaTopics.find(t => t.title === title);
        if (!picked) return;
        setPendingTopicTitle(title);
        setMessages(prev => [
            ...prev,
            { sender: "user", text: title },
            {
                sender: "bot",
                text: `선택한 주제의 상세 설명입니다:\n\n${picked.description}`
            },
            {
                sender: "bot",
                text: "이 주제로 진행할까요?",
                options: ["✅ 이 주제로 진행", "🔁 토픽 다시 고르기"]
            }
        ]);
    };
    // const [selectedChapter, setSelectedChapter] = useState(null);
    const chatBoxRef = useRef(null);
    const bottomRef = useRef(null);
    const isInitialRender = useRef(true);
    const router = useRouter();
    const { userInfo } = useUserInfo();

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
                { sender: "bot", text: "새 추천을 가져오는 데 실패했습니다. 잠시 후 다시 시도해 주세요." }
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
        // IA 토픽 확정/재선택 처리
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
            // 동일한 리스트 다시 표시
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

        if (!selectedSubject && subjects.includes(option)) {
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
            setSelectedSubject(option);
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() === "") return;
        const userInput = message;
        setLastInterest(userInput);
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
                { sender: "bot", text: "토픽을 생성하는 데 실패했습니다. 다시 시도해 주세요." }
            ]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSendMessage();
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
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={
                                msg.sender === "user"
                                    ? styles.chatMessageUser
                                    : styles.chatMessageBot
                            }
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
                                                onClick={() => onPickTopic(t.title)}
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
                                                    {t.description}
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
                    ))}
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