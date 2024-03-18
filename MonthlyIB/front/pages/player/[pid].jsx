import { useRouter } from "next/router";
import CoursePlayer from "../../page_components/course/CoursePlayer";

const Player = () => {
  const router = useRouter();
  console.log(router.query);
  const { pid, courseDetail } = router.query;
  if (!pid) {
    return null;
  }
  console.log("courseDetail ", courseDetail);
  return (
    <>
      <CoursePlayer courseDetail={courseDetail} pageId={pid} />
    </>
  );
};

export default Player;
