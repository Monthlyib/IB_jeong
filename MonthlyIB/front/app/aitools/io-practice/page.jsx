import Loading from "@/components/Loading";
import AIIoPractice from "@/components/aiComponents/io_practice/AIIoPractice";
import { Suspense } from "react";
const AIIoPracticePage = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AIIoPractice />
      </Suspense>
    </>
  );
};

export default AIIoPracticePage;
