import Loading from "@/components/Loading";
import AICoaching from "@/components/aiComponents/coaching/AICoaching";
import { Suspense } from "react";
const AICoachingPage = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AICoaching />
      </Suspense>
    </>
  );
};

export default AICoachingPage;
