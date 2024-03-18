import { END } from "redux-saga";
import AppLayout from "../main_components/AppLayout";
import Main from "../main_components/Main";
import wrapper from "../store/configureStore";

const Home = () => {
  return (
    <>
      <AppLayout>
        <Main />
      </AppLayout>
    </>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps(
//   (context) => async () => {
//     context.dispatch(userActions.loadInfoRequest());
//     context.dispatch(END);
//     await context.sagaTask.toPromise();
//   }
// );

export default Home;
