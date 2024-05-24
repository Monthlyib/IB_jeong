"use client";

import LearningStyleTypes from "./LearningStyleTypes";
import LearningStyleResults from "./LearningStyleResults";
import { useState, useRef } from "react";
import { Questions } from "./LearningStyleContents";

const LearningStyleTest = () => {
  // 클릭 안된 상태 -> -1
  const [type, setType] = useState({
    first: [-1, -1, -1, -1, -1, -1],
    second: [-1, -1, -1, -1, -1],
    third: [-1, -1, -1, -1, -1, -1, -1, -1],
    fourth: [-1, -1, -1, -1, -1],
  });

  const [sumUpData, setSumUpData] = useState([0, 0, 0, 0]);

  const [showResult, setShowResult] = useState(false);

  const moveRef = useRef([]);
  const topRef = useRef([]);

  const onClickCircle = (key_ind, ind, point, type, index) => {
    const temp = { ...type };
    temp[key_ind][ind] = point;
    moveRef?.current[index]?.scrollIntoView({ behavior: "smooth" });
    setType(temp);
  };

  const onClickSumbit = (e) => {
    e.preventDefault();
    const temp = [];
    let index = 0;
    const tempSumUp = [...sumUpData];
    for (let i of Object.keys(type)) {
      temp.push(...type[i]);
      const sum = type[i].reduce((acc, currentVal) => acc + currentVal);
      tempSumUp[index] = sum;
      index++;
    }

    if (!temp.includes(-1)) {
      topRef.current[0]?.scrollIntoView({ behavior: "smooth" });
      setShowResult(true);
      setSumUpData(tempSumUp);
    } else {
      alert("답을 안한 질문이 있습니다.");
    }
  };
  return (
    <>
      <main className="width_content archive">
        <div className="header_flex">
          <div className="header_tit_wrap">
            <span>Learning Type Test</span>
            <h2>학습유형 테스트</h2>
          </div>
        </div>
        {showResult === false ? (
          <>
            <div
              ref={(element) => {
                topRef.current[0] = element;
              }}
            ></div>
            {Object.entries(Questions).map(([key, value]) => (
              // key가 firstsecond third fourth
              // value가 content 설명 // type key에다 몇번째array에 점수 넣는지
              <LearningStyleTypes
                contents={value.contents}
                type={type}
                onClickCircle={onClickCircle}
                key_ind={key}
                key={key}
                moveRef={moveRef}
              />
            ))}
            <div
              className="inputbox_cont"
              style={{ height: 50, textAlign: "center" }}
            >
              <button
                style={{
                  position: "relative",
                  margin: "0 auto",
                  minWidth: "18.5rem",
                }}
                onClick={onClickSumbit}
              >
                제출
              </button>
            </div>
          </>
        ) : (
          <LearningStyleResults
            sumUpData={sumUpData}
            setShowResult={setShowResult}
            setType={setType}
          />
        )}
      </main>
    </>
  );
};

export default LearningStyleTest;
