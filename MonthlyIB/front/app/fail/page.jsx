import { Suspense } from "react";
import Loading from "@/components/Loading";
import { PayFail } from "@/components/payComponents/PayFail";

const FailPage = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <PayFail />
      </Suspense>
    </>
  );
};

export default FailPage;
