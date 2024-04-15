import { useRouter } from "next/router";

import BulletinBoardDetail from "../../../../components/boardComponents/commonboard/BulletinBoardDetail";

const bulletinBoardDetail = () => {
  const router = useRouter();

  const { pid } = router.query;
  if (!pid) {
    return null;
  }
  return (
    <>
      <BulletinBoardDetail pageId={pid} />
    </>
  );
};

export default bulletinBoardDetail;
