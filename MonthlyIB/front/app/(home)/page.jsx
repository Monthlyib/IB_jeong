import Loading from "@/components/Loading";
import Main from "@/components/homeComponents/Main";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <Main />;
    </Suspense>
  );
}
