import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./AdminStyle.module.css";

import { faPlus, faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useSubscribeStore } from "@/store/subscribe";
import shortid from "shortid";
import { useUserStore } from "@/store/user";
import AdminSubscribeModal from "./AdminSubscribeModal";

const AdminSubscribe = () => {
  const {
    subscribeList,
    getSubscribeList,
    editSubscribeItem,
    postSubscribeItem,
  } = useSubscribeStore();
  const { userInfo } = useUserStore();
  const [subscirbeDataList, setSubscribeDataList] = useState({});

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
    for (let i = 0; i < subscirbeDataList[item]?.length; i++) {
      editSubscribeItem(
        subscirbeDataList[item][i]?.subscriberId,
        subscirbeDataList[item][i]?.title,
        content,
        prices[i],
        numQuestions,
        numTutoring,
        subscirbeDataList[item][i]?.subscribeMonthPeriod,
        videoLessonsCount,
        subscirbeDataList[item][i]?.videoLessionsIdList,
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
      for (let i = 0; i < subscirbeDataList[item]?.length; i++) {
        temp[i] = subscirbeDataList[item][i]?.price;
      }
      setPrices(temp);
      setNumQuestions(subscirbeDataList[item][0]?.questionCount);
      setNumTutoring(subscirbeDataList[item][0]?.tutoringCount);
      setColor(subscirbeDataList[item][0]?.color);
      setFontColor(subscirbeDataList[item][0]?.fontColor);
      setVideoLessonsCount(subscirbeDataList[item][0]?.videoLessonsCount);
      setContent(subscirbeDataList[item][0]?.content);
    }
  }, [item]);

  useEffect(() => {
    console.log(prices);
  }, [prices]);
  const planNames = [];

  useEffect(() => {
    const temp = [];
    temp.push(
      subscribeList.filter((item, index, array) => {
        return array.findIndex((i) => i.title === item.title) === index;
      })
    );

    for (let i = 0; i < temp[0].length; i++) {
      if (!temp[0][i].title.includes("ORI")) {
        planNames.push(temp[0][i].title);
      }
    }

    const tempObj = {};

    for (let i = 0; i < planNames.length; i++) {
      if (!Object.keys(tempObj).includes(planNames[i])) {
        tempObj[planNames[i]] = subscribeList.filter((item) => {
          return item.title === planNames[i];
        });
      }
    }
    setSubscribeDataList(tempObj);
    console.log(subscirbeDataList);
    console.log(subscribeList);
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

        {Object.keys(subscirbeDataList).length > 0 && (
          <>
            {Object.keys(subscirbeDataList).map((v) => (
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
            subscirbeDataList={subscirbeDataList}
          />
        )}
      </div>
    </>
  );
};

export default AdminSubscribe;
