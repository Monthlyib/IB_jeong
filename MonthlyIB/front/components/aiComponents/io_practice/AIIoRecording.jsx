"use client";

import { useState, useEffect, useRef } from "react";
import { useIOStore } from "@/store/AIIostore";
import styles from "./AIIoRecording.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { useUserInfo } from "@/store/user";


const AIIoRecording = () => {
    const RECOMMENDED_DURATION_SECONDS = 600;
    const { iocTopic, workTitle, author, scriptFile, sendFeedbackRequest } = useIOStore();

    const [isRecording, setIsRecording] = useState(false);
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [preview, setPreview] = useState(null); // 대본 미리보기 콘텐츠
    const { userInfo } = useUserInfo();
    const [loading, setLoading] = useState(false);

    // 녹음 관련 상태
    const [audioBlob, setAudioBlob] = useState(null);
    const [isFinished, setIsFinished] = useState(false);

    const audioRef = useRef(null); // 녹음 파일 재생을 위한 ref
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioUrlRef = useRef(null);

    const revokeAudioPreviewUrl = () => {
        if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioUrlRef.current = null;
        }
    };

    const stopMicrophoneTracks = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    };

    const syncAudioPreview = (blob) => {
        if (!blob || !audioRef.current) return;
        revokeAudioPreviewUrl();
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        audioRef.current.src = url;
        audioRef.current.load();
    };

    const finalizeRecording = () => {
        if (audioChunksRef.current.length === 0) {
            setAudioBlob(null);
            setIsFinished(false);
            return;
        }

        const mimeType = audioChunksRef.current[0]?.type || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setIsFinished(true);
        syncAudioPreview(blob);
    };

    // 녹음 시작: 사용자 권한 요청 및 MediaRecorder 초기화
    const handleStartRecording = async () => {
        try {
            revokeAudioPreviewUrl();
            setAudioBlob(null);
            setFeedback("");
            setIsFinished(false);
            setRecordingSeconds(0);
            audioChunksRef.current = [];

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });

            const recorderOptions = {};
            if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
                recorderOptions.mimeType = "audio/webm;codecs=opus";
            } else if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm")) {
                recorderOptions.mimeType = "audio/webm";
            }

            const recorder = new MediaRecorder(stream, recorderOptions);
            streamRef.current = stream;
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                finalizeRecording();
                stopMicrophoneTracks();
                mediaRecorderRef.current = null;
                setIsRecording(false);
            };

            recorder.onerror = (event) => {
                console.error("녹음 오류:", event.error);
                alert("녹음 중 오류가 발생했습니다. 다시 시도해 주세요.");
                stopMicrophoneTracks();
                mediaRecorderRef.current = null;
                setIsRecording(false);
            };

            recorder.start(1000);
            setIsRecording(true);
        } catch (err) {
            alert("마이크 접근 권한이 필요합니다.");
            console.error(err);
        }
    };

    // 녹음 중단: MediaRecorder 종료
    const handleStopRecording = () => {
        const recorder = mediaRecorderRef.current;
        if (recorder && recorder.state !== "inactive") {
            recorder.stop();
            return;
        }

        stopMicrophoneTracks();
        setIsRecording(false);
    };

    // 피드백 받기
    // 피드백 받기
    const handleGetFeedback = async () => {
        try {
            setLoading(true);
            const feedbackResult = await sendFeedbackRequest(iocTopic, workTitle, author, scriptFile, audioBlob, userInfo);
            // 반환된 JSON 구조에서 feedbackContent만 추출하여 상태에 저장
            setFeedback(feedbackResult.data.feedbackContent);
            setLoading(false);
        } catch (error) {
            console.error("Feedback request error:", error);
            setFeedback(
                error?.response?.data?.message ||
                error?.message ||
                "피드백 요청 중 오류가 발생했습니다."
            );
            setLoading(false);
        }
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
        if (isRecording) {
            timerId = setInterval(() => {
                setRecordingSeconds((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerId);
    }, [isRecording]);

    useEffect(() => {
        return () => {
            const recorder = mediaRecorderRef.current;
            if (recorder && recorder.state !== "inactive") {
                recorder.stop();
            }
            stopMicrophoneTracks();
            revokeAudioPreviewUrl();
        };
    }, []);

    useEffect(() => {
        if (audioBlob) {
            syncAudioPreview(audioBlob);
            return;
        }

        revokeAudioPreviewUrl();
        if (audioRef.current) {
            audioRef.current.removeAttribute("src");
            audioRef.current.load();
        }
    }, [audioBlob]);

    // 시간 포맷팅
    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    const isOverRecommendedDuration = recordingSeconds > RECOMMENDED_DURATION_SECONDS;

    return (
        <main className={styles.container}>
            {/* 1) 인트로 섹션 */}
            <section className={styles.introSection}>
                <span className={styles.eyebrow}>AI Oral Recording Studio</span>
                <h1 className={styles.title}>AI IO 말하기 연습 / 녹음</h1>
                <p className={styles.description}>
                    마이크 아이콘을 눌러 녹음을 시작하세요. 권장 발표 시간은 10분이며, 그 이후에도 녹음은 계속 유지됩니다.
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
                <div className={`${styles.timer} ${isOverRecommendedDuration ? styles.timerOver : ""}`}>
                    {formatTime(recordingSeconds)}
                </div>
                <p className={styles.timerHint}>
                    권장 시간 10:00
                    {isOverRecommendedDuration ? "를 넘겨 계속 녹음 중입니다." : "까지 녹음할 수 있습니다."}
                </p>
                <div className={styles.actionRow}>
                    {!isRecording && !isFinished && (
                        <button className={styles.recordButton} onClick={handleStartRecording}>
                            <FontAwesomeIcon icon={faMicrophone} className={styles.icon} />
                            녹음 시작
                        </button>
                    )}

                    {isRecording && (
                        <button className={styles.stopButton} onClick={handleStopRecording}>
                            녹음 중단
                        </button>
                    )}

                    {!isRecording && isFinished && (
                        <button
                            className={styles.recordButton}
                            onClick={() => {
                                // Clear previous recording and reset timer
                                revokeAudioPreviewUrl();
                                setAudioBlob(null);
                                setRecordingSeconds(0);
                                if (audioRef.current) {
                                    audioRef.current.src = "";
                                }
                                setIsFinished(false);
                                handleStartRecording();
                            }}
                        >
                            <FontAwesomeIcon icon={faMicrophone} className={styles.icon} />
                            재녹음
                        </button>
                    )}
                    <button
                        className={styles.feedbackButton}
                        onClick={handleGetFeedback}
                        disabled={!audioBlob || isRecording || loading}
                    >
                        피드백 받기
                    </button>
                </div>
            </section>

            {/* 오디오 미리보기 (녹음된 파일 재생) */}
            {audioBlob && (
                <section className={styles.audioSection}>
                    <h2 className={styles.audioTitle}>녹음 파일 미리보기</h2>
                    <audio controls ref={audioRef} className={styles.audioPlayer} />
                </section>
            )}

            {/* 4) 피드백 섹션 */}
            {loading ? (
                <section className={styles.feedbackSection}>
                    <h2 className={styles.feedbackTitle}>피드백 요약</h2>
                    <p className={styles.feedbackContent}>로딩 중...</p>
                </section>
            ) : (
                feedback && (
                    <section className={styles.feedbackSection}>
                        <h2 className={styles.feedbackTitle}>피드백 요약</h2>
                        <p className={styles.feedbackContent}>{feedback}</p>
                        <button className={styles.tutorButton} onClick={() => alert("튜터에게 전송")}>
                            튜터에게 보내고 레슨 잡기
                        </button>
                    </section>
                )
            )}
        </main>
    );
};

export default AIIoRecording;
