import Loading from "@/components/Loading";
import AICoachingGuideForm from "@/components/aiComponents/coaching/AICoachingGuideForm";
import { Suspense } from "react";
const AICoachingPage = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AICoachingGuideForm />
      </Suspense>
    </>
  );
};

export default AICoachingPage;
