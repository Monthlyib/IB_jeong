import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./AdminStyle.module.css";

import { faPlus, faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import { useSubscribeStore } from "@/store/subscribe";
import { useUserInfo } from "@/store/user";
import AdminSubscribeModal from "./AdminSubscribeModal";
import { getKnitSubscribeDataList } from "@/utils/utils";
import Paginatation from "../layoutComponents/Paginatation";
import { formatQuotaSummary } from "@/utils/subscribeUtils";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const SORT_LABELS = {
  title: "Items",
  planCount: "Plans",
  questionSummary: "질문",
  tutoringSummary: "튜터링",
  courseSummary: "강의",
};

const compareText = (left = "", right = "", direction = "asc") => {
  const result = String(left).localeCompare(String(right), "ko", {
    numeric: true,
    sensitivity: "base",
  });
  return direction === "asc" ? result : -result;
};

const compareNumber = (left = 0, right = 0, direction = "asc") => {
  const result = left - right;
  return direction === "asc" ? result : -result;
};

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
  const [subscriberIDList, setSubscribeIDList] = useState([]);
  const [subscribemonthPeriods, setSubscribeMonthPeriods] = useState([]);
  const [unlimitedQuestions, setUnlimitedQuestions] = useState(false);
  const [unlimitedTutoring, setUnlimitedTutoring] = useState(false);
  const [unlimitedVideoLessons, setUnlimitedVideoLessons] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const subscribeItems = useMemo(
    () =>
      Object.entries(subscribeDataList).map(([planTitle, planMap]) => {
        const plans = Object.values(planMap || {});
        const basePlan = plans[0] || {};

        return {
          title: planTitle,
          planCount: plans.length,
          questionSummary: formatQuotaSummary(
            basePlan.questionCount,
            basePlan.unlimitedQuestions,
            "질문"
          ),
          tutoringSummary: formatQuotaSummary(
            basePlan.tutoringCount,
            basePlan.unlimitedTutoring,
            "튜터링"
          ),
          courseSummary: formatQuotaSummary(
            basePlan.videoLessonsCount,
            basePlan.unlimitedVideoLessons,
            "강의"
          ),
        };
      }),
    [subscribeDataList]
  );

  const sortedSubscribeItems = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return subscribeItems;
    }

    const nextList = [...subscribeItems];
    nextList.sort((left, right) => {
      if (sortConfig.key === "planCount") {
        return compareNumber(left.planCount, right.planCount, sortConfig.direction);
      }
      return compareText(left[sortConfig.key], right[sortConfig.key], sortConfig.direction);
    });
    return nextList;
  }, [sortConfig, subscribeItems]);

  const totalPages = Math.max(1, Math.ceil(sortedSubscribeItems.length / pageSize));
  const paginatedSubscribeItems = sortedSubscribeItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    getSubscribeList();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (item !== "") {
      const tempItem = subscribeDataList[item] || {};
      const newPrices = Object.values(tempItem).map((data) => data.price);
      const newIDs = Object.values(tempItem).map((data) => data.subscriberId);
      const newPeriods = Object.values(tempItem).map(
        (data) => data.subscribeMonthPeriod
      );
      setPrices(newPrices);
      setTitle(item);
      setSubscribeIDList(newIDs);
      setSubscribeMonthPeriods(newPeriods);
      setNumQuestions(tempItem[0]?.questionCount);
      setNumTutoring(tempItem[0]?.tutoringCount);
      setColor(tempItem[0]?.color);
      setFontColor(tempItem[0]?.fontColor);
      setVideoLessonsCount(tempItem[0]?.videoLessonsCount);
      setContent(tempItem[0]?.content);
      setUnlimitedQuestions(Boolean(tempItem[0]?.unlimitedQuestions));
      setUnlimitedTutoring(Boolean(tempItem[0]?.unlimitedTutoring));
      setUnlimitedVideoLessons(Boolean(tempItem[0]?.unlimitedVideoLessons));
    }
  }, [item, subscribeDataList]);

  useEffect(() => {
    getKnitSubscribeDataList(subscribeList, setSubscribeDataList);
  }, [subscribeList]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key: null, direction: null };
    });
    setCurrentPage(1);
  };

  const renderSortLabel = (key) => {
    if (sortConfig.key !== key) {
      return `${SORT_LABELS[key]} ↕`;
    }
    return `${SORT_LABELS[key]} ${
      sortConfig.direction === "asc" ? "↑" : "↓"
    }`;
  };

  const normalizePickerColor = (value) =>
    typeof value === "string" ? value : value?.hex || "#000000";

  const buildPlanPayload = (price, subscribeMonthPeriod) => ({
    title,
    content,
    price: Number(price),
    questionCount: Number(numQuestions || 0),
    unlimitedQuestions,
    tutoringCount: Number(numTutoring || 0),
    unlimitedTutoring,
    subscribeMonthPeriod: Number(subscribeMonthPeriod || 0),
    videoLessonsCount: Number(videoLessonsCount || 0),
    unlimitedVideoLessons,
    videoLessonsIdList: [],
    color: normalizePickerColor(color),
    fontColor: normalizePickerColor(fontColor),
  });

  const onSubmitReviseSubscribeItem = () => {
    setEditModal(false);
    for (let i = 0; i < prices?.length; i++) {
      editSubscribeItem(
        subscriberIDList[i],
        buildPlanPayload(prices[i], subscribemonthPeriods[i]),
        userInfo
      );
    }
  };

  const onSubmitPostSubscribeItem = () => {
    setPostModal(false);
    const subscribeMonthPeriod = [1, 3, 6, 12];
    for (let i = 0; i < 4; i++) {
      postSubscribeItem(buildPlanPayload(prices[i], subscribeMonthPeriod[i]), userInfo);
    }
  };

  const onClickPostModal = () => {
    setPostModal(true);
    setTitle("");
    setPrices(["", "", "", ""]);
    setNumQuestions("");
    setNumTutoring("");
    setColor("#000");
    setFontColor("#000");
    setVideoLessonsCount("");
    setContent("");
    setUnlimitedQuestions(false);
    setUnlimitedTutoring(false);
    setUnlimitedVideoLessons(false);
  };

  const onChangePrice = (e, i) => {
    const temp = [...prices];
    temp[i] = e.target.value;
    setPrices(temp);
  };

  const onClickEditItem = (itemName) => {
    setEditModal(true);
    setItem(itemName);
    setTitle(itemName);
  };

  return (
    <>
      <div className={styles.dashboard_mid_card}>
        <div className={styles.title}>
          구독상품 관리
          <FontAwesomeIcon
            icon={faPlus}
            className={styles.titleAction}
            onClick={onClickPostModal}
          />
        </div>

        <div className={styles.tableToolbar}>
          <div className={styles.tableMeta}>
            <strong>{sortedSubscribeItems.length}</strong>
            <span>개의 상품</span>
          </div>

          <label className={styles.rowsPerPage}>
            <span>항목 보기</span>
            <select value={pageSize} onChange={handlePageSizeChange}>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}개씩 보기
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={`${styles.subtitle} ${styles.subscribeGridDetailed}`}>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("title")}
          >
            {renderSortLabel("title")}
          </button>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("planCount")}
          >
            {renderSortLabel("planCount")}
          </button>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("questionSummary")}
          >
            {renderSortLabel("questionSummary")}
          </button>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("tutoringSummary")}
          >
            {renderSortLabel("tutoringSummary")}
          </button>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("courseSummary")}
          >
            {renderSortLabel("courseSummary")}
          </button>
        </div>

        <div className={styles.tableBody}>
          {paginatedSubscribeItems.map((subscribeItem) => (
            <div key={subscribeItem.title} className={styles.tableRowWrap}>
              <div className={`${styles.users} ${styles.subscribeGridDetailed}`}>
                <div className={`${styles.tableCell} ${styles.subscribeItemCell}`}>
                  <span>{subscribeItem.title}</span>
                  <FontAwesomeIcon
                    icon={faPenAlt}
                    onClick={() => onClickEditItem(subscribeItem.title)}
                  />
                </div>
                <div className={styles.tableCell}>{subscribeItem.planCount}개</div>
                <div className={styles.tableCell}>{subscribeItem.questionSummary}</div>
                <div className={styles.tableCell}>{subscribeItem.tutoringSummary}</div>
                <div className={styles.tableCell}>{subscribeItem.courseSummary}</div>
              </div>
            </div>
          ))}
        </div>

        {sortedSubscribeItems.length > 0 && (
          <Paginatation
            contents={sortedSubscribeItems}
            currentPage={currentPage}
            numShowContents={pageSize}
            onPageChange={handlePageChange}
          />
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
            unlimitedQuestions={unlimitedQuestions}
            setUnlimitedQuestions={setUnlimitedQuestions}
            unlimitedTutoring={unlimitedTutoring}
            setUnlimitedTutoring={setUnlimitedTutoring}
            unlimitedVideoLessons={unlimitedVideoLessons}
            setUnlimitedVideoLessons={setUnlimitedVideoLessons}
            onSubmit={onSubmitPostSubscribeItem}
          />
        )}

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
            unlimitedQuestions={unlimitedQuestions}
            setUnlimitedQuestions={setUnlimitedQuestions}
            unlimitedTutoring={unlimitedTutoring}
            setUnlimitedTutoring={setUnlimitedTutoring}
            unlimitedVideoLessons={unlimitedVideoLessons}
            setUnlimitedVideoLessons={setUnlimitedVideoLessons}
            onSubmit={onSubmitReviseSubscribeItem}
            subscribeDataList={subscribeDataList}
          />
        )}
      </div>
    </>
  );
};

export default AdminSubscribe;
