import { useState, useCallback } from "react";

const useInput = ({ initValue = null }) => {

    const [value, setValue] = useState(initValue);

    const handler = useCallback((e) => {
        setValue(e.target.value);
        console.log(value);
    }, [])
    return [value, handler]
};

export default useInput;