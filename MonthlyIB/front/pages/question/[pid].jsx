import { useRouter } from "next/router";
import AppLayout from "../../main_components/AppLayout";
import QuestionDetail from "../../page_components/question/QuestionDetail";

const question = () => {
    const router = useRouter();
    const { pid } = router.query;

    if (!pid) {
        return null;
    }
    return (
        <>
            <AppLayout>
                <QuestionDetail pageId={pid} />
            </AppLayout>
        </>
    );
};

export default question;