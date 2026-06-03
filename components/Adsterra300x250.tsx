"use client";

import { useEffect, useId, useRef } from "react";

const ADSTERRA_300X250_KEY = "4762b80962e79e7ee30f319a06203598";

export default function Adsterra300x250() {
  const containerId = `adsterra-300x250-${useId().replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const optionsScript = document.createElement("script");
    optionsScript.innerHTML = `
      atOptions = {
        'key' : '${ADSTERRA_300X250_KEY}',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.src = `https://www.highperformanceformat.com/${ADSTERRA_300X250_KEY}/invoke.js`;
    invokeScript.async = true;

    container.appendChild(optionsScript);
    container.appendChild(invokeScript);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="adsterra-300x250-slot">
      <div ref={containerRef} id={containerId} />
    </div>
  );
}
