import { Suspense } from "react";

import Loading from "@/components/Loading";
import IbDetail from "@/components/ibComponents/IbDetail";

export default function IbDetailPage({ params }) {
  return (
    <Suspense fallback={<Loading />}>
      <IbDetail monthlyIbId={Number(params.monthlyIbId)} />
    </Suspense>
  );
}
