import Loading from "@/components/Loading";
import ArchiveComponents from "@/components/storeComponents/ArchiveComponents";
import { Suspense } from "react";

const Archive = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <ArchiveComponents />
      </Suspense>
    </>
  );
};

export default Archive;
