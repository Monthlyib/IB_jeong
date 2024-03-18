import BoardCommon from "./BoardCommon";

const GuideComponent = () => {

    return (
        <>
            <main className="width_content archive" >
                <div className="header_flex">
                    <div className="header_tit_wrap">
                        <span>Library</span>
                        <h2>자료실</h2>
                    </div>
                </div>

                <BoardCommon modal={2} />
                <h1>수험가이드는 없어지고 다른걸로 대체될 예정입니다.</h1>
            </main>
        </>

    );
};

export default GuideComponent;