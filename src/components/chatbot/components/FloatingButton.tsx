import React from "react";
import { MessageCircle, X } from "lucide-react";
import { FloatingButtonProps } from "../types";
import { BUTTON_LABELS } from "../utils/constants";

export function FloatingButton({
  isOpen,
  onClick,
  position = "bottom-right",
}: FloatingButtonProps) {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? BUTTON_LABELS.CLOSE : BUTTON_LABELS.CHAT_WITH_US}
      className={`
        fixed ${positionClasses[position]} z-50
        flex items-center gap-3 px-6 py-4
        bg-gradient-to-r from-blue-600 to-blue-700
        text-white rounded-full shadow-2xl
        hover:shadow-blue-500/50 hover:scale-105
        active:scale-95
        transition-all duration-300 ease-out
        group
      `}
      style={{
        animation: "slideUp 0.5s ease-out forwards",
      }}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <>
          <span className="text-2xl" role="img" aria-label="house">
            🏠
          </span>
          <span className="font-semibold text-sm tracking-wide hidden sm:inline">
            {BUTTON_LABELS.CHAT_WITH_US}
          </span>
          <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
        </>
      )}
    </button>
  );
}

// Add keyframe animation via style tag (will be picked up by Tailwind)
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  if (!document.head.querySelector('style[data-chatbot-animations]')) {
    style.setAttribute('data-chatbot-animations', 'true');
    document.head.appendChild(style);
  }
}
