"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const DESKTOP_BREAKPOINT = 900;

export default function AdsterraNative() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ซ่อน Native Banner บนมือถือ (mobile < 900px)
  if (!isDesktop) return null;

  return (
    <div className="adsterra-native-slot">
      <Script
        src="https://pl29626123.effectivecpmnetwork.com/b6a74b5f23d98d705fc7081cf86a2796/invoke.js"
        strategy="afterInteractive"
      />
      <div id="container-b6a74b5f23d98d705fc7081cf86a2796"></div>
    </div>
  );
}
