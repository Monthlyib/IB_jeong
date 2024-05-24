import NewsPost from "@/components/boardComponents/news/NewsPost";
import { Suspense } from "react";

const NewsWrite = () => {
  return (
    <>
      <Suspense>
        <NewsPost />
      </Suspense>
    </>
  );
};

export default NewsWrite;
