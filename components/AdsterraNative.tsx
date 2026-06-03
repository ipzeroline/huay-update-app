"use client";

import Script from "next/script";

export default function AdsterraNative() {
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
