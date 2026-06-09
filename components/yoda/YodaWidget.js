"use client";
import { useState } from "react";
import MasterYoda from "./MasterYoda";
import { getRandomIdleQuote } from "@/constants/yoda";

export default function YodaWidget() {
  const [quote, setQuote]   = useState(null);
  const [open, setOpen]     = useState(false);

  function handleClick() {
    setQuote(getRandomIdleQuote());
    setOpen(true);
    setTimeout(() => setOpen(false), 5000);
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="flex flex-col items-center">
        {open && quote && (
          <div
            className="mb-2 rounded-xl px-3 py-2 text-xs shadow-lg max-w-48 text-center"
            style={{
              background: "var(--bg-primary)",
              border: "1.5px solid var(--border)",
              color: "var(--text-primary)",
              fontStyle: "italic",
            }}
          >
            "{quote}"
          </div>
        )}
        <div onClick={handleClick} title="Click Master Yoda for wisdom">
          <MasterYoda mood="idle" size={56} showBubble={false} />
        </div>
        <span
          className="text-xs mt-1 font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Master Yoda
        </span>
      </div>
    </div>
  );
}
