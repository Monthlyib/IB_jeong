import Loading from "@/components/Loading";
import AIEssay from "@/components/aiComponents/essay/AIEssay";
import { Suspense } from "react";
const AIEssayPage = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AIEssay />
      </Suspense>
    </>
  );
};

export default AIEssayPage;
