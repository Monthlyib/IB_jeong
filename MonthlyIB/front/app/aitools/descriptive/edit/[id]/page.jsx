import Loading from "@/components/Loading";
import AdminDescriptiveTestEdit from "@/components/aiComponents/descriptive_test/AdminDescriptiveTestEdit";

import { Suspense } from "react";
const AIchaptertest = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AdminDescriptiveTestEdit />
      </Suspense>
    </>
  );
};

export default AIchaptertest;
