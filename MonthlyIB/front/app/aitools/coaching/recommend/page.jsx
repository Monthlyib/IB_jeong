import Loading from "@/components/Loading";
import AICoachingRecommend from "@/components/aiComponents/coaching/AICoachingRecommend";
import { Suspense } from "react";
const AICoachingPage = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AICoachingRecommend />
      </Suspense>
    </>
  );
};

export default AICoachingPage;
