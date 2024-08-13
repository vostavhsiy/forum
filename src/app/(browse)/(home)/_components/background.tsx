"use client";

import { useTheme } from "next-themes";
import { useEffect, useLayoutEffect, useState } from "react";

export const Background = () => {
  const [currentTheme, setCurrentTheme] = useState("");
  const { theme } = useTheme();

  useLayoutEffect(() => {
    theme && setCurrentTheme(theme);
  }, [theme]);

  return (
    <svg xmlns="dhttp://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <pattern
          id="Dot_Pattern"
          x="10"
          y="10"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width="50" height="50" fill="transparent" />
          <circle
            cx="20"
            cy="20"
            r="10"
            fill={currentTheme === "dark" ? "#fff" : "#000"}
            fillOpacity="1"
          />
        </pattern>
      </defs>

      <rect fill="url(#Dot_Pattern)" className="w-full h-full" />
    </svg>
  );
};
