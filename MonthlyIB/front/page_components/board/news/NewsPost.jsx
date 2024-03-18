import { Form } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newsActions } from "../../../reducers/news";
import { useRouter } from "next/router";

import styles from "../BoardCommon.module.css";
import Link from "next/link";

const NewsPost = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const imageInput = useRef();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const { User } = useSelector((state) => state.user);

    useEffect(() => {
        if (router.query.prevTitle) {
            setTitle(router.query.prevTitle);
        }

        if (router.query.prevContent) {
            setContent(router.query.prevContent)
        }

    }, [])

    const onSubmit = useCallback(() => {

        if (router.query.prevTitle) {
            let pageId = router.query.pageId;
            dispatch(newsActions.editNewsRequest({ pageId, title, content }));
        } else {
            dispatch(newsActions.addNewsRequest({ title, content, User }));
        }
        router.push("/board")
    }, [title, content, User])

    const onChangeTitle = useCallback((e) => {
        setTitle(e.target.value);
    }, [])

    const onChangeContent = useCallback((e) => {
        setContent(e.target.value);
    }, [])
    const onClickImageUpload = useCallback(() => {
        if (!imageInput.current) {
            return;
        }
        imageInput.current.click();
    }, [])

    return (
        <>
            <main className="width_content">
                <Form onFinish={onSubmit}>
                    <div className={styles.write_wrap}>
                        <input
                            type="text"
                            value={title}
                            onChange={onChangeTitle}
                            className={styles.write_tit}
                            placeholder="IB 입시뉴스 제목을 입력하세요!" />
                        <textarea className={styles.write_content} value={content} onChange={onChangeContent} />
                        <div className={styles.write_block}>
                            <label>썸네일 등록 ( jpg, png, gif 파일 )</label>
                            <input type="file" accept='image/jpg,impge/png,image/jpeg,image/gif' className={styles.write_img} onChange={onClickImageUpload} />
                        </div>
                        <div className={styles.write_btn_area}>
                            <Link href="/board" className={styles.cancel}>취소</Link>
                            <button className={styles.submit} type="submit">등록</button>
                        </div>
                    </div>
                </Form>
            </main>
        </>
    );
};

export default NewsPost;