"use client";

import { useState, useRef, useEffect } from "react";
import { chapterOptions } from "@/components/aiComponents/chapterOptions";
import styles from "./AICoaching.module.css";
import ChatOption from "./ChatOption";

const AICoaching = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedSubject, setSelectedSubject] = useState(null);
    const chatBoxRef = useRef(null);

    useEffect(() => {
        const intro = {
            sender: "bot",
            text: "안녕하세요! 저는 IA를 도와드리는 AI 코치입니다. 우선 과목을 선택해 주세요.",
        };
        const subjectOptions = {
            sender: "bot",
            options: Object.keys(chapterOptions),
        };
        setMessages([intro, subjectOptions]);
    }, []);

    const handleOptionSelect = (option) => {
        if (option === "🔁 다시 선택하기") {
            setSelectedSubject(null);
            const intro = {
                sender: "bot",
                text: "새로운 과목을 다시 선택해 주세요!",
            };
            const subjectOptions = {
                sender: "bot",
                options: Object.keys(chapterOptions),
            };
            setMessages(prev => [...prev, intro, subjectOptions]);
            return;
        }
        if (!selectedSubject && chapterOptions[option]) {
            // Subject selected
            setMessages(prev => [
                ...prev,
                { text: option, sender: "user" },
                {
                    sender: "bot",
                    text: `${option} 과목을 선택하셨군요! 챕터를 골라주세요.`,
                },
                {
                    sender: "bot",
                    options: chapterOptions[option],
                }
            ]);
            setSelectedSubject(option);
        } else if (selectedSubject) {
            // Chapter selected
            setMessages(prev => [
                ...prev,
                { text: option, sender: "user" },
                {
                    sender: "bot",
                    text: `"${selectedSubject}" 과목의 "${option}" 챕터를 선택하셨습니다.`,
                },
                {
                    sender: "bot",
                    options: ["🔁 다시 선택하기", "✨ 주제 추천받기", "✍️ 바로 입력하기"]
                }
            ]);
        }
    };

    const handleSendMessage = () => {
        if (message.trim() === "") return;
        const newMessage = { text: message, sender: "user" };
        setMessages(prev => [...prev, newMessage]);
        setMessage("");
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
                                    options={msg.options}
                                    onSelect={handleOptionSelect}
                                />
                            )}
                        </div>
                    ))}
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
                </div>
            </section>
        </main>
    );
};

export default AICoaching;