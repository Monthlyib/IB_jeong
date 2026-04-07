"use client";

import Image from "next/image";
import styles from "./MyPage.module.css";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserInfo, useUserStore } from "@/store/user";
import { openAPIVerifyEmail, openAPIVerifyNum } from "@/apis/openAPI";
import { userPostImage, userReviseInfo } from "@/apis/userAPI";

const Validate = () => {
  const router = useRouter();
  const pattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  const { userInfo, updateUserInfo } = useUserInfo();
  const { userDetailInfo, getUserInfo } = useUserStore();
  const selectedImageRef = useRef(null);

  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [country, setCountry] = useState("");
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [address, setAddress] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyRequested, setVerifyRequested] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(true);
  const [isSendingVerifyEmail, setIsSendingVerifyEmail] = useState(false);
  const [isCheckingVerifyCode, setIsCheckingVerifyCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const originalEmail = userDetailInfo?.email ?? "";
  const isEmailChanged = originalEmail !== "" && email !== originalEmail;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const persistedUser =
      JSON.parse(window.localStorage.getItem("userInfo"))?.state?.userInfo ??
      null;
    const activeSession = userInfo?.userId ? userInfo : persistedUser;

    if (!activeSession?.userId) {
      router.push("/login");
      return;
    }

    getUserInfo(activeSession.userId, activeSession);
  }, [getUserInfo, router, userInfo]);

  useEffect(() => {
    if (userDetailInfo?.userStatus !== "ACTIVE") return;

    setName(userDetailInfo.nickName ?? "");
    setEmail(userDetailInfo.email ?? "");
    setAddress(userDetailInfo.address ?? "");
    setDob(userDetailInfo.birth ?? "");
    setSchool(userDetailInfo.school ?? "");
    setCountry(userDetailInfo.country ?? "");
    setGrade(userDetailInfo.grade ?? "");
    setConsentMarketing(Boolean(userDetailInfo.marketingTermsCheck));
    setVerifyCode("");
    setVerifyRequested(false);
    setVerifyEmail(true);
  }, [userDetailInfo]);

  const changeFileName = (file) => {
    const extensionIndex = file.name.lastIndexOf(".");
    const oldFileName =
      extensionIndex === -1 ? file.name : file.name.slice(0, extensionIndex);
    const fileExtension =
      extensionIndex === -1 ? "" : file.name.slice(extensionIndex + 1);
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const timeString = `${hours}${minutes}${seconds}`;
    const suffix = fileExtension ? `.${fileExtension}` : "";

    return new File([file], `${oldFileName}_${timeString}${suffix}`, {
      type: file.type,
    });
  };

  const handleImageUpload = (e) => {
    if (!e.target.files?.[0]) return;
    selectedImageRef.current = changeFileName(e.target.files[0]);
  };

  const handleEmailChange = (e) => {
    const nextEmail = e.target.value;
    setEmail(nextEmail);
    setVerifyCode("");
    setVerifyRequested(false);
    setVerifyEmail(nextEmail === originalEmail);
  };

  const handlePasswordChange = (e) => {
    const nextPassword = e.target.value;
    setPassword(nextPassword);
    setPasswordError(passwordCheck !== "" && nextPassword !== passwordCheck);
  };

  const handlePasswordCheckChange = (e) => {
    const nextPasswordCheck = e.target.value;
    setPasswordCheck(nextPasswordCheck);
    setPasswordError(nextPasswordCheck !== password);
  };

  const handleSendVerifyEmail = async () => {
    if (email.trim() === "") {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (email === originalEmail) {
      setVerifyRequested(false);
      setVerifyEmail(true);
      alert("현재 사용 중인 이메일입니다.");
      return;
    }

    setIsSendingVerifyEmail(true);
    try {
      const res = await openAPIVerifyEmail(email);
      if (res?.result?.status !== 200) {
        throw new Error(
          res?.message || "인증번호 발송에 실패했습니다. 다시 시도해주세요."
        );
      }
      setVerifyRequested(true);
      setVerifyEmail(false);
      alert("인증번호를 발송했습니다.");
    } catch (error) {
      console.error(error);
      alert("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSendingVerifyEmail(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    if (verifyCode.trim() === "") {
      alert("인증번호를 입력해주세요.");
      return;
    }

    setIsCheckingVerifyCode(true);
    try {
      const res = await openAPIVerifyNum(email, verifyCode);

      if (res?.result?.status === 200) {
        setVerifyEmail(true);
        alert("이메일 인증이 완료되었습니다.");
        return;
      }

      if (res?.message === "잘못된 인증 번호 입니다.") {
        setVerifyEmail(false);
        alert("잘못된 인증 번호 입니다.");
        return;
      }

      alert("다시 시도해주세요.");
    } catch (error) {
      console.error(error);
      alert("이메일 인증에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsCheckingVerifyCode(false);
    }
  };

  const persistUserInfo = async (nextPassword = "") => {
    const res = await userReviseInfo(
      userDetailInfo?.userId,
      nextPassword,
      email,
      name,
      dob,
      school,
      grade,
      address,
      country,
      userDetailInfo?.userStatus,
      userDetailInfo?.authority,
      userDetailInfo?.memo,
      consentMarketing,
      userInfo
    );

    if (res?.result?.status === 200 && selectedImageRef.current) {
      await userPostImage(
        userDetailInfo?.userId,
        selectedImageRef.current,
        userInfo
      );
      selectedImageRef.current = null;
    }

    updateUserInfo({
      ...userInfo,
      nickname: name,
    });

    await getUserInfo(userDetailInfo?.userId, userInfo);
    return res;
  };

  const handleProfileChange = async (e) => {
    e.preventDefault();

    if (name.trim() === "") {
      alert("이름을 입력해주세요.");
      return;
    }

    try {
      await persistUserInfo("");
      alert("프로필 정보가 수정되었습니다.");
    } catch (error) {
      console.error(error);
      alert("프로필 정보 수정에 실패했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== "" && !pattern.test(password)) {
      alert("비밀번호 형식을 다시 확인해주세요.");
      return;
    }

    if (password !== "" && passwordError) {
      alert("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (isEmailChanged && !verifyEmail) {
      alert("변경한 이메일 인증을 완료해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await persistUserInfo(password.trim());
      alert("회원정보가 수정되었습니다.");
      router.push("/mypage");
    } catch (error) {
      console.error(error);
      alert("회원정보 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="width_content min_content member">
      <div className="header_tit_wrap tit_center">
        <h2>정보수정</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.profile_change}>
          <figure>
            <Image
              src={
                userDetailInfo?.userImage === null
                  ? "/img/common/user_profile.jpg"
                  : userDetailInfo?.userImage?.fileUrl ??
                    "/img/common/user_profile.jpg"
              }
              width="100"
              height="100"
              alt="user profile img"
            />
          </figure>

          <div className={styles.profile_change_box}>
            <div className="inputbox_cont">
              <h5>이름</h5>
              <div className="input_btn_wrap">
                <input
                  type="text"
                  name="user-userName"
                  maxLength="50"
                  autoComplete="off"
                  placeholder="이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button type="button" onClick={handleProfileChange}>
                  변경
                </button>
              </div>
            </div>

            <label className="file_profile_btn">
              <input
                type="file"
                className="profile_image"
                name="profile_image"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <div className="inputbox_cont">
          <h5>아이디</h5>
          <input
            type="text"
            name="user-id"
            disabled
            autoFocus="autofocus"
            autoComplete="off"
            value={userInfo?.username ?? ""}
            readOnly
          />
        </div>

        <div className="inputbox_cont">
          <input
            type="password"
            maxLength="50"
            autoComplete="off"
            name="user-pw"
            placeholder="비밀번호"
            value={password}
            onChange={handlePasswordChange}
          />
          <div className={styles.frm_msg_cont}>
            {password === "" ? (
              <span className={styles.frm_msg}>
                비밀번호를 변경하지 않으려면 비워두세요.
              </span>
            ) : !pattern.test(password) ? (
              <span className={`${styles.frm_msg} ${styles.frm_msg_war}`}>
                영문, 숫자, 특수문자 조합 8자 이상 입력하세요.
              </span>
            ) : (
              <span className={`${styles.frm_msg} ${styles.good}`}>
                사용가능한 비밀번호입니다.
              </span>
            )}
          </div>
        </div>

        <div className="inputbox_cont">
          <input
            type="password"
            maxLength="50"
            autoComplete="off"
            required={password !== ""}
            placeholder="비밀번호 확인"
            name="usser-pwcheck"
            value={passwordCheck}
            onChange={handlePasswordCheckChange}
          />
          <div className={styles.frm_msg_cont}>
            {password === "" && passwordCheck === "" ? (
              <span className={styles.frm_msg}>
                비밀번호를 변경할 때만 다시 입력해주세요.
              </span>
            ) : passwordCheck === "" ? (
              <span className={styles.frm_msg}>
                비밀번호를 다시 입력해주세요.
              </span>
            ) : passwordError ? (
              <span className={`${styles.frm_msg} ${styles.frm_msg_war}`}>
                두 비밀번호가 일치하지 않습니다.
              </span>
            ) : (
              <span className={`${styles.frm_msg} ${styles.good}`}>
                비밀번호가 일치합니다.
              </span>
            )}
          </div>
        </div>

        <div className="inputbox_cont">
          <h5>이메일 인증</h5>
          <div className="input_btn_wrap">
            <input
              type="email"
              name="user-email"
              placeholder="이메일"
              value={email}
              onChange={handleEmailChange}
            />
            <button type="button" onClick={handleSendVerifyEmail}>
              {isSendingVerifyEmail ? "발송중..." : "인증번호 발송"}
            </button>
          </div>
        </div>

        <div className="inputbox_cont">
          <div className="input_btn_wrap">
            <input
              type="text"
              name="email_confirm"
              required={isEmailChanged}
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="인증번호"
              maxLength="6"
            />
            <button type="button" onClick={handleVerifyEmailCode}>
              {isCheckingVerifyCode ? "확인중..." : "확인"}
            </button>
          </div>
          <div className={styles.frm_msg_cont}>
            {isEmailChanged ? (
              verifyEmail ? (
                <span className={`${styles.frm_msg} ${styles.good}`}>
                  변경한 이메일 인증이 완료되었습니다.
                </span>
              ) : verifyRequested ? (
                <span className={styles.frm_msg}>
                  발송된 인증번호를 입력한 뒤 확인 버튼을 눌러주세요.
                </span>
              ) : (
                <span className={`${styles.frm_msg} ${styles.frm_msg_war}`}>
                  이메일을 변경하면 인증이 필요합니다.
                </span>
              )
            ) : (
              <span className={`${styles.frm_msg} ${styles.good}`}>
                현재 이메일을 그대로 사용합니다.
              </span>
            )}
          </div>
        </div>

        <div className="inputbox_cont">
          <h5>생년월일</h5>
          <input
            type="text"
            name="user-birthDate"
            maxLength="6"
            autoComplete="off"
            required="Y"
            placeholder="생년월일 ( 6자 입력 )"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className="inputbox_cont">
          <h5>학교</h5>
          <input
            type="text"
            name="user-school"
            maxLength="50"
            autoComplete="off"
            required="Y"
            placeholder="학교"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
        </div>

        <div className="inputbox_cont">
          <h5>학년</h5>
          <input
            type="text"
            name="user-grade"
            maxLength="10"
            autoComplete="off"
            required="Y"
            placeholder="학년"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>

        <div className="inputbox_cont">
          <h5>주소</h5>
          <div className={styles.select_cont}>
            <select
              className={styles.contry_select}
              onChange={(e) => setCountry(e.target.value)}
              value={country}
            >
              <option value="">국가선택</option>
              <option value="ko">한국</option>
              <option value="en">미국</option>
              <option value="jp">일본</option>
              <option value="cn">중국</option>
            </select>
            <input
              type="text"
              name="user-address"
              autoComplete="off"
              required="Y"
              placeholder="주소"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.mypage_agree}>
          <input
            type="checkbox"
            id="marketing_yn"
            name="marketing_yn"
            checked={consentMarketing}
            value={consentMarketing}
            onChange={(e) => setConsentMarketing(e.target.checked)}
          />
          <label htmlFor="marketing_yn">
            <span>
              커리큘럼, 입시정보, 프로모션 등에 대한 마케팅 메세지 혹은 이메일
              수신에 동의합니다
            </span>
          </label>
        </div>

        <div className="center_btn_wrap">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "저장중..." : "수정하기"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Validate;
