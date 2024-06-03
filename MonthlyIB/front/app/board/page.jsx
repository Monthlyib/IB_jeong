import Loading from "@/components/Loading";
import NewsComponents from "@/components/boardComponents/news/NewsComponents";
import { Suspense } from "react";
const BoardHome = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <NewsComponents />
      </Suspense>
    </>
  );
};

export default BoardHome;
