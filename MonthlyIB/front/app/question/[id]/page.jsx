import QuestionDetail from "@/components/questionComponents/QuestionDetail";

const QuestionDetailItem = ({ params }) => {
  return (
    <>
      <QuestionDetail pageId={params.id} />
    </>
  );
};

export default QuestionDetailItem;
