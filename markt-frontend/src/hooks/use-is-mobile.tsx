import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 770;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<null | boolean>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isMobile };
};

export { useIsMobile };
