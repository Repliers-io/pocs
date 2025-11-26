import React, { useRef, useEffect, useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { ChatWidgetProps } from "../types";
import { useChatRuntime } from "../hooks/useChatRuntime";
import { PropertyResults } from "./PropertyResults";
import { BUTTON_LABELS } from "../utils/constants";

export function ChatWidget({
  isOpen,
  onClose,
  brokerageName,
  brokerageLogo,
  welcomeMessage,
  placeholder,
  repliersApiKey,
}: ChatWidgetProps) {
  const { messages, isLoading, sendMessage } = useChatRuntime(
    repliersApiKey,
    welcomeMessage
  );
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Chat Widget */}
      <div
        className={`
          fixed z-50 bg-white rounded-2xl shadow-2xl
          flex flex-col overflow-hidden
          transition-all duration-300 ease-out
          ${
            isOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95 pointer-events-none"
          }

          /* Mobile: Full screen */
          inset-4 md:inset-auto

          /* Desktop: Bottom right, fixed size - wider for property cards */
          md:bottom-24 md:right-6
          md:w-[480px] md:h-[700px]
        `}
        role="dialog"
        aria-labelledby="chat-header"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            {brokerageLogo && (
              <img
                src={brokerageLogo}
                alt={`${brokerageName} logo`}
                className="w-10 h-10 rounded-full bg-white/10 p-1 object-contain"
              />
            )}
            <div>
              <h2 id="chat-header" className="font-semibold text-lg">
                {brokerageName}
              </h2>
              <p className="text-xs text-blue-100">Online now</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={BUTTON_LABELS.CLOSE}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/30 to-white">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              {/* Message Bubble */}
              <div
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[85%] rounded-2xl px-4 py-3 shadow-sm
                    ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm"
                        : message.error
                        ? "bg-red-50 text-red-800 rounded-bl-sm border border-red-200"
                        : message.isLoading
                        ? "bg-blue-50 text-blue-800 rounded-bl-sm border border-blue-200 flex items-center gap-2"
                        : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                    }
                  `}
                >
                  {message.isLoading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>

              {/* Property Results */}
              {message.role === "assistant" &&
                message.propertyResults &&
                message.propertyResults.length > 0 && (
                  <div className="w-full">
                    <PropertyResults listings={message.propertyResults} />
                  </div>
                )}
            </div>
          ))}

          {/* Loading Indicator (for when isLoading but no loading message yet) */}
          {isLoading && !messages.some((m) => m.isLoading) && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className="
                flex-1 px-4 py-3
                border border-gray-300 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:bg-gray-50 disabled:cursor-not-allowed
                text-sm
                transition-all duration-200
              "
              aria-label="Message input"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              aria-label={BUTTON_LABELS.SEND}
              className="
                p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white
                rounded-xl hover:shadow-lg hover:scale-105
                disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100
                transition-all duration-200
                flex items-center justify-center
              "
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by Repliers AI • Press Enter to send
          </p>
        </div>
      </div>
    </>
  );
}
