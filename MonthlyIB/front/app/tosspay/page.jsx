import { Suspense } from "react";
import Loading from "@/components/Loading";
import TossCheckOut from "@/components/payComponents/TossCheckOut";

const TossWidget = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <TossCheckOut />
      </Suspense>
    </>
  );
};

export default TossWidget;
