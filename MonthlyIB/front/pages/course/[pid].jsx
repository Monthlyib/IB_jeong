import { useRouter } from "next/router";
import AppLayout from "../../main_components/AppLayout";
import CourseDetail from "../../page_components/course/CourseDetail";
import { useEffect, useState } from "react";

const course = () => {
    const router = useRouter();
    const { pid } = router.query;
    const [disable, setDisable] = useState(false);


    useEffect(() => {

        const onScrollEvent = () => {
            if (window.scrollY > document.documentElement.scrollHeight * 0.20) {
                setDisable(true)
            } else {
                setDisable(false)
            }
        }
        window.addEventListener('scroll', onScrollEvent);

        return () => {
            window.removeEventListener('scroll', onScrollEvent);
        }

    })

    if (!pid) {
        return null;
    }
    return (
        <>
            <AppLayout disable={disable}>
                <CourseDetail pageId={pid} />
            </AppLayout>
        </>
    );
};

export default course;