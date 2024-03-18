import styles from "./Main.module.css";
import MainTop from "./MainTop";
import MainMid from "./MainMid";
import MainBottom from "./MainBottom";
import Head from "next/head";


const Main = () => {

    return (
        <>
            <Head>
                <title>메인페이지</title>
            </Head>
            <main id={styles.index}>
                <MainTop />
                <MainMid />
                <MainBottom />
            </main >
        </>
    );
};

export default Main;