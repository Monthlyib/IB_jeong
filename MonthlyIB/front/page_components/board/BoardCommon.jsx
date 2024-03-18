import Link from "next/link";

const BoardCommon = ({ modal }) => {
  return (
    <>
      <div className="archive_tab" style={{ marginBottom: 30 }}>
        <Link href="/board" className={modal === 0 ? "active" : ""}>
          IB 입시뉴스
        </Link>
        <Link href="/board/calc" className={modal === 1 ? "active" : ""}>
          합격예측 계산기
        </Link>
        <Link href="/board/archive" className={modal === 2 ? "active" : ""}>
          자료실
        </Link>
        <Link
          href="/board/bulletinboard"
          className={modal === 3 ? "active" : ""}
        >
          자유게시판
        </Link>
      </div>
    </>
  );
};

export default BoardCommon;
