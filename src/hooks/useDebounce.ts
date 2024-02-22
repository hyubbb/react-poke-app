// debounce custom hooks
import { useEffect, useState } from "react";

export const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const timeValue = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(timeValue);
    };
  }, [value, delay]);

  return debounceValue;
};
