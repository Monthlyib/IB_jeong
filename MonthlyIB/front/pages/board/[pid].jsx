import { useRouter } from "next/router";
import AppLayout from "../../main_components/AppLayout";

import NewsDetail from "../../page_components/board/news/NewsDetail";
import BoardCommon from "../../page_components/board/BoardCommon";

const newsDetail = () => {
    const router = useRouter();
    const { pid } = router.query;
    if (!pid) {
        return null;
    }
    return (
        <>
            <AppLayout>
                <NewsDetail pageId={pid} />
            </AppLayout>
        </>
    );
};

export default newsDetail;