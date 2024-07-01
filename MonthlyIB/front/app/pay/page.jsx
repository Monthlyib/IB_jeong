import { Suspense } from "react";
import Loading from "@/components/Loading";
import PayComponents from "@/components/payComponents/PayComponents";

const Search = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <PayComponents />
      </Suspense>
    </>
  );
};

export default Search;
