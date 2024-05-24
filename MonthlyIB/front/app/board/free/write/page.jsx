import BulletinBoardPost from "@/components/boardComponents/commonboard/BulletinBoardPost";
import { Suspense } from "react";

const BulletinBoardWrite = () => {
  return (
    <>
      <Suspense>
        <BulletinBoardPost />
      </Suspense>
    </>
  );
};

export default BulletinBoardWrite;
