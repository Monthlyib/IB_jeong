import Loading from "@/components/Loading";
import AIToolsMain from "@/components/aiComponents/AIToolsMain";
import { Suspense } from "react";
const aiHome = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AIToolsMain />
      </Suspense>
    </>
  );
};

export default aiHome;
