import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, Send, X, Minimize2, Sparkles, Bot, User, 
  ArrowRight, Mic, Paperclip, CheckCircle2, AlertCircle, Maximize2 
} from "lucide-react";
import { PRODUCTS } from "../data/products";

// Define message types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AIChatbotProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  setCartOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  setProfileOpen: (open: boolean) => void;
  setSearchText: (text: string) => void;
  onNavigateToProduct?: (productId: string) => void;
}

// Inline Product Card component for interactive recommendations
const ProductCardEmbed = ({ id, label, onClick }: { id: string; label: string; onClick: (id: string) => void; key?: string }) => {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    return (
      <button
        onClick={() => onClick(id)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold transition-colors border border-slate-200/40 my-1 cursor-pointer"
      >
        <span>{label}</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 p-3.5 my-2.5 rounded-xl bg-white border border-slate-100/80 shadow-xs hover:shadow-md hover:border-slate-200 transition-all group w-full max-w-full sm:max-w-[300px] box-border">
      <div className="flex gap-3 items-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0" 
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-amber-600 transition-colors">
            {product.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-extrabold text-slate-950">${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
            <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5 ml-auto">
              ★ {product.rating}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onClick(product.id)}
        className="w-full text-center py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer tracking-wider uppercase"
      >
        View Premium Details
      </button>
    </div>
  );
};

// Inline bold and code formatter
const parseBoldAndCode = (text: string): React.ReactNode[] => {
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);
  
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-slate-950">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="bg-slate-100/90 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono text-amber-700 dark:text-amber-300">
          {part.slice(1, -1)}
        </code>
      );
    }
    // Safely strip stray single (*) or double (**) asterisks from normal text content
    const cleanedPart = part.replace(/\*\*|\*/g, "");
    return cleanedPart;
  });
};

// Inline link and product scheme formatter
const parseInlineFormatting = (text: string, onProductClick: (id: string) => void) => {
  const productRegex = /\[([^\]]+)\]\(product:([a-zA-Z0-9_-]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = productRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const beforeText = text.substring(lastIndex, matchIndex);
    
    if (beforeText) {
      parts.push(...parseBoldAndCode(beforeText));
    }

    const label = match[1];
    const productId = match[2];
    
    parts.push(
      <ProductCardEmbed 
        key={`prod-embed-${productId}-${matchIndex}`} 
        id={productId} 
        label={label} 
        onClick={onProductClick} 
      />
    );

    lastIndex = productRegex.lastIndex;
  }

  const remainingText = text.substring(lastIndex);
  if (remainingText) {
    parts.push(...parseBoldAndCode(remainingText));
  }

  return parts;
};

// Main Message Renderer supporting Lists and Paragraphs
const MessageContent = ({ text, onProductClick }: { text: string; onProductClick: (id: string) => void }) => {
  const lines = text.split("\n");
  const renderedElements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];

  const flushList = (key: number) => {
    if (currentListItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className="space-y-1.5 my-2 pl-1">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    const bulletMatch = line.match(/^(\*|-)\s+(.*)$/);
    const numberMatch = line.match(/^(\d+)\.\s+(.*)$/);

    if (bulletMatch) {
      const content = bulletMatch[2];
      currentListItems.push(
        <li key={`li-${index}`} className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2.5" />
          <div className="flex-1">{parseInlineFormatting(content, onProductClick)}</div>
        </li>
      );
    } else if (numberMatch) {
      const num = numberMatch[1];
      const content = numberMatch[2];
      currentListItems.push(
        <li key={`li-${index}`} className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
          <span className="font-bold text-xs text-amber-600 shrink-0 mt-0.5 w-4 text-right">{num}.</span>
          <div className="flex-1">{parseInlineFormatting(content, onProductClick)}</div>
        </li>
      );
    } else {
      flushList(index);
      
      if (trimmedLine) {
        renderedElements.push(
          <div key={`p-${index}`} className="text-sm text-slate-700 leading-relaxed my-1.5 first:mt-0 last:mb-0">
            {parseInlineFormatting(line, onProductClick)}
          </div>
        );
      } else {
        renderedElements.push(<div key={`spacer-${index}`} className="h-2" />);
      }
    }
  });

  flushList(lines.length);
  return <div className="space-y-1">{renderedElements}</div>;
};

