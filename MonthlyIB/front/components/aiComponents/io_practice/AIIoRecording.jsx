"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useIOStore } from "@/store/AIIostore";
import styles from "./AIIoRecording.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { useUserInfo } from "@/store/user";

const TARGET_SAMPLE_RATE = 16000;

const mergeAudioBuffers = (buffers, length) => {
    const result = new Float32Array(length);
    let offset = 0;
    buffers.forEach((buffer) => {
        result.set(buffer, offset);
        offset += buffer.length;
    });
    return result;
};

const downsampleBuffer = (buffer, sourceSampleRate, targetSampleRate) => {
    if (targetSampleRate === sourceSampleRate) return buffer;
    const sampleRateRatio = sourceSampleRate / targetSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
        const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
        let accumulator = 0;
        let count = 0;
        for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i += 1) {
            accumulator += buffer[i];
            count += 1;
        }
        result[offsetResult] = accumulator / Math.max(count, 1);
        offsetResult += 1;
        offsetBuffer = nextOffsetBuffer;
    }

    return result;
};

const writeAscii = (view, offset, value) => {
    for (let i = 0; i < value.length; i += 1) {
        view.setUint8(offset + i, value.charCodeAt(i));
    }
};

const encodeWav = (samples, sampleRate) => {
    const bytesPerSample = 2;
    const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
    const view = new DataView(buffer);

    writeAscii(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    writeAscii(view, 8, "WAVE");
    writeAscii(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * bytesPerSample, true);
    view.setUint16(32, bytesPerSample, true);
    view.setUint16(34, 16, true);
    writeAscii(view, 36, "data");
    view.setUint32(40, samples.length * bytesPerSample, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i += 1, offset += 2) {
        const sample = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    }

    return new Blob([view], { type: "audio/wav" });
};

const parseFeedbackSections = (content) => {
    if (!content) return [];
    const sections = [];
    const lines = content.split(/\r?\n/);
    let current = { title: "피드백", body: [] };

    lines.forEach((line) => {
        const heading = line.match(/^#{1,3}\s+(.+)$/);
        if (heading) {
            if (current.body.join("\n").trim()) {
                sections.push({ ...current, body: current.body.join("\n").trim() });
            }
            current = { title: heading[1].trim(), body: [] };
            return;
        }
        current.body.push(line);
    });

    if (current.body.join("\n").trim()) {
        sections.push({ ...current, body: current.body.join("\n").trim() });
    }

    return sections.length ? sections : [{ title: "피드백", body: content }];
};

const AIIoRecording = () => {
    const RECOMMENDED_DURATION_SECONDS = 600;
    const { iocTopic, workTitle, author, scriptFile, sendFeedbackRequest } = useIOStore();

    const [isRecording, setIsRecording] = useState(false);
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const [feedbackData, setFeedbackData] = useState(null);
    const [feedbackError, setFeedbackError] = useState("");
    const [preview, setPreview] = useState(null); // 대본 미리보기 콘텐츠
    const { userInfo } = useUserInfo();
    const [loading, setLoading] = useState(false);

    // 녹음 관련 상태
    const [audioBlob, setAudioBlob] = useState(null);
    const [isFinished, setIsFinished] = useState(false);

    const audioRef = useRef(null); // 녹음 파일 재생을 위한 ref
    const audioContextRef = useRef(null);
    const sourceRef = useRef(null);
    const processorRef = useRef(null);
    const silentGainRef = useRef(null);
    const streamRef = useRef(null);
    const recordedBuffersRef = useRef([]);
    const recordingLengthRef = useRef(0);
    const sourceSampleRateRef = useRef(48000);
    const audioUrlRef = useRef(null);
    const feedbackSections = useMemo(
        () => parseFeedbackSections(feedbackData?.feedbackContent),
        [feedbackData?.feedbackContent]
    );

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

    const disconnectRecordingNodes = async () => {
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current.onaudioprocess = null;
            processorRef.current = null;
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (silentGainRef.current) {
            silentGainRef.current.disconnect();
            silentGainRef.current = null;
        }
        if (audioContextRef.current) {
            await audioContextRef.current.close();
            audioContextRef.current = null;
        }
    };

    const finalizeRecording = async () => {
        await disconnectRecordingNodes();
        stopMicrophoneTracks();

        if (recordingLengthRef.current === 0) {
            setAudioBlob(null);
            setIsFinished(false);
            setIsRecording(false);
            return;
        }

        const mergedBuffer = mergeAudioBuffers(recordedBuffersRef.current, recordingLengthRef.current);
        const downsampledBuffer = downsampleBuffer(
            mergedBuffer,
            sourceSampleRateRef.current,
            TARGET_SAMPLE_RATE
        );
        const blob = encodeWav(downsampledBuffer, TARGET_SAMPLE_RATE);
        setAudioBlob(blob);
        setIsFinished(true);
        setIsRecording(false);
        syncAudioPreview(blob);
    };

    // 녹음 시작: 사용자 권한 요청 및 MediaRecorder 초기화
    const handleStartRecording = async () => {
        try {
            revokeAudioPreviewUrl();
            setAudioBlob(null);
            setFeedbackData(null);
            setFeedbackError("");
            setIsFinished(false);
            setRecordingSeconds(0);
            recordedBuffersRef.current = [];
            recordingLengthRef.current = 0;

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });

            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContextClass();
            await audioContext.resume();
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            const silentGain = audioContext.createGain();
            silentGain.gain.value = 0;

            processor.onaudioprocess = (event) => {
                if (!isRecording && !audioContextRef.current) return;
                const input = event.inputBuffer.getChannelData(0);
                recordedBuffersRef.current.push(new Float32Array(input));
                recordingLengthRef.current += input.length;
            };

            source.connect(processor);
            processor.connect(silentGain);
            silentGain.connect(audioContext.destination);

            streamRef.current = stream;
            audioContextRef.current = audioContext;
            sourceRef.current = source;
            processorRef.current = processor;
            silentGainRef.current = silentGain;
            sourceSampleRateRef.current = audioContext.sampleRate;
            setIsRecording(true);
        } catch (err) {
            alert("마이크 접근 권한이 필요합니다.");
            console.error(err);
        }
    };

    // 녹음 중단: MediaRecorder 종료
    const handleStopRecording = async () => {
        await finalizeRecording();
    };

    // 피드백 받기
    const handleGetFeedback = async () => {
        try {
            setFeedbackError("");
            setFeedbackData(null);
            setLoading(true);
            const feedbackResult = await sendFeedbackRequest(
                iocTopic,
                workTitle,
                author,
                scriptFile,
                audioBlob,
                recordingSeconds,
                userInfo
            );
            setFeedbackData(feedbackResult.data);
            setLoading(false);
        } catch (error) {
            console.error("Feedback request error:", error);
            setFeedbackError(
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
            } else if (fileName.endsWith('.docx')) {
                // DOCX는 미리보기가 지원되지 않으므로 다운로드 안내
                setPreview(
                    <div className={styles.previewContainer}>
                        <p>DOCX 파일은 미리보기가 지원되지 않습니다. 업로드된 파일은 AI 피드백 기준 대본으로 사용됩니다.</p>
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
            disconnectRecordingNodes();
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
                                setFeedbackData(null);
                                setFeedbackError("");
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
                        {loading ? "피드백 생성 중..." : "피드백 받기"}
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
                    <h2 className={styles.feedbackTitle}>AI 피드백 생성 중</h2>
                    <p className={styles.feedbackContent}>
                        녹음을 텍스트로 변환하고 대본과 비교해 피드백을 생성하고 있습니다. 녹음 길이에 따라 시간이 걸릴 수 있습니다.
                    </p>
                </section>
            ) : feedbackError ? (
                <section className={styles.feedbackSection}>
                    <h2 className={styles.feedbackTitle}>피드백 요청 실패</h2>
                    <p className={styles.feedbackContent}>{feedbackError}</p>
                </section>
            ) : (
                feedbackData && (
                    <section className={styles.feedbackSection}>
                        <h2 className={styles.feedbackTitle}>AI IO 피드백</h2>
                        <div className={styles.metricGrid}>
                            {[
                                ["대본 일치율", feedbackData.deliveryMetrics?.scriptMatchPercent],
                                ["분당 단어", feedbackData.deliveryMetrics?.speakingRateWpm],
                                ["녹음 길이", feedbackData.deliveryMetrics?.durationSeconds],
                            ].map(([label, value]) => (
                                <div className={styles.metricCard} key={label}>
                                    <span>{label}</span>
                                    <strong>{value ?? "-"}</strong>
                                </div>
                            ))}
                        </div>
                        {feedbackData.transcript && (
                            <div className={styles.transcriptBox}>
                                <h3>인식된 발화</h3>
                                <p>{feedbackData.transcript}</p>
                            </div>
                        )}
                        <div className={styles.feedbackSections}>
                            {feedbackSections.map((section) => (
                                <article className={styles.feedbackBlock} key={section.title}>
                                    <h3>{section.title}</h3>
                                    <p>{section.body}</p>
                                </article>
                            ))}
                        </div>
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
