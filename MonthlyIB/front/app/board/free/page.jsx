import Loading from "@/components/Loading";
import BulletinBoardComponents from "@/components/boardComponents/commonboard/BulletinBoardComponents";

import { Suspense } from "react";

const BulletinBoard = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <BulletinBoardComponents />
      </Suspense>
    </>
  );
};

export default BulletinBoard;
