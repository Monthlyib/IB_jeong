import BulletinBoardDetail from "@/components/boardComponents/commonboard/BulletinBoardDetail";

const bulletinBoardDetail = ({ params }) => {
  return (
    <>
      <BulletinBoardDetail pageId={params.id} />
    </>
  );
};

export default bulletinBoardDetail;
