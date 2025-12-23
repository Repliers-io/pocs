"use client";

import React from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FloatingChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  position?: "bottom-right" | "bottom-left";
}

/**
 * FloatingChatButton Component
 *
 * A circular floating action button for opening/closing the chat.
 * Displays a message icon when closed, X icon when open.
 *
 * Features:
 * - Smooth scale animations on hover
 * - Icon transition between MessageCircle and X
 * - Positioned at bottom right/left
 * - Gradient background
 * - Accessibility labels
 */
export function FloatingChatButton({
  isOpen,
  onClick,
  position = "bottom-right",
}: FloatingChatButtonProps) {
  const positionClasses =
    position === "bottom-right" ? "right-6 bottom-6" : "left-6 bottom-6";

  return (
    <motion.button
      onClick={onClick}
      className={`
        fixed ${positionClasses} z-50
        w-16 h-16
        bg-gradient-to-r from-blue-600 to-blue-700
        text-white
        rounded-full
        shadow-2xl
        hover:shadow-3xl
        flex items-center justify-center
        transition-shadow duration-300
        focus:outline-none focus:ring-4 focus:ring-blue-300
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      aria-expanded={isOpen}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <X className="w-7 h-7" />
          </motion.div>
        ) : (
          <motion.div
            key="message"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MessageCircle className="w-7 h-7" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
