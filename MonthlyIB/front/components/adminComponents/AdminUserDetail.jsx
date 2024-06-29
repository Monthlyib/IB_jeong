import { useEffect, useRef, useState } from "react";
import styles from "./AdminStyle.module.css";
import { userReviseInfo } from "@/apis/userAPI";
import { useUserInfo, useUserStore } from "@/store/user";

const AdminUserDetail = ({ userDetailInfo, setModal }) => {
  const closeRef = useRef();
  const [deleteCheckModal, setDeleteCheckModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
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
