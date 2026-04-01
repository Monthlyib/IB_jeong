import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faBookOpen,
  faNewspaper,
  faCalculator,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../MainMid.module.css";

const GUIDE_LINKS = [
  {
    href: "/ib",
    label: "월간 IB",
    icon: faBookOpen,
  },
  {
    href: "/board",
    label: "IB 입시 뉴스",
    icon: faNewspaper,
  },
  {
    href: "/board/calculator",
    label: "합격예측 계산기",
    icon: faCalculator,
  },
  {
    href: "/board/download",
    label: "자료실",
    icon: faClipboard,
  },
];

const MainGuideSection = ({ title = "IB 입시가이드" }) => {
  return (
    <section className={styles.guide_wrap}>
      <h2>{title}</h2>
      <ul className={styles.guide_inner} style={{ listStyle: "none" }}>
        {GUIDE_LINKS.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <span>
                {item.label} <FontAwesomeIcon icon={faAngleRight} />
              </span>
              <FontAwesomeIcon icon={item.icon} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MainGuideSection;
