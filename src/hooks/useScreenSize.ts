import { useEffect, useState } from "react";

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints: Record<Breakpoint, number> = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const useScreenSize = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("base");

  const getBreakpoint = (width: number): Breakpoint => {
    if (width >= breakpoints["2xl"]) return "2xl";
    if (width >= breakpoints["xl"]) return "xl";
    if (width >= breakpoints["lg"]) return "lg";
    if (width >= breakpoints["md"]) return "md";
    if (width >= breakpoints["sm"]) return "sm";
    return "base";
  };

  useEffect(() => {
    const handleResize = () => {
      const current = getBreakpoint(window.innerWidth);
      setBreakpoint(current);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    currentBreakpoint: breakpoint,
    isMdUp: window.innerWidth >= breakpoints["md"],
  };
};
