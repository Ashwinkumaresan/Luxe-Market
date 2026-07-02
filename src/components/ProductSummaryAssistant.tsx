import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, X, Minimize2, Sparkles, Bot, User, ArrowRight,
  CheckCircle2, AlertCircle, ThumbsUp, DollarSign, Compass,
  Cpu, ShieldCheck, Truck, RefreshCw, RefreshCw as RotateCcw,
  MessageSquare, Layers
} from "lucide-react";
import { Product } from "../types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ProductSummaryAssistantProps {
  product: Product;
}

// Helper to parse sections for Smart Response Cards
interface ParsedSections {
  OVERVIEW?: string;
  HIGHLIGHTS?: string;
  PROS?: string;
  CONSIDERATIONS?: string;
  BEST_FOR?: string;
  PRICE_INSIGHT?: string;
}

const parseResponseSections = (text: string): { sections: ParsedSections; hasParsed: boolean } => {
  const sections: ParsedSections = {};
  const regex = /###\s+\[([A-Z_]+)\]\s*([\s\S]*?)(?=(###\s+\[[A-Z_]+\]|$))/g;
  let match;
  let hasParsed = false;

  while ((match = regex.exec(text)) !== null) {
    const sectionName = match[1] as keyof ParsedSections;
    sections[sectionName] = match[2].trim();
    hasParsed = true;
  }

  return { sections, hasParsed };
};

// Formats bullet points into neat arrays of text
const getBullets = (text?: string): string[] => {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.replace(/^[\s*-·•]+/, "").trim())
    .filter((line) => line.length > 0);
};

