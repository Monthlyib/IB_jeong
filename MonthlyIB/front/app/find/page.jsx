import Find from "@/components/loginComponents/Find";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export default function FindPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Find />;
    </Suspense>
  );
}
