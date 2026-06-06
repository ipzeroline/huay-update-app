"use client";

import { useEffect, useId, useRef, useState } from "react";

const ADSTERRA_KEY = "4762b80962e79e7ee30f319a06203598";
const DESKTOP_BREAKPOINT = 900;
const DESKTOP_WIDTH = 728;
const DESKTOP_HEIGHT = 90;
const MOBILE_WIDTH = 320;
const MOBILE_HEIGHT = 50;

/**
 * ซ่อน popup/overlay ที่ Adsterra inject เข้ามา
 * เฉพาะ element ที่เป็น overlay/popup (position:fixed + z-index สูง)
 */
function hideAdOverlays() {
  const OVERLAY_SELECTORS = [
    '[id*="adsterra-pop"]',
    '[class*="adsterra-pop"]',
    '[id*="popunder"]',
    '[class*="popunder"]',
    '[id*="ad-overlay"]',
    '[class*="ad-overlay"]',
  ];

  const hide = () => {
    // ซ่อน overlay ที่ Adsterra inject ผ่าน selector
    OVERLAY_SELECTORS.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = "none";
          el.style.visibility = "hidden";
          el.style.pointerEvents = "none";
          el.remove();
        }
      });
    });

    // กัน overlay ทั่วไปที่อาจเกิดจาก ad script (position:fixed + z-index สูงเกิน 9999)
    document.querySelectorAll("div").forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const style = window.getComputedStyle(el);
      const zIndex = parseInt(style.zIndex, 10);
      if (
        !isNaN(zIndex) &&
        zIndex > 9999 &&
        style.position === "fixed" &&
        (el.offsetWidth >= window.innerWidth * 0.5 ||
          el.offsetHeight >= window.innerHeight * 0.5)
      ) {
        el.style.display = "none";
        el.style.visibility = "hidden";
        el.style.pointerEvents = "none";
        el.remove();
      }
    });
  };

  // ใช้ MutationObserver คอยดัก popup ที่ inject ทีหลัง
  const observer = new MutationObserver(() => {
    hide();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // run ทันที
  hide();

  return observer;
}

export default function Adsterra300x250() {
  const containerId = `adsterra-banner-${useId().replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // เช็คขนาดหน้าจอ
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // โหลด ad script
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const width = isDesktop ? DESKTOP_WIDTH : MOBILE_WIDTH;
    const height = isDesktop ? DESKTOP_HEIGHT : MOBILE_HEIGHT;

    const optionsScript = document.createElement("script");
    optionsScript.innerHTML = `
      atOptions = {
        'key' : '${ADSTERRA_KEY}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.src = `https://www.highperformanceformat.com/${ADSTERRA_KEY}/invoke.js`;
    invokeScript.async = true;

    container.appendChild(optionsScript);
    container.appendChild(invokeScript);

    return () => {
      container.innerHTML = "";
    };
  }, [isDesktop]);

  // MutationObserver — ซ่อน popup/overlay ที่ ad inject
  useEffect(() => {
    const observer = hideAdOverlays();
    return () => observer.disconnect();
  }, []);

  return (
    <div className="adsterra-responsive-slot" data-desktop={isDesktop}>
      <div
        ref={containerRef}
        id={containerId}
        className="adsterra-responsive-banner"
        style={{
          width: isDesktop ? DESKTOP_WIDTH : MOBILE_WIDTH,
          height: isDesktop ? DESKTOP_HEIGHT : MOBILE_HEIGHT,
          overflow: "hidden",
        }}
      />
    </div>
  );
}
