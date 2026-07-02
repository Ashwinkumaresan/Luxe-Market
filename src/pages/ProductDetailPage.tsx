import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronRight, Star, Heart, ShoppingBag, Sparkles, 
  ShieldCheck, HelpCircle, Check, ArrowRight, Truck, 
  RotateCcw, Lock, Leaf, Plus, Minus, Info, X, 
  MessageSquare, Send, BookOpen, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, CartItem, Review } from "../types";
import { PRODUCTS } from "../data/products";
import ProductSummaryAssistant from "../components/ProductSummaryAssistant";

const PRODUCT_IMAGES_MAP: Record<string, string[]> = {
  "elec-1": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
  ],
  "elec-2": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80"
  ],
  "elec-3": [
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1529359051031-61a7a6b61c94?auto=format&fit=crop&w=800&q=80"
  ],
  "elec-4": [
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1626908013351-800ddd734b8a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80"
  ],
  "fash-1": [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
  ],
  "fash-2": [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80"
  ],
  "fash-3": [
    "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1613481541391-4d7915c4ae15?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
  ],
  "home-1": [
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80"
  ],
  "home-2": [
    "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581781894097-2139f476ae58?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  ],
  "home-3": [
    "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
  ],
  "beau-1": [
    "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80"
  ],
  "beau-2": [
    "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
  ],
  "beau-3": [
    "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"
  ],
  "spor-1": [
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1502744688674-c619d3887c2e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571068316341-2f8ed969be41?auto=format&fit=crop&w=800&q=80"
  ],
  "spor-2": [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"
  ],
  "spor-3": [
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80"
  ],
  "nike-airmax-270": [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
  ],
  "nike-airmax-pulse": [
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80"
  ],
  "nike-airforce-1": [
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"
  ],
  "nike-dunk-low": [
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80"
  ],
  "nike-airmax-90": [
    "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80"
  ]
};

const getProductImages = (product: Product): string[] => {
  if (PRODUCT_IMAGES_MAP[product.id]) {
    return PRODUCT_IMAGES_MAP[product.id];
  }
  if (product.images && product.images.length >= 4) {
    return product.images.slice(0, 4);
  }
  const baseImg = product.image;
  const isUnsplash = baseImg.includes("unsplash.com");
  if (isUnsplash) {
    // Add unique sig values so the browser fetches distinct instances/details
    return [
      baseImg,
      `${baseImg}&sig=1&q=80&w=800`,
      `${baseImg}&sig=2&q=80&w=800`,
      `${baseImg}&sig=3&q=80&w=800`
    ];
  }
  return [baseImg, baseImg, baseImg, baseImg];
};

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product, selectedColor: string, qty: number, selectedSize?: string) => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
  onProductSelect: (p: Product) => void;
  cart: CartItem[];
  wishlist: Product[];
  onBuyNow?: (p: Product, selectedColor: string, qty: number, selectedSize?: string) => void;
}

