import IbComponents from "@/components/ibComponents/IbComponents";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export default function IbPost() {
  return (
    <Suspense fallback={<Loading />}>
      <IbComponents />;
    </Suspense>
  );
}
