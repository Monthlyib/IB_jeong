import CourseDetail from "@/components/courseComponents/CourseDetail";

const CourseDetailPage = ({ params }) => {
  return (
    <>
      <CourseDetail pageId={params.id} />
    </>
  );
};

export default CourseDetailPage;
