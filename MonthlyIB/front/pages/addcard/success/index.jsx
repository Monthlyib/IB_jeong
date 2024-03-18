import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../reducers/user";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";

const Success = () => {
  let auth = null;
  const cookies = new Cookies();
  const token = cookies.get("token");
  const router = useRouter();
  const { addCardDone } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    auth = new URL(window.location.href).searchParams.get("authKey");
  }, []);
  console.log(auth);
  console.log("user token ", token);

  useEffect(() => {
    if (addCardDone) {
      router.push("/mypage");
    }
  }, [addCardDone]);

  useEffect(() => {
    if (auth) {
      dispatch(userActions.addCardRequest({ authKey: auth, token: token }));
    } else {
      alert("잘못된 접근입니다.");
      router.push("/login");
    }
  }, [auth]);
  return <></>;
};

export default Success;
