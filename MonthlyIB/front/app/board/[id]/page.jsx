import NewsDetail from "@/components/boardComponents/news/NewsDetail";

const NewsDetailPage = ({ params }) => {
  return (
    <>
      <NewsDetail pageId={params.id} />
    </>
  );
};

export default NewsDetailPage;
