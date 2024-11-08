import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./AdminStyle.module.css";

import { faPlus, faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useSubscribeStore } from "@/store/subscribe";
import shortid from "shortid";
import { useUserInfo } from "@/store/user";
import AdminSubscribeModal from "./AdminSubscribeModal";
import { getKnitSubscribeDataList } from "@/utils/utils";

const AdminSubscribe = () => {
  // 구독 상품 관련 데이터와 함수들을 구독 스토어에서 가져옴
  const {
    subscribeList,
    getSubscribeList,
    editSubscribeItem,
    postSubscribeItem,
  } = useSubscribeStore();
  const { userInfo } = useUserInfo();
  const [subscribeDataList, setSubscribeDataList] = useState({});

  // 모달 상태와 관련된 state들
  const [editModal, setEditModal] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [item, setItem] = useState("");
  const [title, setTitle] = useState("");
  const [prices, setPrices] = useState(["", "", "", ""]);
  const [numQuestions, setNumQuestions] = useState("");
  const [numTutoring, setNumTutoring] = useState("");
  const [color, setColor] = useState("#000");
  const [fontColor, setFontColor] = useState("#000");
  const [content, setContent] = useState("");
  const [videoLessonsCount, setVideoLessonsCount] = useState("");
  const [subscriberIDList, setSubscribeIDList] = useState([]);
  const [subscribemonthPeriods, setSubscribeMonthPeriods] = useState([]);
  const [videoLessonsIDLists, setVideoLessonsIDLists] = useState([]);

  // 구독 상품 수정 제출 함수
  const onSubmitReviseSubscribeItem = (item) => {
    setEditModal(!editModal);
    for (let i = 0; i <prices?.length; i++) {
      editSubscribeItem(
        subscriberIDList[i],
        title,
        content,
        prices[i],
        numQuestions,
        numTutoring,
        subscribemonthPeriods[i],
        videoLessonsCount,
        videoLessonsIDLists[i],
        color.hex,
        fontColor.hex,
        userInfo
      );
    }
  };

  // 구독 상품 추가 제출 함수
  const onSubmitPostSubscribeItem = () => {
    setPostModal(!postModal);
    const subscribeMonthPeriod = [1, 3, 6, 12];
    for (let i = 0; i < 4; i++) {
      postSubscribeItem(
        title,
        content,
        prices[i],
        numQuestions,
        numTutoring,
        subscribeMonthPeriod[i],
        videoLessonsCount,
        [],
        color.hex,
        fontColor.hex,
        userInfo
      );
    }
  };

  // 구독 상품 추가 모달 열기 함수
  const onClickPostModal = () => {
    setPostModal(!postModal);
    setTitle("");
    setPrices([]);
    setNumQuestions("");
    setNumTutoring("");
    setColor("#000");
    setFontColor("#000");
    setVideoLessonsCount("");
    setContent("");
  };

  // 가격 변경 처리 함수
  const onChangePrice = (e, i) => {
    const temp = [...prices];
    temp[i] = e.target.value;
    setPrices(temp);
  };

  // 구독 상품 수정 모달 열기 함수
  const onClickEditItem = (itemName) => {
    setEditModal(!editModal);
    setItem(itemName);
    setTitle(itemName);
  };

  // 컴포넌트 마운트 시 구독 리스트 가져오기
  useEffect(() => {
    getSubscribeList();
  }, []);

  // 선택한 구독 상품의 정보를 수정 모달에 반영
  useEffect(() => {
    const temp = [...prices];

    if (item !== "") {
      const newPrices = Object.values(subscribeDataList[item] || {}).map(
        (data) => data.price
      );
      const newIDs = Object.values(subscribeDataList[item] || {}).map(
        (data) => data.subscriberId
      );
      const newPeriods = Object.values(subscribeDataList[item] || {}).map(
        (data) => data.subscribeMonthPeriod
      );
      const newVideosIDs = Object.values(subscribeDataList[item] || {}).map(
        (data) => data.videoLessonsCount
      );
      setPrices(newPrices);
      setTitle(item)
      setSubscribeIDList(newIDs);
      setSubscribeMonthPeriods(newPeriods);
      setNumQuestions(subscribeDataList[item][0]?.questionCount);
      setNumTutoring(subscribeDataList[item][0]?.tutoringCount);
      setColor(subscribeDataList[item][0]?.color);
      setFontColor(subscribeDataList[item][0]?.fontColor);
      setVideoLessonsCount(subscribeDataList[item][0]?.videoLessonsCount);
      setVideoLessonsIDLists(newVideosIDs);
      setContent(subscribeDataList[item][0]?.content);
    }
  }, [item]);

  // 구독 리스트 데이터를 가공하여 상태에 저장
  useEffect(() => {
    getKnitSubscribeDataList(subscribeList, setSubscribeDataList);
  }, [subscribeList]);

  return (
    <>
      <div className={styles.dashboard_mid_card}>
        <div className={styles.title} style={{ position: "relative" }}>
          구독상품 관리
          <FontAwesomeIcon
            icon={faPlus}
            style={{
              position: "absolute",
              right: "4rem",
              top: "1.8rem",
              fontSize: "2.5rem",
              color: "#51346c",
            }}
            onClick={onClickPostModal}
          />
        </div>
        <div className={styles.subtitle}>
          <div className={styles.username}>Items</div>

          <div style={{ fontSize: "2rem" }}>Tools</div>
        </div>

        {/* 구독 상품 목록 출력 */}
        {Object.keys(subscribeDataList).length > 0 && (
          <>
            {Object.keys(subscribeDataList).map((v) => (
              <div key={shortid.generate()}>
                <hr />
                <div className={styles.users}>
                  {v}
                  <span>
                    <FontAwesomeIcon
                      icon={faPenAlt}
                      onClick={() => onClickEditItem(v)}
                    />
                  </span>
                </div>
                <hr />
              </div>
            ))}
          </>
        )}

        {/* 구독 상품 추가 모달 */}
        {postModal === true && (
          <AdminSubscribeModal
            mode={"post"}
            title={title}
            setTitle={setTitle}
            prices={prices}
            onChangePrice={onChangePrice}
            setEditModal={setPostModal}
            numQuestions={numQuestions}
            setNumQuestions={setNumQuestions}
            numTutoring={numTutoring}
            setNumTutoring={setNumTutoring}
            videoLessonsCount={videoLessonsCount}
            setVideoLessonsCount={setVideoLessonsCount}
            color={color}
            setColor={setColor}
            fontColor={fontColor}
            setFontColor={setFontColor}
            content={content}
            setContent={setContent}
            onSubmit={onSubmitPostSubscribeItem}
          />
        )}

        {/* 구독 상품 수정 모달 */}
        {editModal === true && (
          <AdminSubscribeModal
            mode={"edit"}
            title={title}
            setTitle={setTitle}
            prices={prices}
            onChangePrice={onChangePrice}
            setEditModal={setEditModal}
            numQuestions={numQuestions}
            setNumQuestions={setNumQuestions}
            numTutoring={numTutoring}
            setNumTutoring={setNumTutoring}
            videoLessonsCount={videoLessonsCount}
            setVideoLessonsCount={setVideoLessonsCount}
            color={color}
            setColor={setColor}
            fontColor={fontColor}
            setFontColor={setFontColor}
            content={content}
            setContent={setContent}
            onSubmit={onSubmitReviseSubscribeItem}
            subscribeDataList={subscribeDataList}
          />
        )}
      </div>
    </>
  );
};

export default AdminSubscribe;
