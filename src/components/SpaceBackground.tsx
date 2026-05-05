"use client"

import { useEffect, useState } from "react";

export const SpaceBackground = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="fixed inset-0 bg-[#0F172A] z-[-1]" />;

  return (
    <div className="fixed inset-0 z-[-1] bg-[#0F172A]" />
  );
};
