"use client";

import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import CoursePlayerCurriculum from "./CoursePlayerCurriculum";
import { useCourseStore } from "@/store/course";
import { useUserStore } from "@/store/user";
import { getCookie } from "@/apis/cookies";
import {
  courseGetProgress,
  coursePutLessonProgress,
  courseRestartLessonProgress,
} from "@/apis/courseAPI";
import {
  buildLessonProgressMap,
  extractYouTubeVideoId,
  flattenCourseLessons,
  formatSeconds,
  isYouTubeVideoUrl,
  resolveCourseEntryTarget,
} from "./courseProgressUtils";

let youtubeIframeApiPromise = null;

const loadYoutubeIframeApi = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("window is not available"));
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeIframeApiPromise) {
    return youtubeIframeApiPromise;
  }

  youtubeIframeApiPromise = new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve(window.YT);
    };

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
  });

  return youtubeIframeApiPromise;
};

const CoursePlayer = ({ pageId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = getCookie("accessToken");
  const preferredMainChapterId = Number(searchParams.get("mainChapterId") || 0);
  const preferredSubChapterId = Number(searchParams.get("subChapterId") || 0);

  const [modal, setModal] = useState(false);
  const [selectedLessonIds, setSelectedLessonIds] = useState(null);
  const [startAtSeconds, setStartAtSeconds] = useState(0);
  const [courseProgress, setCourseProgress] = useState(null);
  const [progressResolved, setProgressResolved] = useState(false);
  const [playerVersion, setPlayerVersion] = useState(0);
  const { courseDetail, getCourseDetail } = useCourseStore();
  const { userSubscribeInfo, getUserSubscribeInfo } = useUserStore();

  const videoRef = useRef(null);
  const youtubeContainerRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const youtubePlayerReadyRef = useRef(false);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const saveInFlightRef = useRef(false);
  const lastSavedSignatureRef = useRef("");
  const selectedLessonRef = useRef(null);
  const courseProgressRef = useRef(null);
  const hasInitializedSelectionRef = useRef(false);

  const subscribeStatus = userSubscribeInfo?.[0]?.subscribeStatus;
  const isSubscribed = subscribeStatus === "ACTIVE";
  const orderedLessons = useMemo(
    () => flattenCourseLessons(courseDetail),
    [courseDetail]
  );
  const lessonProgressMap = useMemo(
    () => buildLessonProgressMap(courseProgress),
    [courseProgress]
  );

  const currentLesson = useMemo(() => {
    if (!selectedLessonIds) {
      return null;
    }

    return (
      orderedLessons.find(
        (lesson) =>
          lesson.mainChapterId === selectedLessonIds.mainChapterId &&
          lesson.subChapterId === selectedLessonIds.subChapterId
      ) || null
    );
  }, [orderedLessons, selectedLessonIds]);

  const currentLessonProgress = currentLesson
    ? lessonProgressMap[currentLesson.subChapterId]
    : null;
  const currentLessonIndex = currentLesson
    ? orderedLessons.findIndex(
        (lesson) => lesson.subChapterId === currentLesson.subChapterId
      )
    : -1;

  useEffect(() => {
    selectedLessonRef.current = selectedLessonIds;
  }, [selectedLessonIds]);

  useEffect(() => {
    courseProgressRef.current = courseProgress;
  }, [courseProgress]);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("userInfo"));
    if (localUser?.state?.userInfo?.userId) {
      getUserSubscribeInfo(
        localUser.state.userInfo.userId,
        0,
        localUser.state.userInfo
      );
    }
  }, [getUserSubscribeInfo]);

  useEffect(() => {
    if (pageId) {
      getCourseDetail(pageId);
    }
  }, [getCourseDetail, pageId]);

  useEffect(() => {
    let ignore = false;

    if (!accessToken || !pageId) {
      setCourseProgress(null);
      setProgressResolved(true);
      return () => {
        ignore = true;
      };
    }

    setProgressResolved(false);
    courseGetProgress(pageId, { accessToken })
      .then((res) => {
        if (!ignore) {
          setCourseProgress(res?.data ?? null);
        }
      })
      .catch(() => {
        if (!ignore) {
          setCourseProgress(null);
        }
      })
      .finally(() => {
        if (!ignore) {
          setProgressResolved(true);
        }
      });

    return () => {
      ignore = true;
    };
  }, [accessToken, pageId]);

  useEffect(() => {
    if (
      Array.isArray(userSubscribeInfo) &&
      userSubscribeInfo.length >= 0 &&
      subscribeStatus &&
      subscribeStatus !== "ACTIVE"
    ) {
      alert("잘못된 접근입니다.");
      router.back();
    }
  }, [router, subscribeStatus, userSubscribeInfo]);

  useEffect(() => {
    if (
      hasInitializedSelectionRef.current ||
      !progressResolved ||
      orderedLessons.length === 0
    ) {
      return;
    }

    const initialTarget = resolveCourseEntryTarget(courseDetail, courseProgress, {
      mainChapterId: preferredMainChapterId,
      subChapterId: preferredSubChapterId,
    });

    if (!initialTarget) {
      return;
    }

    hasInitializedSelectionRef.current = true;
    setSelectedLessonIds({
      mainChapterId: initialTarget.mainChapterId,
      subChapterId: initialTarget.subChapterId,
    });
    setStartAtSeconds(initialTarget.positionSeconds || 0);
    setPlayerVersion((prev) => prev + 1);
  }, [
    courseDetail,
    courseProgress,
    orderedLessons,
    preferredMainChapterId,
    preferredSubChapterId,
    progressResolved,
  ]);

  const getPlaybackSnapshot = useCallback(() => {
    if (!currentLesson) {
      return {
        positionSeconds: 0,
        durationSeconds: 0,
      };
    }

    if (isYouTubeVideoUrl(currentLesson.videoFileUrl)) {
      const player = youtubePlayerRef.current;

      if (player?.getCurrentTime && player?.getDuration) {
        return {
          positionSeconds: Math.floor(player.getCurrentTime() || 0),
          durationSeconds: Math.floor(player.getDuration() || 0),
        };
      }
    }

    const nativeVideo = videoRef.current;
    if (nativeVideo) {
      return {
        positionSeconds: Math.floor(nativeVideo.currentTime || 0),
        durationSeconds: Math.floor(nativeVideo.duration || 0),
      };
    }

    return {
      positionSeconds: Math.floor(currentTimeRef.current || 0),
      durationSeconds: Math.floor(durationRef.current || 0),
    };
  }, [currentLesson]);

  const persistCurrentLessonProgress = useCallback(
    async ({ markComplete = false } = {}) => {
      if (!accessToken || !selectedLessonRef.current?.subChapterId) {
        return;
      }

      const existingProgress = (courseProgressRef.current?.lessons ?? []).find(
        (lesson) => lesson.subChapterId === selectedLessonRef.current.subChapterId
      );

      let { positionSeconds, durationSeconds } = getPlaybackSnapshot();
      durationSeconds = Math.floor(durationSeconds || existingProgress?.durationSeconds || 0);
      positionSeconds = Math.floor(
        markComplete
          ? durationSeconds
          : positionSeconds || existingProgress?.lastPositionSeconds || 0
      );

      if (!durationSeconds) {
        return;
      }

      if (!markComplete && positionSeconds <= 0 && !existingProgress) {
        return;
      }

      if (positionSeconds > durationSeconds) {
        positionSeconds = durationSeconds;
      }

      const signature = `${selectedLessonRef.current.subChapterId}:${positionSeconds}:${durationSeconds}:${markComplete ? 1 : 0}`;
      if (!markComplete && lastSavedSignatureRef.current === signature) {
        return;
      }

      if (saveInFlightRef.current) {
        return;
      }

      saveInFlightRef.current = true;

      try {
        const response = await coursePutLessonProgress(
          Number(pageId),
          selectedLessonRef.current.subChapterId,
          positionSeconds,
          durationSeconds,
          { accessToken }
        );

        if (response?.data) {
          courseProgressRef.current = response.data;
          setCourseProgress(response.data);
          lastSavedSignatureRef.current = signature;
        }
      } catch (error) {
        console.error("강의 진도 저장 중 오류 발생:", error);
      } finally {
        saveInFlightRef.current = false;
      }
    },
    [accessToken, getPlaybackSnapshot, pageId]
  );

  const seekCurrentPlayer = useCallback((seconds) => {
    const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
    currentTimeRef.current = safeSeconds;

    const youtubePlayer = youtubePlayerRef.current;
    const youtubeIframe =
      typeof youtubePlayer?.getIframe === "function"
        ? youtubePlayer.getIframe()
        : null;

    if (
      youtubePlayer?.seekTo &&
      youtubePlayerReadyRef.current &&
      youtubeIframe?.isConnected
    ) {
      try {
        youtubePlayer.seekTo(safeSeconds, true);
        youtubePlayer.playVideo?.();
        return;
      } catch (error) {
        console.error("YouTube seek 처리 중 오류 발생:", error);
      }
    }

    if (videoRef.current) {
      videoRef.current.currentTime = safeSeconds;
      videoRef.current.play().catch(() => {});
      return;
    }

    setStartAtSeconds(safeSeconds);
    setPlayerVersion((prev) => prev + 1);
  }, []);

  const switchLesson = useCallback(
    async (target, options = {}) => {
      if (!target?.mainChapterId || !target?.subChapterId) {
        return;
      }

      if (options.persistCurrent !== false) {
        await persistCurrentLessonProgress();
      }

      const targetProgress = lessonProgressMap[target.subChapterId];
      setSelectedLessonIds({
        mainChapterId: target.mainChapterId,
        subChapterId: target.subChapterId,
      });
      setStartAtSeconds(
        options.restart
          ? 0
          : Number(targetProgress?.lastPositionSeconds || 0)
      );
      lastSavedSignatureRef.current = "";
      setPlayerVersion((prev) => prev + 1);
      setModal(false);
    },
    [lessonProgressMap, persistCurrentLessonProgress]
  );

  const handleResumeLesson = useCallback(
    async (target) => {
      if (!target?.subChapterId) {
        return;
      }

      const isCurrentLesson =
        selectedLessonRef.current?.subChapterId === target.subChapterId;
      const savedPosition =
        lessonProgressMap[target.subChapterId]?.lastPositionSeconds || 0;

      if (isCurrentLesson) {
        seekCurrentPlayer(savedPosition);
        return;
      }

      await switchLesson(target);
    },
    [lessonProgressMap, seekCurrentPlayer, switchLesson]
  );

  const handleRestartLesson = useCallback(
    async (target) => {
      if (!accessToken || !target?.subChapterId) {
        return;
      }

      const isCurrentLesson =
        selectedLessonRef.current?.subChapterId === target.subChapterId;

      if (!isCurrentLesson) {
        await persistCurrentLessonProgress();
      }

      try {
        const response = await courseRestartLessonProgress(
          Number(pageId),
          target.subChapterId,
          { accessToken }
        );

        if (response?.data) {
          courseProgressRef.current = response.data;
          setCourseProgress(response.data);
        }

        lastSavedSignatureRef.current = "";

        if (isCurrentLesson) {
          seekCurrentPlayer(0);
          return;
        }

        setSelectedLessonIds({
          mainChapterId: target.mainChapterId,
          subChapterId: target.subChapterId,
        });
        setStartAtSeconds(0);
        setPlayerVersion((prev) => prev + 1);
        setModal(false);
      } catch (error) {
        console.error("레슨 다시 시작 중 오류 발생:", error);
      }
    },
    [accessToken, pageId, persistCurrentLessonProgress, seekCurrentPlayer]
  );

  useEffect(() => {
    if (!selectedLessonIds?.subChapterId || !accessToken) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      persistCurrentLessonProgress();
    }, 10000);

    return () => {
      window.clearInterval(interval);
    };
  }, [accessToken, persistCurrentLessonProgress, selectedLessonIds?.subChapterId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        persistCurrentLessonProgress();
      }
    };

    const handlePageHide = () => {
      persistCurrentLessonProgress();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
    };
  }, [persistCurrentLessonProgress]);

  useEffect(() => {
    if (!currentLesson) {
      return undefined;
    }

    currentTimeRef.current = startAtSeconds || 0;
    durationRef.current = 0;

    if (!isYouTubeVideoUrl(currentLesson.videoFileUrl)) {
      if (youtubePlayerRef.current?.destroy) {
        youtubePlayerRef.current.destroy();
      }
      youtubePlayerRef.current = null;
      youtubePlayerReadyRef.current = false;
      return undefined;
    }

    const videoId = extractYouTubeVideoId(currentLesson.videoFileUrl);
    if (!videoId || !youtubeContainerRef.current) {
      return undefined;
    }

    let cancelled = false;

    loadYoutubeIframeApi().then((YT) => {
      if (cancelled || !youtubeContainerRef.current) {
        return;
      }

      if (youtubePlayerRef.current?.destroy) {
        youtubePlayerRef.current.destroy();
      }
      youtubePlayerReadyRef.current = false;

      youtubePlayerRef.current = new YT.Player(youtubeContainerRef.current, {
        videoId,
        playerVars: {
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          start: Math.max(0, Math.floor(startAtSeconds || 0)),
        },
        events: {
          onReady: (event) => {
            youtubePlayerReadyRef.current = true;
            durationRef.current = Math.floor(event.target.getDuration() || 0);
          },
          onStateChange: (event) => {
            durationRef.current = Math.floor(event.target.getDuration() || 0);

            if (event.data === YT.PlayerState.ENDED) {
              currentTimeRef.current = durationRef.current;
              persistCurrentLessonProgress({ markComplete: true });
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      youtubePlayerReadyRef.current = false;
      if (youtubePlayerRef.current?.destroy) {
        youtubePlayerRef.current.destroy();
      }
      youtubePlayerRef.current = null;
    };
  }, [
    currentLesson,
    persistCurrentLessonProgress,
    playerVersion,
    startAtSeconds,
  ]);

  const playerContent = useMemo(() => {
    if (!currentLesson) {
      return <div className={styles.playerEmpty}>레슨을 준비 중입니다.</div>;
    }

    if (isYouTubeVideoUrl(currentLesson.videoFileUrl)) {
      return (
        <div
          key={`${currentLesson.subChapterId}-${playerVersion}`}
          ref={youtubeContainerRef}
          className={styles.youtubePlayer}
        />
      );
    }

    return (
      <video
        key={`${currentLesson.subChapterId}-${playerVersion}`}
        ref={videoRef}
        src={currentLesson.videoFileUrl}
        controls
        preload="metadata"
        playsInline
        onLoadedMetadata={(event) => {
          durationRef.current = Math.floor(event.currentTarget.duration || 0);
          if ((startAtSeconds || 0) > 0) {
            event.currentTarget.currentTime = startAtSeconds;
          }
        }}
        onTimeUpdate={(event) => {
          currentTimeRef.current = Math.floor(event.currentTarget.currentTime || 0);
          durationRef.current = Math.floor(event.currentTarget.duration || 0);
        }}
        onEnded={() => {
          currentTimeRef.current = Math.floor(durationRef.current || 0);
          persistCurrentLessonProgress({ markComplete: true });
        }}
      />
    );
  }, [currentLesson, persistCurrentLessonProgress, playerVersion, startAtSeconds]);

  const handlePrevLesson = async () => {
    if (currentLessonIndex <= 0) return;
    await switchLesson(orderedLessons[currentLessonIndex - 1]);
  };

  const handleNextLesson = async () => {
    if (currentLessonIndex < 0 || currentLessonIndex + 1 >= orderedLessons.length) {
      return;
    }
    await switchLesson(orderedLessons[currentLessonIndex + 1]);
  };

  const handleToggleCurriculum = useCallback(() => {
    setModal((prev) => !prev);
  }, []);

  const handleCloseCurriculum = useCallback(() => {
    setModal(false);
  }, []);

  return (
    <div className={styles.player_content}>
      <div className={styles.flex_top}>
        <nav className={styles.player_nav}>
          <button
            type="button"
            id="curri_btn"
            className={`${styles.curri_btn} ${
              modal ? styles.curriBtnOpen : ""
            }`}
            onClick={handleToggleCurriculum}
            aria-expanded={modal}
            aria-controls="player_curriculum_panel"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          {modal && (
            <>
              <button
                type="button"
                className={styles.playerCurriBackdrop}
                aria-label="강의 목차 닫기"
                onClick={handleCloseCurriculum}
              />

              <div id="player_curriculum_panel" className={styles.player_curri}>
                <div className={styles.curri_tit_cont}>
                  <div className={styles.playerCurriTitleRow}>
                    <div>
                      <span>강의 목차</span>
                      <h3>{courseDetail?.title}</h3>
                    </div>
                    <button
                      type="button"
                      className={styles.playerCurriClose}
                      aria-label="강의 목차 닫기"
                      onClick={handleCloseCurriculum}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                  <p className={styles.playerProgressSummary}>
                    전체 진도 {Math.round(courseProgress?.progressPercent || 0)}% ·{" "}
                    {courseProgress?.completedLessonCount || 0}/
                    {courseProgress?.totalLessonCount || 0} 레슨 완료
                  </p>
                </div>

                <div className={styles.course_curri_wrap}>
                  <CoursePlayerCurriculum
                    curriculum={courseDetail?.chapters}
                    className={styles.course_curri_inner}
                    activeMainChapterId={selectedLessonIds?.mainChapterId}
                    activeSubChapterId={selectedLessonIds?.subChapterId}
                    onSelectLesson={switchLesson}
                    progressSummary={courseProgress}
                    onResumeLesson={handleResumeLesson}
                    onRestartLesson={handleRestartLesson}
                  />
                </div>
              </div>
            </>
          )}

          <div className={styles.player_exit}>
            <Link href={`/course/${pageId}`}>나가기</Link>
          </div>
        </nav>

        <div className={styles.player_wrap}>{playerContent}</div>
      </div>

      <div className={styles.flex_bottom}>
        <div className={styles.player_bt_bar}>
          <div className={styles.player_controller_wrap}>
            <button type="button" onClick={handlePrevLesson}>
              이전
            </button>
            <span>
              <b>{currentLessonIndex + 1 > 0 ? currentLessonIndex + 1 : 0} /</b>
              {orderedLessons.length}
            </span>
            <button type="button" onClick={handleNextLesson}>
              다음
            </button>
          </div>

          <div className={styles.player_tit_wrap}>
            <span>{currentLesson?.mainChapterTitle || "강의 재생 중"}</span>
            <p>{currentLesson?.chapterTitle || courseDetail?.title}</p>
            <small className={styles.playerProgressMeta}>
              전체 진도 {Math.round(courseProgress?.progressPercent || 0)}% ·{" "}
              {courseProgress?.completedLessonCount || 0}/
              {courseProgress?.totalLessonCount || 0} 레슨 완료
            </small>
          </div>

          <div className={styles.playerQuickActions}>
            {currentLessonProgress && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    handleResumeLesson({
                      mainChapterId: currentLesson.mainChapterId,
                      subChapterId: currentLesson.subChapterId,
                    })
                  }
                >
                  이어보기
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleRestartLesson({
                      mainChapterId: currentLesson.mainChapterId,
                      subChapterId: currentLesson.subChapterId,
                    })
                  }
                >
                  처음부터 보기
                </button>
              </>
            )}
          </div>

          <div className={styles.player_exit}>
            <Link href={`/course/${pageId}`}>나가기</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
