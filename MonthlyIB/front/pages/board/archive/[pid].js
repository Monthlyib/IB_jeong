import { useRouter } from "next/router";
import AppLayout from "../../../main_components/AppLayout";

const pid = () => {
  const router = useRouter();
  const { pid } = router.query;
  if (!pid) {
    return null;
  }
  return (
    <>
      <AppLayout>
        {/* <BoardCommon modal={2} />
                <GuideDetail pageId={pid} /> */}
      </AppLayout>
    </>
  );
};

export default pid;
