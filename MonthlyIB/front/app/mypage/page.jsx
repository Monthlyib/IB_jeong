import MyPageComponents from "@/components/mypageComponents/MyPageComponents";
import { Suspense } from "react";
import Loading from "@/components/Loading";

const MyPageHome = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <MyPageComponents />
      </Suspense>
    </>
  );
};

export default MyPageHome;
