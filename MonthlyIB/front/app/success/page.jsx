import { Suspense } from "react";
import Loading from "@/components/Loading";
import { PaySuccess } from "@/components/payComponents/PaySuccess";

const SuccessPage = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <PaySuccess />
      </Suspense>
    </>
  );
};

export default SuccessPage;
