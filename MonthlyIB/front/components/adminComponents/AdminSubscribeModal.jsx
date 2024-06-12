import { useRef } from "react";
import styles from "./AdminStyle.module.css";
import { ChromePicker } from "react-color";
import { useUserStore } from "@/store/user";
import { useSubscribeStore } from "@/store/subscribe";
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
  subscirbeDataList,
}) => {
  const closeRef = useRef();
  const { userInfo } = useUserStore();
  const { deleteSubscribeItem } = useSubscribeStore();

  const onClickDelete = () => {
    for (let i = 0; i < 4; i++)
      deleteSubscribeItem(subscirbeDataList[title][i]?.subscriberId, userInfo);
    setEditModal(false);
  };
  console.log(subscirbeDataList[title]);
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
                {mode === "edit" ? (
                  `${title} 수정`
                ) : (
                  <input
                    type="text"
                    required="Y"
                    placeholder="상품 이름 입력"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                )}
              </div>
              <div className={styles.subscribe_price_flex}>
                <span>1개월 가격</span>
                <input
                  type="number"
                  autoFocus="true"
                  autoComplete="off"
                  required="Y"
                  placeholder="1개월 가격"
                  value={prices[0]}
                  onChange={(e) => onChangePrice(e, 0)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span>3개월 가격</span>
                <input
                  type="number"
                  autoFocus="true"
                  autoComplete="off"
                  required="Y"
                  placeholder="3개월 가격"
                  value={prices[1]}
                  onChange={(e) => onChangePrice(e, 1)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span>6개월 가격</span>
                <input
                  type="number"
                  autoFocus="true"
                  autoComplete="off"
                  required="Y"
                  placeholder="6개월 가격"
                  value={prices[2]}
                  onChange={(e) => onChangePrice(e, 2)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span>12개월 가격</span>
                <input
                  type="number"
                  autoFocus="true"
                  autoComplete="off"
                  required="Y"
                  placeholder="12개월 가격"
                  value={prices[3]}
                  onChange={(e) => onChangePrice(e, 3)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span>질문 갯수</span>
                <input
                  type="number"
                  autoFocus="true"
                  autoComplete="off"
                  required="Y"
                  placeholder="질문 갯수"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span>튜터링 갯수</span>
                <input
                  type="number"
                  autoFocus="true"
                  autoComplete="off"
                  required="Y"
                  placeholder="튜터링 갯수"
                  value={numTutoring}
                  onChange={(e) => setNumTutoring(e.target.value)}
                />
              </div>
              <div className={styles.subscribe_price_flex}>
                <span style={{ fontSize: "1.5rem" }}>영상강의 열람횟수</span>
                <input
                  type="number"
                  autoFocus="true"
                  autoComplete="off"
                  required="Y"
                  placeholder="영상강의 열람 횟수"
                  value={videoLessonsCount}
                  onChange={(e) => setVideoLessonsCount(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className={styles.subscribe_price_flex}>
              <span>상품 배경색</span>
              <ChromePicker color={color} onChange={setColor} />
            </div>
            <div className={styles.subscribe_price_flex}>
              <span>글씨색</span>
              <ChromePicker color={fontColor} onChange={setFontColor} />
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
              수정
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