// Inline bullet/text formatter with support for bold formatting inside list items
const formatTextWithBold = (text: string, isLightBackground = true): React.ReactNode => {
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong 
              key={i} 
              className={`font-bold ${isLightBackground ? "text-slate-900" : "text-amber-300"}`}
            >
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code 
              key={i} 
              className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                isLightBackground 
                  ? "bg-slate-100 text-amber-700 border border-slate-200/50" 
                  : "bg-slate-800 text-amber-400 border border-slate-700/50"
              }`}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        // Safely strip stray single (*) or double (**) asterisks from normal text content
        const cleanedPart = part.replace(/\*\*|\*/g, "");
        return <span key={i}>{cleanedPart}</span>;
      })}
    </>
  );
};

// Smart Card: Structured layout for the AI Product summary
const SmartSummaryCards = ({ sections }: { sections: ParsedSections }) => {
  const highlights = getBullets(sections.HIGHLIGHTS);
  const pros = getBullets(sections.PROS);
  const considerations = getBullets(sections.CONSIDERATIONS);
  const bestFor = getBullets(sections.BEST_FOR);

  return (
    <div className="space-y-3.5 my-1.5 select-text w-full max-w-full overflow-hidden">
      {/* Overview Card */}
      {sections.OVERVIEW && (
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50/70 to-orange-50/50 border border-amber-100/60 shadow-xs">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <h4 className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Product Overview</h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {formatTextWithBold(sections.OVERVIEW)}
          </p>
        </div>
      )}

      {/* Key Highlights Card */}
      {highlights.length > 0 && (
        <div className="p-3.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Key Highlights</h4>
          </div>
          <ul className="space-y-1.5">
            {highlights.map((bullet, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                <span className="flex-1">{formatTextWithBold(bullet)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Best For Card */}
      {bestFor.length > 0 && (
        <div className="p-3.5 rounded-xl bg-white border border-slate-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Best Suited For</h4>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {bestFor.map((useCase, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-100/60 shadow-3xs"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-medium mt-2.5">Recommended for high efficiency and design satisfaction.</p>
        </div>
      )}

      {/* Pros Card */}
      {pros.length > 0 && (
        <div className="p-3.5 rounded-xl bg-emerald-50/30 border border-emerald-100/40 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <h4 className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">Pros & Benefits</h4>
          </div>
          <ul className="space-y-1.5">
            {pros.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span className="flex-1">{formatTextWithBold(bullet)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Considerations Card */}
      {considerations.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50/30 border border-amber-100/40 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <h4 className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Things to Consider</h4>
          </div>
          <ul className="space-y-1.5">
            {considerations.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                <span className="text-amber-500 font-bold shrink-0">!</span>
                <span className="flex-1">{formatTextWithBold(bullet)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price Insight Card */}
      {sections.PRICE_INSIGHT && (
        <div className="p-3.5 rounded-xl bg-slate-950 text-white border border-slate-900 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Luxe Value Insight</h4>
            </div>
            <span className="text-[10px] bg-amber-500/15 text-amber-400 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/20">
              Curated Valuation
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {formatTextWithBold(sections.PRICE_INSIGHT, false)}
          </p>
        </div>
      )}
    </div>
  );
};

// General fallback parser supporting tables, links, bold, lists
const StandardMessageBody = ({ text }: { text: string }) => {
  const lines = text.split("\n");
  const renderedElements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];
  let currentTableRows: string[][] = [];
  let inTable = false;

  const flushList = (key: number) => {
    if (currentListItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className="space-y-1.5 pl-1 my-2">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  const flushTable = (key: number) => {
    if (currentTableRows.length > 0) {
      // Filter out markdown spacer rows like |---|---|
      const filteredRows = currentTableRows.filter(row => {
        const joined = row.join("").trim();
        return !joined.match(/^[-:|]+$/) && joined.length > 0;
      });

      if (filteredRows.length > 0) {
        const hasHeader = currentTableRows.length > 1 && currentTableRows[1].join("").trim().match(/^[-:|]+$/);
        const headerRow = hasHeader ? filteredRows[0] : null;
        const bodyRows = hasHeader ? filteredRows.slice(1) : filteredRows;

        renderedElements.push(
          <div key={`table-wrapper-${key}`} className="my-2.5 overflow-x-auto border border-slate-200/60 rounded-xl shadow-2xs max-w-full">
            <table className="min-w-full divide-y divide-slate-200 text-left text-[11px] font-sans">
              {headerRow && (
                <thead className="bg-slate-50 font-bold text-slate-800">
                  <tr>
                    {headerRow.map((cell, cIdx) => (
                      <th key={cIdx} className="px-3 py-2 border-r border-slate-100 last:border-r-0">
                        {formatTextWithBold(cell.trim())}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors odd:bg-white even:bg-slate-50/30">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 border-r border-slate-100 last:border-r-0 break-words">
                        {formatTextWithBold(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      currentTableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const isTableRow = trimmedLine.startsWith("|") && trimmedLine.endsWith("|");

    if (isTableRow) {
      flushList(index);
      inTable = true;
      const cells = line.split("|").slice(1, -1);
      currentTableRows.push(cells);
    } else {
      if (inTable) {
        flushTable(index);
      }

      const bulletMatch = line.match(/^(\*|-)\s+(.*)$/);
      const numberMatch = line.match(/^(\d+)\.\s+(.*)$/);

      if (bulletMatch) {
        currentListItems.push(
          <li key={`li-${index}`} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
            <span className="flex-1">{formatTextWithBold(bulletMatch[2])}</span>
          </li>
        );
      } else if (numberMatch) {
        currentListItems.push(
          <li key={`li-${index}`} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-amber-600 text-right w-4 shrink-0">{numberMatch[1]}.</span>
            <span className="flex-1">{formatTextWithBold(numberMatch[2])}</span>
          </li>
        );
      } else {
        flushList(index);
        if (trimmedLine) {
          if (trimmedLine.startsWith("### ")) {
            renderedElements.push(
              <h4 key={`h-${index}`} className="text-xs font-bold text-slate-900 mt-3 mb-1.5 first:mt-0 uppercase tracking-wider">
                {trimmedLine.slice(4)}
              </h4>
            );
          } else {
            renderedElements.push(
              <p key={`p-${index}`} className="text-xs text-slate-700 leading-relaxed my-1 first:mt-0">
                {formatTextWithBold(line)}
              </p>
            );
          }
        } else {
          renderedElements.push(<div key={`spacer-${index}`} className="h-1.5" />);
        }
      }
    }
  });

  flushList(lines.length);
  flushTable(lines.length);
  return <div className="space-y-1 select-text">{renderedElements}</div>;
};

export default function ProductSummaryAssistant({ product }: ProductSummaryAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  // Store chat history mapping: productId -> Message[]
  const [sessionHistories, setSessionHistories] = useState<{ [pId: string]: Message[] }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Retrieve messages for the current product
  const activeMessages = sessionHistories[product.id] || [];

  // Suggestion action chips
  const actionChips = [
    "Summarize this product",
    "Explain key features",
    "Is it worth buying?",
    "Who should buy this?",
    "Compare specifications",
    "Pros & Cons",
    "Warranty details",
    "Shipping information",
    "Return policy"
  ];

  // Hover tooltip trigger timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTooltip(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [product.id, isOpen]);

  // Scroll to bottom when messages list or loading state updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, isLoading, isOpen, isMinimized]);

  // Auto trigger summary generation when chatbot is opened for the first time on a product
  const handleOpenAssistant = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setShowTooltip(false);

    if (activeMessages.length === 0) {
      triggerAutomaticSummary();
    } else {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const triggerAutomaticSummary = async () => {
    const defaultIntro = "Please generate an overview, highlights, pros & cons, suitability, and valuation insights for this product.";
    await submitMessage(defaultIntro, true);
  };

  const submitMessage = async (textToSend: string, isAutoSummary = false) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: `prod-user-${Date.now()}`,
      role: "user",
      content: isAutoSummary ? "Summarize this product" : textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update active history with user message
    const currentList = isAutoSummary ? [] : [...activeMessages, userMessage];
    
    if (!isAutoSummary) {
      setSessionHistories((prev) => ({
        ...prev,
        [product.id]: currentList
      }));
      setInputMessage("");
    }

    setIsLoading(true);

    // Context format matching server expects
    const messagesPayload = currentList.map((m) => ({
      role: m.role,
      content: m.content
    }));

    // If first summary, pass an empty prompt array but tell AI to summarize
    if (isAutoSummary) {
      messagesPayload.push({
        role: "user",
        content: "Generate product summary with full OVERVIEW, HIGHLIGHTS, PROS, CONSIDERATIONS, BEST_FOR, and PRICE_INSIGHT sections based on your instructions."
      });
    }

    try {
      const response = await fetch("/api/gemini/product-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesPayload,
          product: product
        })
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: `prod-assist-${Date.now()}`,
        role: "assistant",
        content: data.response || "I was unable to complete the intelligence scan of this product. Let me know if you have specific questions I can answer.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessionHistories((prev) => ({
        ...prev,
        [product.id]: isAutoSummary ? [assistantMessage] : [...currentList, assistantMessage]
      }));

    } catch (e) {
      console.error("Product summary fetch error:", e);
      const errorMessage: Message = {
        id: `prod-assist-err-${Date.now()}`,
        role: "assistant",
        content: "### [OVERVIEW]\nI apologize, I'm having trouble connecting with my intelligence server. Please ensure the local dev server is running properly.\n\n### [HIGHLIGHTS]\n* Unable to query online summary\n* Please review product specifications directly on the page.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setSessionHistories((prev) => ({
        ...prev,
        [product.id]: isAutoSummary ? [errorMessage] : [...currentList, errorMessage]
      }));
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim()) {
        submitMessage(inputMessage);
      }
    }
  };

  return (
    <>
      {/* Floating Action Button (Pulse animation + Bolt Icon) */}
      <div 
        className="fixed bottom-24 right-4 z-50 flex flex-col items-end sm:right-6" 
        id="prod-summary-assistant-launcher-container"
      >
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-2 bg-slate-900 text-white font-sans text-[11px] font-bold px-3 py-2 rounded-lg shadow-lg border border-slate-800 flex flex-col tracking-wide select-none whitespace-nowrap"
            >
              <div className="flex items-center gap-1 text-amber-400">
                <Zap className="w-3 h-3 fill-amber-400 shrink-0" />
                <span>AI Product Summary</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Summarize this product</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={isOpen ? () => setIsOpen(false) : handleOpenAssistant}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl border cursor-pointer transition-all duration-300 ${
            isOpen 
              ? "bg-slate-950 border-slate-900 text-white" 
              : "bg-amber-500 border-amber-400 text-white hover:bg-amber-600 hover:border-amber-500 animate-pulse-subtle"
          }`}
          title="AI Product Concierge"
          id="prod-summary-assistant-btn"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Zap className="w-5 h-5 fill-white animate-bounce-subtle" />
          )}
        </motion.button>
      </div>

      {/* Adaptive Backdrop for focus (visible on mobile and tablet, hidden on desktop to allow page browsing) */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/40 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Panel Drawer (Adaptive layout: Bottom Sheet on Mobile, Centered Modal on Tablet, Floating Popup on Desktop) */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed z-50 overflow-hidden font-sans select-none bg-white/98 backdrop-blur-md shadow-2xl flex flex-col border border-slate-100/80
              /* Mobile (Default): Bottom Sheet */
              bottom-0 left-0 right-0 top-auto w-full h-[82vh] rounded-t-2xl rounded-b-none
              /* Tablet: Centered Modal */
              sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:right-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[410px] sm:h-[620px] sm:max-h-[85vh] sm:rounded-2xl
              /* Desktop: Floating Popup aligned nicely to side of the global chatbot */
              lg:top-auto lg:left-auto lg:bottom-24 lg:right-[450px] lg:translate-x-0 lg:translate-y-0 lg:w-[400px] lg:h-[630px]"
            id="prod-summary-assistant-panel"
          >
            {/* Mobile Touch / Drag Bar Indicator */}
            <div className="h-1 bg-slate-200/80 w-12 rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

            {/* Header */}
            <div className="bg-slate-950 px-5 py-4 flex items-center justify-between border-b border-slate-900 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-md">
                  <Zap className="w-4.5 h-4.5 text-white fill-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[12px] font-extrabold text-white tracking-wider flex items-center gap-1">
                    PRODUCT INTELLIGENCE <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono uppercase">AI CONCIERGE</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold truncate max-w-[200px] sm:max-w-[220px]">
                    Analyzing: {product.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Minimize"
                  id="prod-assistant-minimize"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Close"
                  id="prod-assistant-close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Conversation Flow Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 bg-slate-50/50 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 w-full">
              {activeMessages.map((msg, idx) => {
                const isUser = msg.role === "user";
                const { sections, hasParsed } = parseResponseSections(msg.content);

                return (
                  <motion.div
                    key={msg.id || idx}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Zap className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                    <div className="flex flex-col max-w-[85%] sm:max-w-[80%] min-w-0">
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-slate-800 text-xs sm:text-sm shadow-2xs break-words ${
                          isUser
                            ? "bg-slate-950 text-white rounded-tr-none font-medium"
                            : "bg-white border border-slate-100/80 rounded-tl-none font-normal"
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap text-xs select-text leading-relaxed">{msg.content}</p>
                        ) : hasParsed ? (
                          <SmartSummaryCards sections={sections} />
                        ) : (
                          <StandardMessageBody text={msg.content} />
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

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-0.5 animate-spin">
                    <Zap className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div className="bg-white border border-slate-100 px-4 py-3.5 rounded-2xl rounded-tl-none shadow-3xs flex-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500 font-bold font-sans">Analyzing Product Intelligence...</span>
                        <div className="flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                      <div className="space-y-1.5 mt-1 animate-pulse">
                        <div className="h-2 bg-slate-100 rounded w-full" />
                        <div className="h-2 bg-slate-100 rounded w-4/5" />
                        <div className="h-2 bg-slate-100 rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick action suggested question chips */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex flex-nowrap gap-1.5 overflow-x-auto scrollbar-none shrink-0" id="product-assistant-suggestions">
              {actionChips.map((chipText, i) => (
                <button
                  key={i}
                  onClick={() => submitMessage(chipText)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-white border border-slate-200/60 hover:border-amber-500/50 hover:bg-slate-50 text-slate-700 hover:text-slate-950 font-sans text-[11px] font-semibold rounded-full shadow-3xs whitespace-nowrap cursor-pointer transition-all flex items-center gap-1"
                >
                  <span>{chipText}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                </button>
              ))}
            </div>

            {/* Chat message input form */}
            <div className="px-4 py-3 bg-white border-t border-slate-100 flex flex-col shrink-0">
              <div className="flex items-end gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask about ${product.brand} ${product.subcategory}...`}
                  className="flex-1 max-h-16 min-h-[22px] outline-none border-none bg-transparent text-xs text-slate-800 placeholder-slate-400 py-0.5 resize-none font-sans scrollbar-none font-medium leading-relaxed"
                  disabled={isLoading}
                  rows={1}
                />
                
                <button
                  onClick={() => submitMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isLoading}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                    inputMessage.trim() && !isLoading
                      ? "bg-slate-950 hover:bg-slate-900 text-white"
                      : "text-slate-300 bg-slate-100"
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Info footer */}
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-[9px] text-gray-400 font-sans flex items-center gap-1 select-none">
                  <Zap className="w-2.5 h-2.5 text-amber-500 animate-pulse fill-amber-500" /> Auto-Context Active • Powered by Gemini
                </span>
                {activeMessages.length > 0 && (
                  <button
                    onClick={() => {
                      setSessionHistories((prev) => ({
                        ...prev,
                        [product.id]: []
                      }));
                      setTimeout(() => triggerAutomaticSummary(), 100);
                    }}
                    className="text-[9px] text-gray-400 hover:text-amber-600 transition-colors font-semibold uppercase tracking-wider cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Reset AI
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Assistant Bar overlay */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-[350px] bg-amber-500 hover:bg-amber-600 text-white font-sans text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-amber-400 flex items-center justify-between sm:justify-start gap-3 tracking-wide cursor-pointer z-50 select-none group"
            id="prod-summary-assistant-minimized"
          >
            <div className="relative w-5 h-5 rounded-md bg-slate-950 flex items-center justify-center shadow-inner shrink-0">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </div>
            <span className="truncate flex-1">AI Summarizer: {product.name}</span>
            <span className="text-[10px] bg-slate-950 text-amber-400 font-bold px-2 py-0.5 rounded-full group-hover:scale-105 transition-transform uppercase shrink-0">
              Restore
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
