import { useEffect, useRef, useState } from "react";
import styles from "./AdminStyle.module.css";
import { userGetUsage, userReviseInfo } from "@/apis/userAPI";
import { useUserInfo, useUserStore } from "@/store/user";

const formatDateTime = (value) => {
  if (!value) return "기록 없음";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "기록 없음";
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const renderLimitLabel = (count, unlimited, suffix) =>
  unlimited ? `${suffix} 무한` : `${count ?? 0}${suffix}`;

const AdminUserDetail = ({ userDetailInfo, setModal }) => {
  const closeRef = useRef();
  const [deleteCheckModal, setDeleteCheckModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [usageInfo, setUsageInfo] = useState(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [birth, setBirth] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    setUsername(userDetailInfo?.username);
    setNickname(userDetailInfo?.nickName);
    setBirth(userDetailInfo?.birth);
    setAddress(userDetailInfo?.address);
    setCountry(userDetailInfo?.country);
    setSchool(userDetailInfo?.school);
    setGrade(userDetailInfo?.grade);
    setMemo(userDetailInfo?.memo);
  }, [userDetailInfo]);

  const { userInfo } = useUserInfo();

  const { deleteUser } = useUserStore();

  useEffect(() => {
    if (!userDetailInfo?.userId || userInfo?.authority !== "ADMIN") return;

    const loadUsageInfo = async () => {
      setUsageLoading(true);
      setUsageError("");
      try {
        const res = await userGetUsage(userDetailInfo.userId, userInfo);
        setUsageInfo(res?.data ?? null);
      } catch (error) {
        setUsageInfo(null);
        setUsageError("학생 사용량을 불러오지 못했습니다.");
      } finally {
        setUsageLoading(false);
      }
    };

    loadUsageInfo();
  }, [userDetailInfo?.userId, userInfo]);

  const onChangeCountry = (e) => {
    setCountry(e.target.value);
  };

  const onClickSubmit = () => {
    if (editMode) {
      userReviseInfo(
        userDetailInfo?.userId,
        "",
        userDetailInfo?.email,
        nickname,
        birth,
        school,
        grade,
        address,
        country,
        userDetailInfo?.userStatus,
        userDetailInfo?.authority,
        memo,
        userDetailInfo?.marketingTermsCheck,
        userInfo
      );
      setModal(false);
    } else setModal(false);
  };

  const onSubmitDeleteUser = async (userId) => {
    deleteUser(userId, userInfo);
    setModal(false);
  };
  return (
    <div className={styles.md}>
      <div
        className={styles.md_box_flex}
        ref={closeRef}
        onClick={(e) => closeRef.current === e.target && setModal(false)}
      >
        <div className={styles.md_box}>
          <div className={styles.md_top}>
            <div className={styles.tit} style={{ position: "relative" }}>
              {username} 님의 정보
              <span
                style={{
                  fontSize: "1.5rem",
                  position: "absolute",
                  right: "8rem",
                }}
                onClick={() => setEditMode(!editMode)}
              >
                수정하기
              </span>
              <span
                style={{
                  fontSize: "1.5rem",
                  position: "absolute",
                  right: 0,
                  color: "red",
                }}
                onClick={() => setDeleteCheckModal(true)}
              >
                비활성화
              </span>
            </div>
            {deleteCheckModal === true && (
              <div className={styles.md}>
                <div className={styles.md_box_flex}>
                  <div className={styles.admin_box}>
                    <div className={styles.md_top}>
                      <div className={styles.tit}>
                        {userDetailInfo.username}님을 정말 비활성화
                        하시겠습니까?
                      </div>
                      <div style={{ display: "flex" }}>
                        <button
                          style={{
                            width: "90%",
                            marginRight: "1rem",
                            backgroundColor: "red",
                          }}
                          onClick={() =>
                            onSubmitDeleteUser(userDetailInfo?.userId)
                          }
                        >
                          확인
                        </button>
                        <button
                          style={{ width: "90%", marginLeft: "1rem" }}
                          onClick={() => setDeleteCheckModal(false)}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.md_dim}></div>
              </div>
            )}

            <div className={styles.userInfos}>
              <span>username:</span>
              <input
                type="text"
                value={username}
                disabled={!editMode}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className={styles.userInfos}>
              <span>nickname:</span>
              <input
                type="text"
                value={nickname}
                disabled={!editMode}
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
              />
            </div>
            <div className={styles.userInfos}>
              <span>email:</span>
              <input
                type="text"
                value={userDetailInfo?.email}
                disabled={true}
              />
            </div>
            <div className={styles.userInfos}>
              <span>생년월일:</span>
              <input
                type="text"
                value={birth}
                disabled={!editMode}
                onChange={(e) => {
                  setBirth(e.target.value);
                }}
              />
            </div>
            <div className={styles.userInfos}>
              <span>주소:</span>
              <input
                type="text"
                value={address}
                disabled={!editMode}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </div>
            <div className={styles.userInfos}>
              <span>Country:</span>
              <select
                className="contry_select"
                value={country}
                onChange={onChangeCountry}
                disabled={!editMode}
              >
                <option value="정보 없음">국가선택</option>
                <option value="ko">한국</option>
                <option value="en">미국</option>
                <option value="jp">일본</option>
                <option value="cn">중국</option>
              </select>
            </div>
            <div className={styles.userInfos}>
              <span>학교:</span>
              <input
                type="text"
                value={school}
                disabled={!editMode}
                onChange={(e) => {
                  setSchool(e.target.value);
                }}
              />
            </div>
            <div className={styles.userInfos}>
              <span>학년:</span>
              <input
                type="text"
                value={grade}
                disabled={!editMode}
                onChange={(e) => {
                  setGrade(e.target.value);
                }}
              />
            </div>
            <div className={styles.userInfos}>
              <span>권한:</span>
              <input
                type="text"
                value={userDetailInfo?.authority}
                disabled={true}
              />
            </div>
            <div className={styles.userInfos}>
              <span>로그인 타입:</span>
              <input
                type="text"
                value={userDetailInfo?.loginType}
                disabled={true}
              />
            </div>
            <div className={styles.userInfos}>
              <span>마케팅 수신 여부:</span>
              <input
                type="text"
                value={userDetailInfo?.marketingTermsCheck}
                disabled={true}
              />
            </div>

            <div className={styles.memo}>
              <span>메모:</span>
              <textarea
                type="text"
                value={memo}
                disabled={!editMode}
                onChange={(e) => {
                  setMemo(e.target.value);
                }}
              />
            </div>

            {userInfo?.authority === "ADMIN" && (
              <section className={styles.usageSection}>
                <div className={styles.usageSectionHeader}>
                  <h3>학생 사용량</h3>
                  <p>강의 진도, 질문/튜터링 사용량, 마지막 접속 기준</p>
                </div>

                {usageLoading ? (
                  <div className={styles.adminModalFeedback}>
                    학생 사용량을 불러오는 중입니다.
                  </div>
                ) : usageError ? (
                  <div className={styles.adminModalFeedback}>{usageError}</div>
                ) : usageInfo ? (
                  <>
                    <div className={styles.usageOverviewGrid}>
                      <div className={styles.usageOverviewCard}>
                        <span>마지막 접속</span>
                        <strong>{formatDateTime(usageInfo.lastAccessAt)}</strong>
                      </div>
                      <div className={styles.usageOverviewCard}>
                        <span>수강 강의</span>
                        <strong>{usageInfo.totalCourseCount}개</strong>
                      </div>
                      <div className={styles.usageOverviewCard}>
                        <span>질문 사용량</span>
                        <strong>{usageInfo.totalQuestionCount}개</strong>
                        <small>
                          대기 {usageInfo.waitingQuestionCount} / 완료{" "}
                          {usageInfo.completedQuestionCount}
                        </small>
                      </div>
                      <div className={styles.usageOverviewCard}>
                        <span>튜터링 사용량</span>
                        <strong>{usageInfo.totalTutoringCount}회</strong>
                        <small>
                          대기 {usageInfo.waitingTutoringCount} / 확정{" "}
                          {usageInfo.confirmedTutoringCount} / 취소{" "}
                          {usageInfo.canceledTutoringCount}
                        </small>
                      </div>
                    </div>

                    <div className={styles.usagePlanCard}>
                      <div className={styles.usagePlanHeader}>
                        <h4>현재 활성 구독</h4>
                        <span>
                          {usageInfo.activeSubscribe?.title
                            ? `${usageInfo.activeSubscribe.title} · ${usageInfo.activeSubscribe.subscribeMonthPeriod}개월`
                            : "활성 구독 없음"}
                        </span>
                      </div>

                      {usageInfo.activeSubscribe ? (
                        <div className={styles.usagePlanMeta}>
                          <div>
                            <span>질문</span>
                            <strong>
                              {renderLimitLabel(
                                usageInfo.activeSubscribe.questionCount,
                                usageInfo.activeSubscribe.unlimitedQuestions,
                                "회"
                              )}
                            </strong>
                          </div>
                          <div>
                            <span>튜터링</span>
                            <strong>
                              {renderLimitLabel(
                                usageInfo.activeSubscribe.tutoringCount,
                                usageInfo.activeSubscribe.unlimitedTutoring,
                                "회"
                              )}
                            </strong>
                          </div>
                          <div>
                            <span>영상강의</span>
                            <strong>
                              {renderLimitLabel(
                                usageInfo.activeSubscribe.videoLessonsCount,
                                usageInfo.activeSubscribe.unlimitedVideoLessons,
                                "과목"
                              )}
                            </strong>
                          </div>
                          <div>
                            <span>만료일</span>
                            <strong>
                              {usageInfo.activeSubscribe.expirationDate ?? "없음"}
                            </strong>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.usagePlanEmpty}>
                          현재 활성 구독 정보가 없습니다.
                        </div>
                      )}
                    </div>

                    <div className={styles.usageCourseSection}>
                      <div className={styles.usagePlanHeader}>
                        <h4>수강 강의 및 진도율</h4>
                        <span>
                          마지막 시청 순서로 정렬
                        </span>
                      </div>

                      {usageInfo.courses?.length ? (
                        <div className={styles.usageCourseList}>
                          {usageInfo.courses.map((course) => (
                            <article
                              key={course.videoLessonsId}
                              className={styles.usageCourseItem}
                            >
                              <div className={styles.usageCourseHead}>
                                <div>
                                  <strong>{course.title}</strong>
                                  <p>
                                    진도 {course.progressPercent ?? 0}% · 완료{" "}
                                    {course.completedLessonCount}/
                                    {course.totalLessonCount}레슨
                                  </p>
                                </div>
                                <span>{course.progressPercent ?? 0}%</span>
                              </div>
                              <div className={styles.usageProgressTrack}>
                                <div
                                  className={styles.usageProgressBar}
                                  style={{
                                    width: `${Math.max(
                                      0,
                                      Math.min(course.progressPercent ?? 0, 100)
                                    )}%`,
                                  }}
                                />
                              </div>
                              <div className={styles.usageCourseMeta}>
                                <span>
                                  수강 등록: {formatDateTime(course.enrolledAt)}
                                </span>
                                <span>
                                  마지막 시청: {formatDateTime(course.lastWatchedAt)}
                                </span>
                              </div>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.usagePlanEmpty}>
                          아직 수강 등록한 강의가 없습니다.
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </section>
            )}
          </div>
          <button
            type="button"
            className={styles.md_btn}
            onClick={() => {
              onClickSubmit();
            }}
          >
            {editMode === true ? "수정" : "확인"}
          </button>
        </div>
      </div>
      <div className={styles.md_dim}></div>
    </div>
  );
};

export default AdminUserDetail;