export default function ProductDetailView({
  product,
  onBack,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onProductSelect,
  cart,
  wishlist,
  onBuyNow
}: ProductDetailViewProps) {
  // State variables
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "Default");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "size-fit" | "reviews" | "qa">("description");
  
  // Custom states for interactive features
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, boolean>>({});
  const [qaSearch, setQaSearch] = useState("");
  
  // Review form states
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");
  const [localReviews, setLocalReviews] = useState<Review[]>(product.reviews);

  // Q&A list states
  const [newQuestionText, setNewQuestionText] = useState("");
  const [questionSuccessMsg, setQuestionSuccessMsg] = useState("");
  const [localQas, setLocalQas] = useState<any[]>([]);

  // Interactive zoom states and handlers
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transformOrigin: "center center" });
  const [isZooming, setIsZooming] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.8)"
    });
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)"
    });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const topSectionRef = useRef<HTMLDivElement>(null);
  const specsTabRef = useRef<HTMLDivElement>(null);

  // Initialize product specific states when product changes
  useEffect(() => {
    setSelectedImage(product.image);
    setSelectedColor(product.colors[0]?.name || "Default");
    
    // Set a default size if sizes are available
    if (product.sizes && product.sizes.length > 0) {
      // For shoes, let's default to size 8 if present, otherwise first available size
      const size8 = product.sizes.find(s => s === "8");
      setSelectedSize(size8 || product.sizes[0]);
    } else {
      setSelectedSize("");
    }
    
    setQuantity(1);
    setLocalReviews(product.reviews);
    
    // Set up initial QAs for the product
    const initialQas = product.qas || [
      { id: "qa-1", question: "Is this product durable for everyday use?", answer: `Absolutely. The ${product.name} is constructed with premium materials and engineered to meet professional luxury standards, ensuring outstanding performance and wear-resistance.`, date: "May 10, 2026", helpfulCount: 24 },
      { id: "qa-2", question: "What are the exact care/cleaning instructions?", answer: "We recommend wiping gently with a micro-damp fiber cloth. Avoid harsh chemicals or machine washing to preserve the delicate outer textures and high-quality adhesives.", date: "June 02, 2026", helpfulCount: 15 }
    ];
    setLocalQas(initialQas);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product]);

  // Monitor scroll for the sticky bottom bar
  useEffect(() => {
    const handleScroll = () => {
      if (topSectionRef.current) {
        const rect = topSectionRef.current.getBoundingClientRect();
        // Show sticky bar when the main product controls are scrolled out of view (e.g., rect.bottom < 50)
        setShowStickyBar(rect.bottom < 80);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch 4 related products in the same category (excluding current)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  // Fallback for related products if there aren't enough in the same category
  const fallbackRelatedProducts = relatedProducts.length >= 4 
    ? relatedProducts 
    : [...relatedProducts, ...PRODUCTS.filter(p => p.id !== product.id && !relatedProducts.some(rp => rp.id === p.id))].slice(0, 4);

  // Calculate delivery date range dynamically (3-5 days from today)
  const getDeliveryDateRange = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 3);
    const end = new Date(today);
    end.setDate(today.getDate() + 5);

    const format = (d: Date) => {
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    };

    return `Fast delivery: ${format(start)} - ${format(end)}`;
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor, quantity, selectedSize || undefined);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleBuyItNow = () => {
    if (onBuyNow) {
      onBuyNow(product, selectedColor, quantity, selectedSize || undefined);
    } else {
      // Add to cart first
      onAddToCart(product, selectedColor, quantity, selectedSize || undefined);
      // Find the checkout button trigger in the app to open checkout directly
      const checkoutBtn = document.getElementById("cart-checkout-btn");
      if (checkoutBtn) {
        checkoutBtn.click();
      } else {
        const cartIcon = document.getElementById("header-cart-btn");
        if (cartIcon) {
          cartIcon.click();
        }
      }
    }
  };

  const handleToggleHelpfulReview = (reviewId: string) => {
    setHelpfulReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newReview: Review = {
      id: `rev-local-${Date.now()}`,
      author: newReviewAuthor,
      rating: newReviewRating,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      }),
      comment: newReviewComment,
      helpfulCount: 0
    };

    setLocalReviews([newReview, ...localReviews]);
    setNewReviewAuthor("");
    setNewReviewRating(5);
    setNewReviewComment("");
    setReviewSuccessMsg("Thank you! Your verified-member review has been posted successfully.");
    setTimeout(() => setReviewSuccessMsg(""), 4000);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQa = {
      id: `qa-local-${Date.now()}`,
      question: newQuestionText,
      answer: "Thank you for asking! Our dedicated Luxe Concierge is compiling an expert answer for you and will post it within 1-2 hours. You will receive an email notification.",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      helpfulCount: 0
    };

    setLocalQas([newQa, ...localQas]);
    setNewQuestionText("");
    setQuestionSuccessMsg("Your question has been sent to our brand experts!");
    setTimeout(() => setQuestionSuccessMsg(""), 4000);
  };

  // Filter QAs by search text
  const filteredQas = localQas.filter(qa => 
    qa.question.toLowerCase().includes(qaSearch.toLowerCase()) || 
    qa.answer.toLowerCase().includes(qaSearch.toLowerCase())
  );

  // Generate dynamic thumbnails list
  const thumbnails = getProductImages(product);

  // Price calculations
  const originalPrice = product.originalPrice || (product.discount ? Math.round(product.price / (1 - product.discount/100)) : undefined);
  const discountAmount = originalPrice ? Math.round(originalPrice - product.price) : undefined;

  // Sizing chart data
  const shoeSizeChart = [
    { us: "6", uk: "5.5", eu: "38.5", cm: "24" },
    { us: "7", uk: "6", eu: "40", cm: "25" },
    { us: "8", uk: "7", eu: "41", cm: "26" },
    { us: "9", uk: "8", eu: "42.5", cm: "27" },
    { us: "10", uk: "9", eu: "44", cm: "28" },
    { us: "11", uk: "10", eu: "45", cm: "29" },
    { us: "12", uk: "11", eu: "46", cm: "30" },
    { us: "13", uk: "12", eu: "47.5", cm: "31" }
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-[#fafafa]" id="product-detail-view-container">
      
      {/* 1. Breadcrumbs Row */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400 font-medium select-none min-w-0">
          <span className="hover:text-slate-900 cursor-pointer shrink-0" onClick={onBack}>Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          <span className="hover:text-slate-900 cursor-pointer shrink-0" onClick={onBack}>{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          <span className="hover:text-slate-900 cursor-pointer text-gray-400 shrink-0" onClick={onBack}>{product.subcategory}</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          <span className="text-slate-950 font-semibold truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* 2. Main Product Fold */}
      <div ref={topSectionRef} className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Media Gallery */}
          <div className="lg:col-span-7 flex flex-col lg:flex-row gap-4 w-full min-w-0">
            
            {/* Thumbnail Navigation (Desktop: Vertical layout on left; Mobile/Tablet: Horizontal layout on bottom) */}
            <div className="flex flex-row lg:flex-col gap-2.5 order-2 lg:order-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 shrink-0 select-none no-scrollbar">
              {thumbnails.map((imgUrl, index) => {
                const isSelected = selectedImage === imgUrl;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-[#f4f4f4] rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                      isSelected ? "border-slate-950 scale-[1.03] shadow-sm" : "border-transparent hover:border-gray-300 hover:scale-[1.01]"
                    }`}
                    id={`thumb-btn-${index}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} view ${index + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                );
              })}
            </div>

            {/* Main Showcase Viewport */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative flex-1 min-w-0 aspect-square bg-[#ececec] rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center order-1 lg:order-2 group shadow-[0_4px_30px_rgba(0,0,0,0.02)] cursor-zoom-in"
            >
              <div 
                className="w-full h-full overflow-hidden flex items-center justify-center pointer-events-none transition-transform duration-75 ease-out"
                style={zoomStyle}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={selectedImage}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                    id="showcase-main-image"
                  />
                </AnimatePresence>
              </div>

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none select-none">
                {product.isBestSeller && (
                  <span className="bg-slate-900 text-white text-[9px] font-bold tracking-widest px-3 py-1.5 rounded-xl uppercase shadow-md">
                    Best Seller
                  </span>
                )}
                {product.ecoFriendly && (
                  <span className="bg-emerald-500 text-white text-[9px] font-bold tracking-widest px-3 py-1.5 rounded-xl uppercase flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> Eco-Friendly
                  </span>
                )}
              </div>

              {/* Floating Heart / Wishlist Toggle */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg border border-gray-100 hover:scale-105 active:scale-95 transition-all duration-300 z-10 ${
                  isWishlisted ? "text-[#1e3a8a]" : "text-slate-400 hover:text-[#1e3a8a]"
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                id="showcase-wishlist-toggle"
              >
                <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-[#1e3a8a] text-[#1e3a8a]" : ""}`} />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Buying Operations */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Brand & Name */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
                {product.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-1 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2 mt-3 select-none">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-500" : "text-gray-200"}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-900">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewsCount.toLocaleString()} reviews)</span>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-200/60 my-5" />

            {/* Pricing Area */}
            <div className="flex items-baseline flex-wrap gap-2.5">
              <span className="text-3xl font-extrabold text-slate-950 tracking-tight" id="detail-price-label">
                ${product.price.toFixed(2)}
              </span>
              {originalPrice && (
                <>
                  <span className="text-lg text-slate-400 line-through font-medium">
                    ${originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-[#f0f9ff] text-[#0369a1] text-[10px] font-bold tracking-wider px-2.5 py-1 border border-[#e0f2fe] rounded uppercase">
                    SAVE {product.discount ? `${product.discount}%` : `$${discountAmount?.toFixed(0)}`}
                  </span>
                </>
              )}
            </div>

            {/* Color Selector */}
            <div className="mt-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Color: <span className="text-slate-950 font-semibold">{selectedColor}</span>
              </h4>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative p-1 rounded-full border-2 transition-all duration-300 ${
                        isSelected ? "border-slate-950 scale-105" : "border-transparent hover:scale-105 hover:border-gray-300"
                      }`}
                      title={color.name}
                      id={`detail-color-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <span
                        className="block w-7 h-7 rounded-full shadow-inner border border-black/10"
                        style={{ backgroundColor: color.hex }}
                      />
                      {isSelected && (
                        <span className="absolute -bottom-1 -right-1 bg-slate-950 text-white p-0.5 rounded-full border border-white">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizing Grid (Display conditionally if sizes exist) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Select Size (US)
                  </h4>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs font-bold underline text-slate-950 hover:text-slate-600 transition-colors"
                    id="size-guide-trigger"
                  >
                    Size Guide
                  </button>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2" id="detail-sizes-grid">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    // For Air Max 270, let's make size 12 out of stock / disabled to match the mockup!
                    const isOutOfStock = product.id === "nike-airmax-270" && size === "12";
                    
                    return (
                      <button
                        key={size}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative border ${
                          isOutOfStock 
                            ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed line-through" 
                            : isSelected
                              ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                              : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                        id={`size-btn-${size}`}
                      >
                        {size}
                        {isOutOfStock && (
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="w-full h-px bg-slate-300 transform rotate-12" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Cart Action */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              
              {/* Stepper */}
              <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden self-start sm:self-auto shrink-0 shadow-sm">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3.5 py-3.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors border-r border-slate-200"
                  aria-label="Decrease quantity"
                  id="qty-decrement"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-5 text-sm font-bold text-slate-900 font-mono select-none" id="qty-indicator">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-3.5 py-3.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors border-l border-slate-200"
                  aria-label="Increase quantity"
                  id="qty-increment"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md ${
                  isAdded 
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100" 
                    : "bg-slate-950 hover:bg-slate-800 text-white shadow-slate-200"
                }`}
                id="add-to-cart-action-btn"
              >
                <ShoppingBag className="w-4 h-4" />
                {isAdded ? "ADDED TO CART!" : "ADD TO CART"}
              </button>
            </div>

            {/* Buy It Now Button */}
            <button
              onClick={handleBuyItNow}
              className="mt-3 w-full py-3.5 border border-slate-950 rounded-xl bg-white hover:bg-slate-50 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-sm"
              id="buy-it-now-action-btn"
            >
              BUY IT NOW
            </button>

            {/* shipping delivery row */}
            <div className="mt-6 flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 font-medium">
              <Truck className="w-4.5 h-4.5 text-slate-800 shrink-0" />
              <span>{getDeliveryDateRange()}</span>
            </div>

            {/* Assurances Grid (2x2) */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] text-slate-500 font-medium font-sans select-none">
              <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-100 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-slate-800 shrink-0" />
                <span>2-YEAR WARRANTY</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-100 rounded-xl">
                <Leaf className="w-4 h-4 text-slate-800 shrink-0" />
                <span>CARBON NEUTRAL</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-100 rounded-xl">
                <RotateCcw className="w-4 h-4 text-slate-800 shrink-0" />
                <span>FREE RETURNS</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-100 rounded-xl">
                <Lock className="w-4 h-4 text-slate-800 shrink-0" />
                <span>SECURE PAYMENT</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Detailed Middle Section (Tabs & Showcase Panels) */}
      <div className="w-full bg-white border-t border-b border-slate-200/60 mt-12">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Tabs header list */}
          <div className="flex gap-6 sm:gap-8 overflow-x-auto overflow-y-hidden border-b border-slate-100 select-none no-scrollbar">
            {[
              { id: "description", label: "Description" },
              { id: "specs", label: "Specifications" },
              { id: "size-fit", label: "Size & Fit" },
              { id: "reviews", label: `Reviews (${localReviews.length})` },
              { id: "qa", label: "Q&A" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 text-sm font-semibold transition-all shrink-0 border-b-2 -mb-px relative ${
                    isActive 
                      ? "text-slate-950 border-slate-950" 
                      : "text-slate-400 border-transparent hover:text-slate-600"
                  }`}
                  id={`tab-trigger-${tab.id}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active Tab Showcase Pane */}
          <div className="py-8 sm:py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                id={`tab-pane-${activeTab}`}
              >
                
                {/* A. DESCRIPTION TAB */}
                {activeTab === "description" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left text column */}
                    <div className="md:col-span-7 space-y-4 overflow-visible h-auto">
                      <h3 className="text-lg font-bold text-slate-900 font-display">
                        Elevated Air. Artistic React.
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-sans overflow-visible h-auto">
                        {product.description}
                      </p>
                      
                      {/* Sub features list */}
                      <div className="space-y-4 pt-4">
                        <div className="flex gap-3.5 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100/80">
                          <div className="p-2.5 bg-slate-100 text-slate-950 rounded-full shrink-0">
                            <Info className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Air Max Unit</h5>
                            <p className="text-xs text-slate-500 mt-0.5">270-degree visible Air for premium, high-fidelity cushion and shock absorption.</p>
                          </div>
                        </div>

                        <div className="flex gap-3.5 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100/80">
                          <div className="p-2.5 bg-slate-100 text-slate-950 rounded-full shrink-0">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">React Foam Technology</h5>
                            <p className="text-xs text-slate-500 mt-0.5">Ultralight, durable foam that delivers an incredibly fluid and springy stride response.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right showcase image column (visual pair matching mockup) */}
                    <div className="md:col-span-5 aspect-[4/3] sm:aspect-[1.5/1] md:aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100">
                      <img
                        src={thumbnails[2] || product.image}
                        alt={`${product.name} styling showcase`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-500"
                      />
                    </div>
                  </div>
                )}

                {/* B. SPECIFICATIONS TAB */}
                {activeTab === "specs" && (
                  <div className="max-w-2xl bg-white border border-slate-100 rounded-2xl overflow-x-auto shadow-sm">
                    <table className="w-full text-left text-sm font-sans" id="specs-table">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-400 tracking-wider">
                          <th className="py-3.5 px-6">Specification</th>
                          <th className="py-3.5 px-6">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {product.specs.map((spec, index) => (
                          <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-6 font-semibold text-slate-900">{spec.label}</td>
                            <td className="py-3.5 px-6 font-medium text-slate-500">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* C. SIZE & FIT TAB */}
                {activeTab === "size-fit" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    {/* Size Guide Table */}
                    <div className="md:col-span-7 bg-white border border-slate-100 rounded-2xl overflow-x-auto shadow-sm">
                      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                        <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Sizing Conversions</h4>
                      </div>
                      <table className="w-full text-left text-xs font-sans">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                            <th className="py-3 px-5">US Men's</th>
                            <th className="py-3 px-5">US Women's</th>
                            <th className="py-3 px-5">UK Size</th>
                            <th className="py-3 px-5">Europe (EU)</th>
                            <th className="py-3 px-5">Length (cm)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                          {shoeSizeChart.map((row) => (
                            <tr key={row.us} className="hover:bg-slate-50/50">
                              <td className="py-3 px-5 font-bold text-slate-900">{row.us}</td>
                              <td className="py-3 px-5 font-semibold text-slate-500">{(parseFloat(row.us) + 1.5).toString()}</td>
                              <td className="py-3 px-5 font-medium">{row.uk}</td>
                              <td className="py-3 px-5 font-medium">{row.eu}</td>
                              <td className="py-3 px-5 font-medium font-mono">{row.cm} cm</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Sizing Tips */}
                    <div className="md:col-span-5 bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-4">
                      <div className="flex gap-2.5 items-center">
                        <BookOpen className="w-5 h-5 text-slate-900" />
                        <h4 className="font-bold text-sm text-slate-950 font-display">How to measure</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">
                        We recommend measuring your foot length from the heel to your longest toe using a sheet of paper. Place your heel against a wall and mark your longest toe, then read the centimeters.
                      </p>
                      <div className="h-px bg-slate-200" />
                      <div className="flex gap-2 items-start text-xs text-slate-600 font-medium">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900">Fits True To Size:</span> 
                          <span className="text-slate-500 ml-1">We recommend selecting your standard size. If you have exceptionally wide feet, opt for a half-size larger to prevent constriction around the midfoot panels.</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* D. REVIEWS TAB */}
                {activeTab === "reviews" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Aggregated Summary Score & Add Review Form */}
                    <div className="md:col-span-4 space-y-6">
                      
                      {/* Score Summary Card */}
                      <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col items-center text-center shadow-inner">
                        <span className="text-4xl sm:text-5xl font-extrabold text-slate-950">{product.rating}</span>
                        <div className="flex items-center gap-0.5 text-amber-500 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-500" : "text-gray-200"}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-400 mt-2">Based on {localReviews.length} member ratings</span>
                      </div>

                      {/* Add Review Form */}
                      <form onSubmit={handleReviewSubmit} className="bg-white border border-slate-150 p-5 rounded-2xl space-y-4 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-950 font-display">Share Your Experience</h4>
                        
                        {reviewSuccessMsg && (
                          <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg">
                            {reviewSuccessMsg}
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Liam T."
                            value={newReviewAuthor}
                            onChange={(e) => setNewReviewAuthor(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 focus:bg-white transition-all font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</label>
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setNewReviewRating(star)}
                                className="text-amber-500 hover:scale-110 active:scale-95 transition-all"
                              >
                                <Star className={`w-6 h-6 ${star <= newReviewRating ? "fill-amber-500" : "text-gray-200"}`} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Comments</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Write your constructive critique..."
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 focus:bg-white transition-all font-sans resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs tracking-wider rounded-xl transition-all shadow-sm"
                        >
                          SUBMIT REVIEW
                        </button>
                      </form>

                    </div>

                    {/* Right Column: Reviews List Feed */}
                    <div className="md:col-span-8 space-y-4">
                      {localReviews.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                          <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          <span className="text-xs font-medium">No reviews posted yet. Be the first!</span>
                        </div>
                      ) : (
                        localReviews.map((review) => {
                          const hasVotedHelpful = helpfulReviews[review.id];
                          return (
                            <motion.div
                              layout
                              key={review.id}
                              className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.015)] transition-all flex flex-col gap-2.5"
                            >
                              <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                  <span className="text-sm font-bold text-slate-900">{review.author}</span>
                                  <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase font-mono tracking-wider">
                                    Verified Buyer
                                  </span>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">{review.date}</span>
                              </div>

                              {/* Star rating icons */}
                              <div className="flex items-center gap-0.5 text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-500" : "text-gray-200"}`} 
                                  />
                                ))}
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed font-sans">{review.comment}</p>

                              <div className="h-px bg-slate-100 my-1" />

                              {/* Helpful counter button */}
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] text-slate-400">Was this review helpful?</span>
                                <button
                                  onClick={() => handleToggleHelpfulReview(review.id)}
                                  className={`text-[11px] font-bold px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                                    hasVotedHelpful
                                      ? "bg-emerald-50 text-emerald-600 font-bold border border-emerald-100"
                                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-black border border-slate-150"
                                  }`}
                                >
                                  Yes ({review.helpfulCount + (hasVotedHelpful ? 1 : 0)})
                                </button>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>

                  </div>
                )}

                {/* E. Q&A TAB */}
                {activeTab === "qa" && (
                  <div className="space-y-6">
                    
                    {/* Search & Header Row */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                      <div className="relative w-full sm:max-w-md">
                        <input
                          type="text"
                          placeholder="Search for answers or terms..."
                          value={qaSearch}
                          onChange={(e) => setQaSearch(e.target.value)}
                          className="w-full text-xs pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 transition-all font-sans shadow-sm"
                        />
                      </div>
                      <span className="text-xs text-slate-400 font-semibold shrink-0">
                        {filteredQas.length} answers available
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                      
                      {/* Q&A List */}
                      <div className="md:col-span-8 space-y-4">
                        {filteredQas.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            <span className="text-xs font-medium">No matches found. Ask a brand specialist below!</span>
                          </div>
                        ) : (
                          filteredQas.map((qa) => (
                            <div key={qa.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-3">
                              <div className="flex gap-2 items-start">
                                <span className="text-xs font-extrabold text-slate-900 bg-slate-100 p-1 rounded font-mono select-none">Q</span>
                                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{qa.question}</h4>
                              </div>
                              <div className="flex gap-2 items-start pl-1">
                                <span className="text-xs font-extrabold text-white bg-slate-950 px-1 py-0.5 rounded font-mono select-none">A</span>
                                <div className="space-y-1">
                                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{qa.answer}</p>
                                  <span className="block text-[10px] text-slate-400">Answered by Luxe Support on {qa.date}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Ask Question Form */}
                      <div className="md:col-span-4 bg-white border border-slate-150 p-5 rounded-2xl space-y-4 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-950 font-display">Ask a Question</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Can't find the answers you need? Submit a query directly to our product design experts.
                        </p>

                        {questionSuccessMsg && (
                          <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg">
                            {questionSuccessMsg}
                          </div>
                        )}

                        <form onSubmit={handleQuestionSubmit} className="space-y-3">
                          <textarea
                            required
                            rows={3}
                            placeholder="Type your question..."
                            value={newQuestionText}
                            onChange={(e) => setNewQuestionText(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 focus:bg-white transition-all font-sans resize-none"
                          />
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            ASK CONCIERGE
                          </button>
                        </form>
                      </div>

                    </div>

                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* 4. related items (You May Also Like) */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex justify-between items-baseline mb-6 border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold tracking-tight text-slate-950 font-display">
            You May Also Like
          </h3>
          <button 
            onClick={onBack}
            className="text-xs font-bold text-slate-900 hover:text-slate-600 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8" id="related-products-grid">
          {fallbackRelatedProducts.map((relatedProd) => (
            <div
              key={relatedProd.id}
              onClick={() => onProductSelect(relatedProd)}
              className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.035)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full"
              id={`related-card-${relatedProd.id}`}
            >
              {/* Image Viewport */}
              <div className="relative aspect-square bg-[#ececec] rounded-xl overflow-hidden mb-4 border border-slate-100">
                <img
                  src={relatedProd.image}
                  alt={relatedProd.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Related Info */}
              <div className="flex flex-col flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  {relatedProd.brand}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug group-hover:text-slate-700 transition-colors line-clamp-1">
                  {relatedProd.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">{relatedProd.subcategory}</p>
                
                {/* Related Rating */}
                <div className="flex items-center gap-1 mt-1.5 select-none">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-semibold text-slate-900">{relatedProd.rating}</span>
                </div>

                <div className="flex items-baseline gap-2 mt-3 pt-2 border-t border-slate-50">
                  <span className="text-sm font-bold text-slate-950">
                    ${relatedProd.price.toFixed(2)}
                  </span>
                  {relatedProd.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      ${relatedProd.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Sticky Bottom Action Bar (Floating bar on scroll fold) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 p-3.5 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md"
            id="floating-sticky-bottom-bar"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              
              {/* Product Info Preview (Left) */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/60 shrink-0 select-none hidden sm:block">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-950 truncate max-w-[200px] md:max-w-sm">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {selectedColor} — <span className="font-bold text-slate-800">${product.price.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons (Right) */}
              <div className="flex items-center gap-2.5">
                
                {/* Size Display in bottom bar */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="relative shrink-0">
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 hover:border-slate-400 rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer pr-7 select-none appearance-none"
                      id="sticky-size-picker"
                    >
                      {product.sizes.map(size => {
                        const isOutOfStock = product.id === "nike-airmax-270" && size === "12";
                        return (
                          <option key={size} value={size} disabled={isOutOfStock}>
                            Size {size} {isOutOfStock ? "(OOS)" : ""}
                          </option>
                        );
                      })}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px] font-bold">
                      ▼
                    </span>
                  </div>
                )}

                {/* Add to Cart Sticky Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all shadow-md select-none ${
                    isAdded 
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100" 
                      : "bg-slate-950 hover:bg-slate-800 text-white shadow-slate-200"
                  }`}
                  id="sticky-add-to-cart-btn"
                >
                  {isAdded ? "ADDED!" : "ADD TO CART"}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Sizing Guide Slide Drawer/Modal Overlay */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 bg-black z-50"
              id="size-guide-overlay"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 overflow-y-auto p-6 sm:p-8 flex flex-col justify-between"
              id="size-guide-drawer"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-950 font-display">Sizing Guidelines</h3>
                  <button 
                    onClick={() => setIsSizeGuideOpen(false)}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-black transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  The conversion metrics below help you select your best fit. Our footwear is manufactured to professional, standard US lengths.
                </p>

                <div className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-inner">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-4">US Men</th>
                        <th className="py-2.5 px-4">US Women</th>
                        <th className="py-2.5 px-4">UK</th>
                        <th className="py-2.5 px-4">Europe</th>
                        <th className="py-2.5 px-4">Centimeters</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {shoeSizeChart.map((row) => (
                        <tr key={row.us} className="hover:bg-slate-50/40">
                          <td className="py-2.5 px-4 font-bold text-slate-950">{row.us}</td>
                          <td className="py-2.5 px-4 font-semibold text-slate-500">{(parseFloat(row.us) + 1.5).toString()}</td>
                          <td className="py-2.5 px-4">{row.uk}</td>
                          <td className="py-2.5 px-4">{row.eu}</td>
                          <td className="py-2.5 px-4 font-mono">{row.cm} cm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Info className="w-4 h-4 text-amber-800" />
                    <span>Fit Recommendation</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    This shoe runs true to size. If you fall between sizes or have a wider foot profile, we recommend choosing a half-size larger.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs tracking-wider rounded-xl transition-all shadow-md mt-6"
              >
                GOT IT
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI-powered Product Summary Assistant */}
      <ProductSummaryAssistant product={product} />

    </div>
  );
}
