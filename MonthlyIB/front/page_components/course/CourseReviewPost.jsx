import { Form } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "../../styles/question.module.css";
import { coursePostActions } from "../../reducers/coursePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";



const CourseReviewPost = ({ setFormModal, pageId }) => {
    const dispatch = useDispatch();
    const [content, setContent] = useState("");
    const [point, setPoint] = useState(0);

    const [clicked, setClicked] = useState([false, false, false, false, false]);
    const array = [0, 1, 2, 3, 4]

    const outside = useRef();

    const { User } = useSelector((state) => state.user);

    useEffect(() => {
        setPoint(clicked.filter((v) => v === true).length);
    }, [clicked])

    const onStarClick = (index) => {
        let clickStates = [...clicked];
        for (let i = 0; i < 5; i++) {
            clickStates[i] = i <= index ? true : false;
        }
        setClicked(clickStates);
    };

    const onSubmit = useCallback(() => {
        dispatch(coursePostActions.addCourseReviewRequest({ content, point, pageId, User }))
        setFormModal(false);
    }, [content, point, pageId])

    const onChangeContent = useCallback((e) => {
        setContent(e.target.value);
    }, [])

    return (
        <>
            <Form onFinish={onSubmit} style={{ position: "relative", zIndex: 5000 }}>
                <div className={`${styles.md} ${styles.md_left}`}>
                    <div className={styles.md_box_flex} ref={outside} onClick={(e) => outside.current === e.target && setFormModal(false)}>
                        <div className={styles.md_box}>
                            <div className={styles.md_top}>
                                <div className={styles.tit}>
                                    리뷰작성
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.md_section}>
                                        <div className={`${styles.md_review_content} ${styles.sub_flex_content}`}>
                                            <p>평점을 선택해주세요</p>

                                            <div className={styles.review_stars}>
                                                {
                                                    array.map((el) => (
                                                        <FontAwesomeIcon
                                                            key={el}
                                                            onClick={() => onStarClick(el)}
                                                            icon={faStar}
                                                            className={clicked[el] === true ? styles.active : styles.empty} />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <textarea id="editor" className={styles.textarea} value={content} onChange={onChangeContent} placeholder="내용을 입력해주세요" />
                                </div>
                            </div>
                            <button type="submit" className={styles.md_btn}>작성</button>
                        </div>
                    </div>
                    <div className={styles.md_dim} ></div>
                </div>
            </Form>
        </>
    );
};

export default CourseReviewPost;