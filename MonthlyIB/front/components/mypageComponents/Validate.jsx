"use client";
import Image from "next/image";
import styles from "./MyPage.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";
import { openAPIVerifyEmail, openAPIVerifyNum } from "@/apis/openAPI";
import { userPostImage, userReviseInfo } from "@/apis/userAPI";

const Validate = () => {
  const router = useRouter();

  const pattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  const { userInfo, userDetailInfo, getUserInfo } = useUserStore();
  const imageInput = useRef();

  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [country, setCountry] = useState("");
  const [consent_marketing, setMarketing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    getUserInfo(userInfo.userId, userInfo);
  }, []);
  useEffect(() => {
    if (userDetailInfo?.userStatus === "ACTIVE") {
      setName(userDetailInfo.nickName);
      setEmail(userDetailInfo.email);
      setAddress(userDetailInfo?.address);
      setDob(userDetailInfo?.birth);
      setSchool(userDetailInfo?.school);
      setCountry(userDetailInfo?.country);
      setGrade(userDetailInfo?.grade);
      setMarketing(userDetailInfo?.marketingTermsCheck);
    }
  }, [userDetailInfo]);

  const changeFileName = (file) => {
    const fileExtention = file.name.split(".")[1];
    const oldFileName = file.name.split(".")[0];
    const date = new Date();
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);
    var timeString = hours + ":" + minutes + ":" + seconds;
    const newFile = new File(
      [file],
      `${oldFileName}_${timeString}.${fileExtention}`,
      {
        type: file.type,
      }
    );
    return newFile;
  };

  const onClickImageUpload = (e) => {
    imageInput.current = changeFileName(e.target.files[0]);
  };

  const onChangeEmail = useCallback(
    (e) => {
      setEmail(e.target.value);
    },
    [email]
  );

  const onChangeBirthDate = useCallback(
    (e) => {
      setDob(e.target.value);
    },
    [dob]
  );

  const onChangeSchool = useCallback(
    (e) => {
      setSchool(e.target.value);
    },
    [school]
  );

  const onChangeGrade = useCallback(
    (e) => {
      setGrade(e.target.value);
    },
    [grade]
  );

  const onChangeCountry = useCallback(
    (e) => {
      setCountry(e.target.value);
    },
    [country]
  );

  const onChangeAddress = useCallback(
    (e) => {
      setAddress(e.target.value);
    },
    [address]
  );

  const onChangeMarketing = useCallback((e) => {
    setMarketing(e.target.checked);
  }, []);

  const onChangeName = useCallback(
    (e) => {
      setName(e.target.value);
    },
    [name]
  );

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
    },
    [password]
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  const onClickVerifyEmail = useCallback(() => {
    openAPIVerifyEmail(email);
  }, [email]);

  const onClickVerifyEmailNum = useCallback(async () => {
    const res = await openAPIVerifyNum(email, verifyNum);
    if (res?.result.status === 200) setVerifyEmail(true);
    else if (res?.message === "잘못된 인증 번호 입니다.") {
      setVerifyEmail(false);
      alert("잘못된 인증 번호 입니다.");
    } else {
      alert("다시 시도해주세요.");
    }
  }, [email]);

  const onSubmitChangeName = useCallback(
    async (e) => {
      e.preventDefault();
      const res = await userReviseInfo(
        userDetailInfo?.userId,
        userDetailInfo?.password,
        userDetailInfo?.email,
        name,
        userDetailInfo?.birth,
        userDetailInfo?.school,
        userDetailInfo?.grade,
        userDetailInfo?.address,
        userDetailInfo?.country,
        userDetailInfo?.userStatus,
        userDetailInfo?.authority,
        userDetailInfo?.memo,
        userDetailInfo?.marketingTermsCheck,
        userInfo
      );
      if (res.result.status === 200 && imageInput.current) {
        await userPostImage(
          userDetailInfo?.userId,
          imageInput.current,
          userInfo
        );
      }
    },
    [name, imageInput]
  );

  const onSubmitForm = (e) => {
    e.preventDefault();

    if (password === "") {
      userReviseInfo(
        userDetailInfo?.userId,
        userDetailInfo?.password,
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
        consent_marketing,
        userInfo
      );
    } else {
      userReviseInfo(
        userDetailInfo?.userId,
        password,
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
        consent_marketing,
        userInfo
      );
    }

    router.push("/mypage");
  };
  console.log(userDetailInfo);
  return (
    <>
      <main className="width_content min_content member">
        <div className="header_tit_wrap tit_center">
          <h2>정보수정</h2>
        </div>

        <form onSubmit={onSubmitForm}>
          <div className={styles.profile_change}>
            <figure>
              <Image
                src={
                  userDetailInfo?.userImage === null
                    ? "/img/common/user_profile.jpg"
                    : userDetailInfo?.userImage?.fileUrl
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
                    onChange={onChangeName}
                  />
                  <button type="button" onClick={onSubmitChangeName}>
                    변경
                  </button>
                </div>
              </div>

              <label className="file_profile_btn">
                <input
                  type="file"
                  className="profile_image"
                  name="profile_image"
                  onChange={onClickImageUpload}
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
              value={userInfo.username}
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
              onChange={onChangePassword}
            />
            <div className={styles.frm_msg_cont}>
              {password === "" || !pattern.test(password) ? (
                <span className={styles.frm_msg}>
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
              onChange={onChangePasswordCheck}
            />
            <div className={styles.frm_msg_cont}>
              {passwordCheck === "" ? (
                <span className={styles.frm_msg}>
                  비밀번호를 다시 입력해주세요.
                </span>
              ) : passwordError === true ? (
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
                onChange={onChangeEmail}
              />
              <button type="button" onClick={onClickVerifyEmail}>
                인증번호 발송
              </button>
            </div>
          </div>

          <div className="inputbox_cont">
            <div className="input_btn_wrap">
              <input
                type="text"
                name="email_confirm"
                required={userDetailInfo?.email !== email}
                onClick={onClickVerifyEmailNum}
                placeholder="인증번호"
                maxLength="6"
              />
              <button type="button">확인</button>
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
              onChange={onChangeBirthDate}
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
              onChange={onChangeSchool}
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
              onChange={onChangeGrade}
            />
          </div>

          <div className="inputbox_cont">
            <h5>주소</h5>
            <div className={styles.select_cont}>
              <select
                className={styles.contry_select}
                onChange={onChangeCountry}
                value={country}
              >
                <option>국가선택</option>
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
                onChange={onChangeAddress}
              />
            </div>
          </div>

          <div className={styles.mypage_agree}>
            <input
              type="checkbox"
              id="marketing_yn"
              name="marketing_yn"
              checked={consent_marketing}
              value={consent_marketing}
              onChange={onChangeMarketing}
            />
            <label htmlFor="marketing_yn">
              <span>
                {" "}
                커리큘럼, 입시정보, 프로모션 등에 대한 마케팅 메세지 혹은 이메일
                수신에 동의합니다
              </span>
            </label>
          </div>

          <div className="center_btn_wrap">
            <button type="submit">수정하기</button>
          </div>
        </form>
      </main>
    </>
  );
};

export default Validate;
