import { useRouter } from "next/router";
import AppLayout from "../../../main_components/AppLayout";

import BulletinBoardDetail from "../../../page_components/board/bulletinboard/BulletinBoardDetail";

const bulletinBoardDetail = () => {
  const router = useRouter();

  const { pid } = router.query;
  if (!pid) {
    return null;
  }
  return (
    <>
      <AppLayout>
        <BulletinBoardDetail pageId={pid} />
      </AppLayout>
    </>
  );
};

export default bulletinBoardDetail;
