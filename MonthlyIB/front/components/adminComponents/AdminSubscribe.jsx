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
  const {
    subscribeList,
    getSubscribeList,
    editSubscribeItem,
    postSubscribeItem,
  } = useSubscribeStore();
  const { userInfo } = useUserInfo();
  const [subscribeDataList, setSubscribeDataList] = useState({});

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

  const onSubmitReviseSubscribeItem = (item) => {
    setEditModal(!editModal);
    for (let i = 0; i < subscribeDataList[item]?.length; i++) {
      editSubscribeItem(
        subscribeDataList[item][i]?.subscriberId,
        subscribeDataList[item][i]?.title,
        content,
        prices[i],
        numQuestions,
        numTutoring,
        subscribeDataList[item][i]?.subscribeMonthPeriod,
        videoLessonsCount,
        subscribeDataList[item][i]?.videoLessionsIdList,
        color.hex,
        fontColor.hex,
        userInfo
      );
    }
  };
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

  const onChangePrice = (e, i) => {
    const temp = [...prices];
    temp[i] = e.target.value;
    setPrices(temp);
  };

  const onClickEditItem = (itemName) => {
    setEditModal(!editModal);
    setItem(itemName);
  };
  useEffect(() => {
    getSubscribeList();
  }, []);

  useEffect(() => {
    const temp = [...prices];
    if (item !== "") {
      for (let i = 0; i < subscribeDataList[item]?.length; i++) {
        temp[i] = subscribeDataList[item][i]?.price;
      }
      setPrices(temp);
      setNumQuestions(subscribeDataList[item][0]?.questionCount);
      setNumTutoring(subscribeDataList[item][0]?.tutoringCount);
      setColor(subscribeDataList[item][0]?.color);
      setFontColor(subscribeDataList[item][0]?.fontColor);
      setVideoLessonsCount(subscribeDataList[item][0]?.videoLessonsCount);
      setContent(subscribeDataList[item][0]?.content);
    }
  }, [item]);

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

        {editModal === true && (
          <AdminSubscribeModal
            mode={"edit"}
            title={item}
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
