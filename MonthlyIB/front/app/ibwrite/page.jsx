import IBPost from "@/components/ibComponents/IBPost";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export default function IbWrite() {
  return (
    <Suspense fallback={<Loading />}>
      <IBPost />
    </Suspense>
  );
}
