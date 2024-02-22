import { useEffect } from "react";

export default function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      // 내부클릭
      if (!ref.current || ref.current.contains(e.target as Node)) {
        return;
      }
      // 외부클릭
      handler();
    };
    document.addEventListener("mousedown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  });
}
