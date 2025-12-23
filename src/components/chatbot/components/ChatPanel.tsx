"use client";

import React, { useRef, useEffect, useState } from "react";
import { X, Loader2, Mic, ArrowUp, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage, PropertyListing } from "../types";
import { PropertyResults } from "./PropertyResults";

export interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  placeholder?: string;
  onPropertyClick?: (property: PropertyListing) => void;
  onShowAllListings?: (listings: PropertyListing[]) => void;
}

/**
 * ChatPanel Component - Claude-style Chat UI
 *
 * A modern, clean chat interface inspired by Claude/ChatGPT.
 * Slides in from the right side of the screen.
 *
 * Features:
 * - Minimal, clean design
 * - Slides in/out with framer-motion
 * - Auto-scrolling messages
 * - Property results inline with messages
 * - Larger, auto-resizing text input
 * - Desktop: ~400px width, full height
 * - Mobile: Full screen
 */
export function ChatPanel({
  isOpen,
  onClose,
  messages,
  isLoading,
  onSendMessage,
  placeholder = "Ask me anything about properties...",
  onPropertyClick,
  onShowAllListings,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isOpen, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice input functionality
  const handleVoiceInput = () => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in your browser. Please try Chrome or Edge."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("Voice recognition started. Speak now...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      // Auto-focus textarea after voice input
      inputRef.current?.focus();
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        alert("Microphone access denied. Please allow microphone access.");
      }
    };

    recognition.start();
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`
              fixed right-0 top-0 h-full z-50
              bg-white
              shadow-2xl
              flex flex-col

              /* Mobile: Full width */
              w-full

              /* Desktop: Fixed width */
              md:w-[400px]
            `}
          >
            {/* Header - Minimal like Claude */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Messages Container - Claude/ChatGPT Style */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    flex gap-4 py-6 px-4
                    ${message.role === "user" ? "bg-white flex-row-reverse" : "bg-gray-50/50"}
                    ${index !== 0 ? "border-t border-gray-100" : ""}
                  `}
                >
                  {/* Avatar */}
                  <div className="shrink-0">
                    {message.role === "user" ? (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0 space-y-4">
                    {/* Text Content */}
                    <div className="prose prose-sm max-w-none">
                      {message.isLoading && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      )}
                      {!message.isLoading && (
                        <p
                          className={`
                            text-[15px] leading-7 whitespace-pre-wrap
                            ${
                              message.error
                                ? "text-red-700"
                                : "text-gray-900"
                            }
                          `}
                        >
                          {message.content}
                        </p>
                      )}
                    </div>

                    {/* Property Results */}
                    {message.role === "assistant" &&
                      message.propertyResults &&
                      message.propertyResults.length > 0 && (
                        <div className="mt-4">
                          <PropertyResults
                            listings={message.propertyResults}
                            onViewDetails={onPropertyClick}
                          />
                          {/* Show All Listings Button */}
                          {message.propertyResults.length > 5 && (
                            <div className="mt-3">
                              <button
                                onClick={() =>
                                  onShowAllListings?.(message.propertyResults!)
                                }
                                className="
                                  w-full px-4 py-2.5
                                  bg-white hover:bg-gray-50
                                  border border-gray-200 hover:border-gray-300
                                  text-gray-700 text-sm font-medium
                                  rounded-lg
                                  transition-all
                                "
                              >
                                View all {message.propertyResults.length} listings
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && !messages.some((m) => m.isLoading) && (
                <div className="flex gap-4 py-6 px-4 bg-gray-50/50 border-t border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - ChatGPT-style with functional multiline */}
            <div className="p-4 bg-white">
              <div className="relative flex items-end bg-gray-100 rounded-3xl px-4 py-3 shadow-sm">
                {/* Textarea - Center (grows vertically) */}
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  disabled={isLoading}
                  rows={1}
                  className="
                    flex-1 px-4 py-2
                    bg-transparent
                    focus:outline-none
                    text-[15px] leading-6 text-gray-900
                    placeholder:text-gray-500
                    resize-none
                    max-h-40
                  "
                  style={{
                    minHeight: '28px',
                    lineHeight: '1.5'
                  }}
                  aria-label="Message input"
                />

                {/* Right Side Buttons */}
                <div className="flex items-center gap-1 shrink-0 mb-0.5">
                  {/* Voice Button - only show when no text */}
                  {!inputValue.trim() && (
                    <button
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                      aria-label="Voice input"
                      onClick={handleVoiceInput}
                    >
                      <Mic className="w-5 h-5 text-gray-600" />
                    </button>
                  )}

                  {/* Send Button - only show when there's text */}
                  {inputValue.trim() && (
                    <button
                      onClick={handleSend}
                      disabled={isLoading}
                      className="
                        p-2 bg-gray-900 text-white
                        rounded-full
                        hover:bg-gray-800
                        disabled:bg-gray-400 disabled:cursor-not-allowed
                        transition-all
                        flex items-center justify-center
                      "
                      aria-label="Send message"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Subtle hint text */}
              <p className="text-[11px] text-gray-400 mt-2 text-center">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
