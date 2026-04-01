import Loading from "@/components/Loading";
import HomeBuilder from "@/components/adminComponents/homeBuilder/HomeBuilder";
import { Suspense } from "react";

export default function HomeBuilderPage() {
  return (
    <Suspense fallback={<Loading />}>
      <HomeBuilder />
    </Suspense>
  );
}
