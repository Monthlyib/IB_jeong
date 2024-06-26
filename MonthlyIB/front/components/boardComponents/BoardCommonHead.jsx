import BoardCommon from "./BoardCommon";

const BoardCommonHead = ({
  searchKeyword,
  setSeraching,
  modal,
  placeholder,
}) => {
  const onChangeSearch = (e) => {
    searchKeyword.current = e.target.value;
  };
  const onClickSearchButton = () => {
    setSeraching((prev) => !prev);
  };
  return (
    <>
      <div className="header_flex">
        <div className="header_tit_wrap">
          <span>Library</span>
          <h2>자료실</h2>
        </div>

        <div className="ft_search">
          <input
            type="text"
            placeholder={placeholder}
            defaultValue={searchKeyword.current}
            onChange={onChangeSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onClickSearchButton();
              }
            }}
          />
          <button onClick={onClickSearchButton}>검색</button>
        </div>
      </div>
      <BoardCommon modal={modal} />
    </>
  );
};

export default BoardCommonHead;
