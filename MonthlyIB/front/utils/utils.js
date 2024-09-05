export const getKnitSubscribeDataList = (
  subscribeList,
  setSubscribeDataList
) => {
  const planNames = [];
  const temp = [];
  const tempObj = {};
  const newTempObj = {};
  let testingObj = {};

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

  for (let i = 0; i < planNames.length; i++) {
    if (!Object.keys(tempObj).includes(planNames[i])) {
      tempObj[planNames[i]] = subscribeList.filter((item) => {
        return item.title === planNames[i];
      });
      const entris = Object.entries(Object.values(tempObj[planNames[i]])).sort(
        (a, b) => a[1].subscribeMonthPeriod - b[1].subscribeMonthPeriod
      );
      let j = 0;
      for (let val of entris) {
        testingObj[j] = val[1];
        j++;
      }
      newTempObj[planNames[i]] = testingObj;
      testingObj = {};
    }
  }
  setSubscribeDataList(newTempObj);
};

export const adjustWindowSize = (setWindowSize) => {
  if (typeof window !== "undefined") {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  } else {
    return () =>
      window.removeEventListener("resize", () => {
        return null;
      });
  }
};
