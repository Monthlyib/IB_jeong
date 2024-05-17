import BulletinBoardDetail from "@/components/boardComponents/commonboard/BulletinBoardDetail";

const bulletinBoardDetail = ({ pageId }) => {
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
