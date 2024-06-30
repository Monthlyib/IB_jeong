import SearchComponents from "@/components/searchComponents/SearchComponents";
import { Suspense } from "react";
import Loading from "@/components/Loading";

const Search = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <SearchComponents />
      </Suspense>
    </>
  );
};

export default Search;
