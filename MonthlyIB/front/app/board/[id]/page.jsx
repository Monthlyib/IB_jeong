import NewsDetail from "@/components/boardComponents/news/NewsDetail";
import Loading from "@/components/Loading";
import { Suspense } from "react";
const NewsDetailPage = ({ params }) => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <NewsDetail pageId={params.id} />
      </Suspense>
    </>
  );
};

export default NewsDetailPage;
