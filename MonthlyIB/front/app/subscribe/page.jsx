import SubscribeComponents from "@/components/subscribeComponents/SubscribeComponents";
import { Suspense } from "react";

export default async function SubscribePage() {
  return (
    <>
      <Suspense>
        <SubscribeComponents />
      </Suspense>
    </>
  );
}
