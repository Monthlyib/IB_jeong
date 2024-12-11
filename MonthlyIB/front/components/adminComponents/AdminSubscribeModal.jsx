import { use, useRef } from "react";
import styles from "./AdminStyle.module.css";
import { ChromePicker } from "react-color";
import { useUserInfo } from "@/store/user";
import { useSubscribeStore } from "@/store/subscribe";
import { last } from "lodash";

const AdminSubscribeModal = ({
  mode,
  title,
  setTitle,
  prices,
  onChangePrice,
  setEditModal,
  numQuestions = 0,
  setNumQuestions,
  numTutoring = 0,
  setNumTutoring,
  videoLessonsCount = 0,
  setVideoLessonsCount,
  color,
  setColor,
  fontColor,
  setFontColor,
  content,
  setContent,
  onSubmit,
  subscribeDataList,
  isPremium, // Add default value
  setIsPremium, // Add handler for premium toggle
}) => {
  const closeRef = useRef();
  const { userInfo } = useUserInfo();
  const { deleteSubscribeItem } = useSubscribeStore();

  const onClickDelete = () => {
    for (let i = 0; i < 4; i++)
      deleteSubscribeItem(subscribeDataList[title][i]?.subscriberId, userInfo);
    setEditModal(false);
  };

  return (
    <div className={styles.md}>
      <div
        className={styles.md_box_flex}
        ref={closeRef}
        onClick={(e) => closeRef.current === e.target && setEditModal(false)}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className={styles.admin_box}
          style={{
            width: "130rem",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className={styles.md_top}>
              <div className={styles.tit}>
                <input
                  type="text"
                  required
                  placeholder="상품 이름 입력"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span>1개월 가격</span>
                <input
                  type="number"
                  autoComplete="off"
                  required
                  placeholder="1개월 가격"
                  value={prices[0]}
                  onChange={(e) => onChangePrice(e, 0)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span>3개월 가격</span>
                <input
                  type="number"
                  autoComplete="off"
                  required
                  placeholder="3개월 가격"
                  value={prices[1]}
                  onChange={(e) => onChangePrice(e, 1)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span>6개월 가격</span>
                <input
                  type="number"
                  autoComplete="off"
                  required
                  placeholder="6개월 가격"
                  value={prices[2]}
                  onChange={(e) => onChangePrice(e, 2)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span>12개월 가격</span>
                <input
                  type="number"
                  autoComplete="off"
                  required
                  placeholder="12개월 가격"
                  value={prices[3]}
                  onChange={(e) => onChangePrice(e, 3)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span>질문 갯수</span>
                <input
                  type="number"
                  autoComplete="off"
                  required
                  placeholder="질문 갯수"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span>튜터링 갯수</span>
                <input
                  type="number"
                  autoComplete="off"
                  required
                  placeholder="튜터링 갯수"
                  value={numTutoring}
                  onChange={(e) => setNumTutoring(e.target.value)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span style={{ fontSize: "1.5rem" }}>영상강의 열람횟수</span>
                <input
                  type="number"
                  autoComplete="off"
                  required
                  placeholder="영상강의 열람 횟수"
                  value={videoLessonsCount}
                  onChange={(e) => setVideoLessonsCount(e.target.value)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span>프리미엄 여부</span>
                <label className={styles.toggle_switch}>
                  <input
                    type="checkbox"
                    checked={isPremium} // 상태 값에 따라 체크 여부 설정
                    onChange={(e) => setIsPremium(e.target.checked)} // 변경 이벤트에서 상태 업데이트
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className={styles.subscribe_price_flex}>
              <span>상품 배경색</span>
              <ChromePicker
                color={color}
                onChange={setColor}
                disableAlpha={true}
              />
            </div>
            <div className={styles.subscribe_price_flex}>
              <span>글씨색</span>
              <ChromePicker
                color={fontColor}
                onChange={setFontColor}
                disableAlpha={true}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className={styles.subscribe_content}>
              혜택 입력 (꼭 혜택마다 줄바꿈 해주세요.)
            </div>
            <textarea
              className={styles.subscribe_content_text}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
            <button
              type="button"
              className={styles.md_btn}
              onClick={() => onSubmit(title)}
            >
              {mode === "edit" ? "수정" : "생성"}
            </button>

            {mode === "edit" && (
              <button
                type="button"
                className={styles.delete}
                style={{ width: "100%", marginTop: "2rem" }}
                onClick={onClickDelete}
              >
                삭제
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={styles.md_dim}></div>
    </div>
  );
};

export default AdminSubscribeModal;