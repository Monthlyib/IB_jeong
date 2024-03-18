import { useEffect } from "react";
import styles from "../BoardCommon.module.css";


const CalculatorMenu = ({ index, points, setPoints, groups, setGroups, group, setGroup }) => {
    const courseCategoryList = {
        "all": [],
        "Group1": ["English Literature", "English Language ", "Korean"],
        "Group2": ["English B", "Mandarin B", "Spanish B",],
        "Group3": ["Economics", "Business & Management", "Psychology", "Geography", "History"],
        "Group4": ["Physics", "Chemistry", "Biology", "Design Technology"],
        "Group5": ["Math AA", "Math AI"],
        "Group6": ["Visual Arts"],
    }

    const handleGroupChange = (e) => {

        let groupTemp = [...group]
        groupTemp[index] = e.target.value
        setGroup(groupTemp);

    }

    useEffect(() => {
        const temp = [...groups]

        for (let i = 0; i < 6; i++) {
            temp[i] = group.filter((x) => x === "Group" + String(i + 1)).length;
        }
        setGroups(temp)
    }, [group])

    return (
        <>
            <div className={styles.calc_list}>
                <div className={styles.calc_left}>
                    <select className={styles.group} onChange={handleGroupChange} value={group[index]}>
                        <option value="all">그룹 선택</option>
                        {
                            groups.map((v, i) => (
                                v < 2 ?
                                    <option key={i} value={`Group${i + 1}`}>{`Group ${i + 1}`}</option>
                                    : <option key={i} value={`Group${i + 1}`} disabled>{`Group ${i + 1}`}</option>
                            ))
                        }
                    </select >
                    <div className={styles.calc_group}>
                        <div className={styles.calc_class}>
                            <select className={group[index] === "Group1" ? styles.group_one : styles.class}>
                                <option value="all">과목 선택</option>
                                {
                                    courseCategoryList[group[index]].map((v, i) => (
                                        <option key={i} value={v}>{v}</option>
                                    ))
                                }
                            </select >
                        </div >
                        <select className={styles.level}>
                            <option value="all">레벨 선택</option>
                            {
                                group[index] !== "all" &&
                                <>
                                    <option value="sl">SL</option>
                                    <option value="hl">HL</option>
                                </>

                            }
                        </select>

                    </div >

                </div >
                <select
                    className={styles.point}
                    onChange={(e) => {
                        let temp = [...points];
                        temp[index] = e.target.value;
                        setPoints(temp)
                    }}
                >
                    <option value="0" > 점수 선택</option >
                    {
                        group[index] !== "all" &&
                        <>
                            <option value="1">1점</option>
                            <option value="2">2점</option>
                            <option value="3">3점</option>
                            <option value="4">4점</option>
                            <option value="5">5점</option>
                            <option value="6">6점</option>
                            <option value="7">7점</option>
                        </>
                    }

                </select >
            </div >
        </>
    );
};

export default CalculatorMenu;