import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../reducers/user";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncLoader } from "react-spinners";

const SocialLogin = ({ social }) => {

    const socialMethod = { 1: "Google", 2: "Kakao", 3: "Naver", }


    const router = useRouter();
    const dispatch = useDispatch();
    let code = null;
    useEffect(() => {
        code = new URL(window.location.href).searchParams.get("code");

    }, [])


    const handleExistUser = (token) => {
        dispatch(userActions.loadInfoRequest(token));
        router.push("/");
    };

    const handleNewUser = (data) => {
        router.push({
            pathname: "/signup",
            query: { "reg_token": data },
        }, `/signup`);
    };

    const handleSocialLoginPost = async () => {
        const data = {
            social,
            code,
        };

        try {
            const result = await axios.post('https://api.hongsh.in/ib/v1/user/social', data);
            if (Object.keys(result.data)[0] === "reg_token") {
                handleNewUser(Object.values(result.data));
            } else if (Object.keys(result.data)[0] === "token") {
                handleExistUser(result.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (code) {
            handleSocialLoginPost();
        } else {
            alert("잘못된 접근입니다.")
            router.push("/login");
        }
    }, [code])

    return (
        <div style={{ display: "flex", flexDirection: "column", margin: "50vh auto", alignItems: "center", justifyContent: "center", }}>
            <h3> {socialMethod[social]} 로그인 중입니다.</h3>
            <SyncLoader />
        </div>
    );
};

export default SocialLogin;