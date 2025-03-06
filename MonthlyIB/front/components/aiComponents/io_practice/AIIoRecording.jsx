"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useIOStore } from "@/store/AIIostore";
import styles from "./AIIoRecording.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

const AIIoRecording = () => {
    const router = useRouter();
    const { iocTopic, workTitle, author, scriptFile } = useIOStore();

    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10분 타이머
    const [feedback, setFeedback] = useState("");
    const [preview, setPreview] = useState(null); // 대본 미리보기 콘텐츠

    // 녹음 관련 상태
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audioBlob, setAudioBlob] = useState(null);

    const audioRef = useRef(null); // 녹음 파일 재생을 위한 ref

    // 녹음 시작: 사용자 권한 요청 및 MediaRecorder 초기화
    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            setAudioChunks([]);

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    setAudioChunks((prev) => [...prev, e.data]);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(audioChunks, { type: "audio/webm" });
                setAudioBlob(blob);
                // 재생을 위해 URL 생성
                if (audioRef.current) {
                    audioRef.current.src = URL.createObjectURL(blob);
                }
            };

            recorder.start();
            setIsRecording(true);
        } catch (err) {
            alert("마이크 접근 권한이 필요합니다.");
            console.error(err);
        }
    };

    // 녹음 중단: MediaRecorder 종료
    const handleStopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    // 피드백 받기
    const handleGetFeedback = () => {
        setFeedback("AI가 분석한 피드백 내용이 표시됩니다. 문장별 개선점, 표현 방법 제안 등...");
    };

    // 대본 미리보기 토글 함수
    const toggleScriptPreview = () => {
        if (!scriptFile) {
            alert("등록된 대본 파일이 없습니다.");
            return;
        }

        if (preview) {
            // 이미 미리보기가 열려 있다면 숨김
            setPreview(null);
        } else {
            const fileName = scriptFile.name.toLowerCase();
            const blobUrl = URL.createObjectURL(scriptFile);

            if (fileName.endsWith('.pdf')) {
                // PDF는 embed 태그를 이용해 미리보기
                setPreview(
                    <div className={styles.previewContainer}>
                        <embed src={blobUrl} type="application/pdf" className={styles.embedPdf} />
                    </div>
                );
            } else if (fileName.endsWith('.txt')) {
                // TXT는 FileReader를 사용해 읽은 텍스트를 미리보기
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreview(
                        <div className={styles.previewContainer}>
                            <pre className={styles.previewText}>{e.target.result}</pre>
                        </div>
                    );
                };
                reader.readAsText(scriptFile, "UTF-8");
            } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
                // DOC/DOCX는 미리보기가 지원되지 않으므로 다운로드 안내
                setPreview(
                    <div className={styles.previewContainer}>
                        <p>DOC/DOCX 파일은 미리보기가 지원되지 않습니다.</p>
                        <a href={blobUrl} download={scriptFile.name} className={styles.downloadLink}>
                            다운로드
                        </a>
                    </div>
                );
            } else {
                alert("지원되지 않는 파일 형식입니다.");
            }
        }
    };

    // 타이머 로직
    useEffect(() => {
        let timerId;
        if (isRecording && timeLeft > 0) {
            timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timerId);
    }, [isRecording, timeLeft]);

    // 시간 포맷팅
    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    return (
        <main className={styles.container}>
            {/* 1) 인트로 섹션 */}
            <section className={styles.introSection}>
                <h1 className={styles.title}>AI IO 말하기 연습 / 녹음</h1>
                <p className={styles.description}>
                    마이크 아이콘을 눌러 녹음을 시작하고, 타이머가 0이 되기 전에 녹음을 종료하세요.
                </p>
            </section>

            {/* 2) 정보영역 */}
            <section className={styles.infoSection}>
                <h2 className={styles.infoTitle}>정보</h2>
                <div className={styles.infoRow}>
                    <span>IOC 주제:</span>
                    <strong>{iocTopic}</strong>
                </div>
                <div className={styles.infoRow}>
                    <span>작품 제목:</span>
                    <strong>{workTitle}</strong>
                </div>
                <div className={styles.infoRow}>
                    <span>작가:</span>
                    <strong>{author}</strong>
                </div>
                <div className={styles.infoRow}>
                    <span>대본 파일:</span>
                    <strong>{scriptFile?.name}</strong>
                </div>
                <button className={styles.viewScriptButton} onClick={toggleScriptPreview}>
                    {preview ? "대본 숨기기" : "대본 보기"}
                </button>
            </section>

            {/* 5) 대본 미리보기 영역 */}
            {preview && (
                <section className={styles.previewSection}>
                    <h2 className={styles.previewTitle}>대본 미리보기</h2>
                    {preview}
                </section>
            )}

            {/* 3) 녹음 인터페이스 */}
            <section className={styles.recordSection}>
                <div className={styles.timer}>{formatTime(timeLeft)}</div>
                {!isRecording ? (
                    <button className={styles.recordButton} onClick={handleStartRecording}>
                        <FontAwesomeIcon icon={faMicrophone} className={styles.icon} />
                        녹음 시작
                    </button>
                ) : (
                    <button className={styles.stopButton} onClick={handleStopRecording}>
                        녹음 중단
                    </button>
                )}
                <button className={styles.feedbackButton} onClick={handleGetFeedback}>
                    피드백 받기
                </button>
            </section>

            {/* 오디오 미리보기 (녹음된 파일 재생) */}
            {audioBlob && (
                <section className={styles.audioSection}>
                    <h2 className={styles.audioTitle}>녹음 파일 미리보기</h2>
                    <audio controls ref={audioRef} className={styles.audioPlayer} />
                </section>
            )}

            {/* 4) 피드백 섹션 */}
            {feedback && (
                <section className={styles.feedbackSection}>
                    <h2 className={styles.feedbackTitle}>피드백 요약</h2>
                    <p className={styles.feedbackContent}>{feedback}</p>
                    <button className={styles.tutorButton} onClick={() => alert("튜터에게 전송")}>
                        튜터에게 보내고 레슨 잡기
                    </button>
                </section>
            )}
        </main>
    );
};

export default AIIoRecording;