export default function AIChatbot({
  activeCategory,
  setActiveCategory,
  setCartOpen,
  setWishlistOpen,
  setProfileOpen,
  setSearchText,
  onNavigateToProduct
}: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Dynamic follow-up suggestion generator based on previous turn or active category
  const generateFollowUpSuggestions = (text: string, category: string): string[] => {
    const lower = text.toLowerCase();
    
    if (lower.includes("watch") || lower.includes("wearable") || lower.includes("smartwatch") || lower.includes("fitbit")) {
      return [
        "Compare luxury smartwatches",
        "Which watches are in stock?",
        "Go to Electronics section"
      ];
    }
    if (lower.includes("audio") || lower.includes("headphone") || lower.includes("earbud") || lower.includes("speaker")) {
      return [
        "Compare headphones and earbuds",
        "Are there any audio discounts?",
        "Show wireless speaker details"
      ];
    }
    if (lower.includes("phone") || lower.includes("mobile") || lower.includes("device") || lower.includes("screen")) {
      return [
        "Compare top premium smartphones",
        "Which phone has the best camera?",
        "Show me cases and accessories"
      ];
    }
    if (lower.includes("beauty") || lower.includes("skincare") || lower.includes("serum") || lower.includes("cream") || lower.includes("oil")) {
      return [
        "What is the best moisturizer?",
        "Are skincare products natural?",
        "Recommend a premium gift set"
      ];
    }
    if (lower.includes("home") || lower.includes("decor") || lower.includes("chair") || lower.includes("lamp") || lower.includes("furniture")) {
      return [
        "Recommend elegant home lighting",
        "Show me ergonomic lounge chairs",
        "Go to Home Decor section"
      ];
    }
    if (lower.includes("sport") || lower.includes("fitness") || lower.includes("treadmill") || lower.includes("mat") || lower.includes("gear")) {
      return [
        "What workout mats do you have?",
        "Recommend high-end sports gear",
        "Go to Sports & Fitness section"
      ];
    }
    if (lower.includes("delivery") || lower.includes("shipping") || lower.includes("return") || lower.includes("refund") || lower.includes("policy")) {
      return [
        "How do I request a return?",
        "Is international delivery available?",
        "Explain the Gold tier benefits"
      ];
    }
    if (lower.includes("offer") || lower.includes("discount") || lower.includes("deal") || lower.includes("sale") || lower.includes("price")) {
      return [
        "Show me items under $200",
        "Which products are best sellers?",
        "Compare discounted items"
      ];
    }
    if (category === "Electronics") {
      return [
        "Recommend premium laptops",
        "Compare top audio devices",
        "What are the best seller electronics?"
      ];
    }
    if (category === "Beauty") {
      return [
        "Show elite beauty and skincare",
        "Best items with 4.8+ rating",
        "Recommend a skincare routine"
      ];
    }
    if (category === "Home") {
      return [
        "Show top tier home decor",
        "What chairs are in stock?",
        "Best design accents"
      ];
    }
    if (category === "Sports") {
      return [
        "Show professional fitness gear",
        "Are sports items on sale?",
        "Best tracking accessories"
      ];
    }

    // Default follow ups
    return [
      "What are today's top picks?",
      "Show me the overall best sellers",
      "Tell me about VIP membership"
    ];
  };

  const DEFAULT_SUGGESTIONS = [
    "Recommend a luxury smartwatch",
    "Best items in Beauty & Skincare",
    "Explain your returns & delivery",
    "What are your hot discount offers?"
  ];

  // Suggested questions state
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("luxe_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        setShowNotification(false);
      } catch (e) {
        console.error("Failed to parse saved chat history", e);
      }
    } else {
      // Set initial welcome state
      setShowNotification(true);
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("luxe_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom whenever messages list or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen, isMinimized]);

  // Handle showing tooltip initially to draw friendly attention
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTooltip(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setShowTooltip(false);
    setShowNotification(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Immediately hide all suggestion chips upon click / submission!
    setSuggestions([]);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    // Build the payload with the full message thread for context
    const chatPayload = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatPayload,
          activeCategory: activeCategory
        })
      });

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: `assist-${Date.now()}`,
        role: "assistant",
        content: data.response || "I apologize, I am experiencing difficulties retrieving inventory information at the moment. How else can I assist you with Luxe Market?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Dynamically display new follow-up suggestions related to the new chat history and category!
      const nextSuggestions = generateFollowUpSuggestions(assistantMsg.content, activeCategory);
      setSuggestions(nextSuggestions);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMsg: Message = {
        id: `assist-${Date.now()}`,
        role: "assistant",
        content: "I'm having trouble connecting to my brain right now. Please ensure your server is running and check your connection. How can I help you navigate the store in the meantime?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
      setSuggestions([
        "Explain your returns & delivery",
        "What are your hot discount offers?",
        "What are today's top picks?"
      ]);
    } finally {
      setIsLoading(false);
      // Re-focus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem("luxe_chat_history");
    setSuggestions(DEFAULT_SUGGESTIONS);
  };

  const handleProductSelection = (productId: string) => {
    if (onNavigateToProduct) {
      onNavigateToProduct(productId);
    }
    // Auto minimize to stay accessible but out of the way of the product page
    setIsMinimized(true);
  };

  // Perform active client side triggers based on keywords
  // (e.g., if model suggests checkout or cart, chatbot can open it on screen!)
  const handleAssistantAction = (text: string) => {
    const lowercase = text.toLowerCase();
    if (lowercase.includes("open my cart") || lowercase.includes("view your cart") || lowercase.includes("opening your cart")) {
      setCartOpen(true);
    } else if (lowercase.includes("open my wishlist") || lowercase.includes("view your wishlist") || lowercase.includes("opening your wishlist")) {
      setWishlistOpen(true);
    } else if (lowercase.includes("open my profile") || lowercase.includes("your account details") || lowercase.includes("view your profile")) {
      setProfileOpen(true);
    }
  };

  // Watch for latest assistant message to trigger dynamic website actions
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "assistant") {
        handleAssistantAction(lastMsg.content);
      }
    }
  }, [messages]);

  return (
    <>
      {/* Floating Chat Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-3.5 bg-slate-950 text-white font-sans text-[11px] md:text-xs font-bold px-4 py-2.5 rounded-full shadow-lg border border-slate-800 flex items-center gap-2 tracking-wide whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <span>Need Help? Ask Luxe AI</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="hover:text-amber-400 text-gray-400 transition-colors ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={isOpen ? () => setIsOpen(false) : handleOpenChat}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl border cursor-pointer group transition-all duration-300 ${
            isOpen 
              ? "bg-slate-950 border-slate-900 text-white" 
              : "bg-white border-slate-100 text-slate-950 hover:border-amber-500/50 hover:shadow-amber-500/10"
          }`}
          id="ai-chatbot-launcher"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 group-hover:text-amber-600 transition-colors" />
              {showNotification && (
                <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                </span>
              )}
            </>
          )}
        </motion.button>
      </div>

      {/* Main Chat Window Panel */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full h-full sm:w-[420px] sm:h-[620px] sm:max-h-[calc(100vh-8rem)] bg-white/95 backdrop-blur-md sm:rounded-2xl rounded-none shadow-2xl sm:border border-slate-100 flex flex-col z-50 overflow-hidden font-sans select-none"
            id="ai-chatbot-window"
          >
            {/* Header */}
            <div className="bg-slate-950 px-5 py-4 flex items-center justify-between border-b border-slate-900 shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-inner">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-950 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-white tracking-wide">Luxe Concierge</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">AI Assistant • Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Minimize"
                  id="chatbot-btn-minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Close"
                  id="chatbot-btn-close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto px-5 py-6 bg-slate-50/50 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
              {/* Show welcome prompt only if no messages exist */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-2 text-slate-900">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h4 className="text-sm font-bold">Welcome to Luxe Concierge!</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hello! I'm your premium AI personal shopping concierge. Allow me to elevate your shopping experience at Luxe Market. 
                  </p>
                  <div className="space-y-2.5 pt-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">How I can assist you:</div>
                    <ul className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Find products</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Compare specs</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Check best sellers</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Guide checkout</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Message List */}
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4 text-amber-500" />
                      </div>
                    )}
                    <div className="flex flex-col max-w-[85%] sm:max-w-[80%] min-w-0">
                      <div
                        className={`px-4 py-3 rounded-2xl text-slate-800 text-sm shadow-xs break-words overflow-hidden w-full ${
                          isUser
                            ? "bg-slate-950 text-white rounded-tr-none font-medium selection:bg-amber-500"
                            : "bg-white border border-slate-100 rounded-tl-none font-normal"
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.content}</p>
                        ) : (
                          <div className="select-text">
                            <MessageContent text={msg.content} onProductClick={handleProductSelection} />
                          </div>
                        )}
                      </div>
                      <span className={`text-[9px] text-gray-400 mt-1 px-1 font-mono ${isUser ? "text-right" : "text-left"}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                    {isUser && (
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Typing Animation */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                    <Bot className="w-4 h-4 text-amber-500 animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-xs">
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="text-xs text-slate-400 font-medium font-sans">AI is finding products...</span>
                      <div className="flex items-center gap-1 ml-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            {suggestions.length > 0 && (
              <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex flex-nowrap gap-1.5 overflow-x-auto scrollbar-none shrink-0" id="chatbot-suggestions-horizontal">
                {suggestions.map((chipText, i) => (
                  <motion.button
                    key={`${chipText}-${i}`}
                    onClick={() => handleSendMessage(chipText)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-3 py-1.5 bg-white border border-slate-200/60 hover:border-amber-500/40 hover:bg-slate-50 text-slate-700 hover:text-slate-950 font-sans text-[11px] font-semibold rounded-full shadow-2xs whitespace-nowrap cursor-pointer transition-all flex items-center gap-1"
                  >
                    <span>{chipText}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Footer Form Input */}
            <div className="px-4 py-3 bg-white border-t border-slate-100 flex flex-col shrink-0">
              <div className="flex items-end gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 transition-all">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Luxe Concierge anything..."
                  className="flex-1 max-h-20 min-h-[24px] outline-none border-none bg-transparent text-sm text-slate-800 placeholder-slate-400 py-0.5 resize-none font-sans scrollbar-none font-medium leading-relaxed"
                  disabled={isLoading}
                  rows={1}
                />
                
                <div className="flex items-center gap-1 shrink-0 pb-0.5">
                  <button
                    type="button"
                    className="p-1 rounded text-slate-300 hover:text-slate-400 transition-colors cursor-help"
                    title="Voice assistant coming soon"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded text-slate-300 hover:text-slate-400 transition-colors cursor-help"
                    title="Attachment support coming soon"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSendMessage(inputMessage)}
                    disabled={!inputMessage.trim() || isLoading}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      inputMessage.trim() && !isLoading
                        ? "bg-slate-950 hover:bg-slate-900 text-white"
                        : "text-slate-300 bg-slate-100"
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Utility / Clear Info */}
              <div className="flex items-center justify-between mt-2.5 px-1">
                <span className="text-[10px] text-gray-400 font-sans flex items-center gap-1 select-none">
                  <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" /> Powered by Gemini 3.5 Flash
                </span>
                {messages.length > 0 && (
                  <button
                    onClick={clearChatHistory}
                    className="text-[10px] text-gray-400 hover:text-rose-600 transition-colors font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Clear History
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small Minimized Overlay bar */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 bg-slate-950 hover:bg-slate-900 text-white font-sans text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-slate-900 flex items-center justify-between sm:justify-start gap-3 tracking-wide cursor-pointer z-50 select-none group"
            id="ai-chatbot-minimized"
          >
            <div className="relative w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center shadow-inner shrink-0">
              <Bot className="w-3.5 h-3.5 text-slate-950" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
            </div>
            <span>Luxe Concierge Minimized</span>
            <span className="text-[10px] bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded-full group-hover:scale-105 transition-transform uppercase">
              Restore
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
