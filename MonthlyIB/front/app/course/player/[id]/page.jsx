import CoursePlayer from "@/components/courseComponents/CoursePlayer";

const CoursePlayerPage = ({ params }) => {
  return (
    <>
      <CoursePlayer pageId={params.id} />
    </>
  );
};

export default CoursePlayerPage;
