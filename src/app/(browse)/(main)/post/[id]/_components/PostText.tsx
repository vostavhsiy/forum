"use client";

import React, { FC, useLayoutEffect, useRef } from "react";

interface Props {
  text: string;
}

export const PostText: FC<Props> = ({ text }) => {
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (textRef.current) textRef.current.innerHTML = text;
  }, []);

  return <p ref={textRef}></p>;
};
