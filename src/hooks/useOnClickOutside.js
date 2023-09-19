import { useEffect } from "react";

export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      // 내부클릭
      if (!ref.current || ref.current.contains(e.target)) {
        return;
      }
      // 외부클릭
      handler();
    };
    document.addEventListener("mousedown", listener);

    return () => {
      document.addEventListener("mousedown", listener);
    };
  });
}
