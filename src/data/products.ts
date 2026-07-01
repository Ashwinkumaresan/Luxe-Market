import { Product } from "../types";

export const PRODUCTS: Product[] = [
  // --- ELECTRONICS ---
  {
    id: "elec-1",
    name: "Aurum Premium Wireless Headphones",
    description: "Expertly tuned wireless headphones featuring custom titanium drivers and signature gold accents. Active noise cancelling delivers unparalleled auditory clarity, while memory-foam plush cups provide hours of high-fidelity luxury listening.",
    price: 299.00,
    originalPrice: 375.00,
    rating: 4.9,
    reviewsCount: 128,
    category: "Electronics",
    subcategory: "Headphones",
    brand: "Aurum",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    stock: 15,
    ecoFriendly: false,
    points: 150,
    isBestSeller: true,
    discount: 20,
    specs: [
      { label: "Connectivity", value: "Bluetooth 5.2 / AAC / AptX HD" },
      { label: "Battery Life", value: "Up to 40 Hours (ANC On)" },
      { label: "Driver Size", value: "40mm Gold-Plated Titanium" },
      { label: "Charging", value: "USB-C Fast Charging (10m = 5h)" },
      { label: "Weight", value: "260g" }
    ],
    colors: [
      { name: "Navy & Gold", hex: "#1d2a44" },
      { name: "Obsidian Black", hex: "#111111" },
      { name: "Pearl White", hex: "#f0f0f0" }
    ],
    reviews: [
      { id: "rev-1-1", author: "Julian S.", rating: 5, date: "June 14, 2026", comment: "The noise isolation is unmatched. The gold accents look so classier in person than the photos can show. Absolutely premium.", helpfulCount: 42 },
      { id: "rev-1-2", author: "Helena R.", rating: 5, date: "May 28, 2026", comment: "The soundstage is extremely wide. Listening to orchestral music feels like being in the front row. Highly recommend.", helpfulCount: 19 },
      { id: "rev-1-3", author: "Marcus K.", rating: 4, date: "April 12, 2026", comment: "Extremely comfortable. My only gripe is the carrying case is slightly bulky, but the headphones themselves are flawless.", helpfulCount: 8 }
    ]
  },
  {
    id: "elec-2",
    name: "Solis Chronos Titanium Smartwatch",
    description: "A precision-crafted smartwatch featuring a Grade 5 titanium case and custom hand-stitched Italian leather strap. Beautiful always-on AMOLED display shielded by scratch-resistant sapphire crystal, delivering full biometric telemetry.",
    price: 349.00,
    originalPrice: 399.00,
    rating: 4.8,
    reviewsCount: 94,
    category: "Electronics",
    subcategory: "Wearables",
    brand: "Solis",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    stock: 8,
    ecoFriendly: true,
    points: 175,
    isBestSeller: false,
    discount: 12,
    specs: [
      { label: "Materials", value: "Grade 5 Titanium & Sapphire Glass" },
      { label: "Display", value: "1.43\" Always-On AMOLED" },
      { label: "Water Resistance", value: "5 ATM (up to 50 meters)" },
      { label: "Sensors", value: "ECG, SpO2, Heart Rate, Compass" },
      { label: "Strap", value: "22mm Italian Vegetable-Tanned Leather" }
    ],
    colors: [
      { name: "Titanium Silver", hex: "#cbd5e1" },
      { name: "Classic Gold", hex: "#d4af37" },
      { name: "Stealth Graphite", hex: "#475569" }
    ],
    reviews: [
      { id: "rev-2-1", author: "Alexander P.", rating: 5, date: "May 20, 2026", comment: "Finally, a smartwatch that actually looks like a fine mechanical timepiece. The battery easily lasts 5 days on a charge.", helpfulCount: 29 },
      { id: "rev-2-2", author: "Claire D.", rating: 4, date: "May 02, 2026", comment: "The leather strap is stunningly high quality. Telemetry is highly accurate compared to my professional monitors.", helpfulCount: 12 }
    ]
  },
  {
    id: "elec-3",
    name: "Aether Spherical Spatial Speaker",
    description: "An acoustic marvel. The Aether Speaker utilizes hand-blown crystalline glass and polished aluminum to deliver stunning 360-degree spatial audio. Fills any living space with deep, rich bass and clean, sparkling high tones.",
    price: 450.00,
    rating: 4.7,
    reviewsCount: 61,
    category: "Electronics",
    subcategory: "Audio",
    brand: "Aether",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    stock: 12,
    ecoFriendly: true,
    points: 225,
    isBestSeller: true,
    specs: [
      { label: "Acoustics", value: "360° Omnidirectional Spatial Audio" },
      { label: "Amplifiers", value: "Class-D Dual Amplifiers, 80W RMS" },
      { label: "Wireless", value: "AirPlay 2, Spotify Connect, Bluetooth 5.0" },
      { label: "Inputs", value: "Optical, Aux 3.5mm" },
      { label: "Housing", value: "Acoustic Glass Globe" }
    ],
    colors: [
      { name: "Clear Glass & Chrome", hex: "#e2e8f0" },
      { name: "Smoked Glass & Gold", hex: "#334155" }
    ],
    reviews: [
      { id: "rev-3-1", author: "Nicholas T.", rating: 5, date: "June 02, 2026", comment: "An absolute design masterpiece. It acts as an ambient sculpture when off and fills the room with warm, lifelike music when on.", helpfulCount: 31 }
    ]
  },
  {
    id: "elec-4",
    name: "Lume Machined Mechanical Keyboard",
    description: "Precision engineered typing experience. Built from a solid block of milled anodized aluminum, featuring hot-swappable custom linear silent switches and high-density PBT keycaps for crisp, tactile, yet quiet execution.",
    price: 189.00,
    rating: 4.9,
    reviewsCount: 45,
    category: "Electronics",
    subcategory: "Accessories",
    brand: "Lumina",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    stock: 5,
    ecoFriendly: false,
    points: 90,
    specs: [
      { label: "Chassis", value: "CNC Milled Anodized 6063 Aluminum" },
      { label: "Switches", value: "Lume Custom Linear Silent (Hot-swappable)" },
      { label: "Keycaps", value: "Double-Shot Cherry Profile PBT" },
      { label: "Layout", value: "75% Minimalist Layout" },
      { label: "Mounting", value: "Gasket Mounted with Poron Foam Dampening" }
    ],
    colors: [
      { name: "Frost Silver", hex: "#e2e8f0" },
      { name: "Slate Grey", hex: "#64748b" },
      { name: "Sage Green", hex: "#86efac" }
    ],
    reviews: [
      { id: "rev-4-1", author: "Gregory B.", rating: 5, date: "May 15, 2026", comment: "The sound signature is absolutely 'thocky' and perfect. Weighs a ton, sits firmly on the desk. A masterpiece.", helpfulCount: 15 }
    ]
  },

  // --- FASHION ---
  {
    id: "fash-1",
    name: "Vellum Cashmere Minimalist Overcoat",
    description: "Crafted from 100% fine Mongolian cashmere. This tailored, unconstructed coat provides unmatched warmth and an elegant, sweeping silhouette. Hand-stitched lapels and fully lined with luxurious, breathable silk.",
    price: 850.00,
    rating: 5.0,
    reviewsCount: 38,
    category: "Fashion",
    subcategory: "Outerwear",
    brand: "Vellum",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80",
    stock: 4,
    ecoFriendly: true,
    points: 425,
    isBestSeller: true,
    specs: [
      { label: "Material", value: "100% Grade A Mongolian Cashmere" },
      { label: "Lining", value: "100% Mulberry Silk" },
      { label: "Craftsmanship", value: "Hand-Rolled Hem & Hand-Stitched Lapels" },
      { label: "Fit", value: "Relaxed Tailored Silhouette" },
      { label: "Care", value: "Dry Clean Only" }
    ],
    colors: [
      { name: "Camel Tan", hex: "#c29b6c" },
      { name: "Charcoal Charcoal", hex: "#334155" },
      { name: "Off-White Cream", hex: "#fafaf9" }
    ],
    reviews: [
      { id: "rev-5-1", author: "Sophia V.", rating: 5, date: "April 18, 2026", comment: "Unbelievably soft. It feels lighter than feather but keeps me so warm. The camel color is timeless.", helpfulCount: 22 }
    ]
  },
  {
    id: "fash-2",
    name: "Solis Polarized Retro Sunglasses",
    description: "Classic styling meets advanced optical science. Handcrafted from premium cellulose acetate and reinforced with solid 24k gold hinges. High-performance polarized lenses shield eyes while enhancing color contrast.",
    price: 220.00,
    originalPrice: 250.00,
    rating: 4.6,
    reviewsCount: 73,
    category: "Fashion",
    subcategory: "Accessories",
    brand: "Solis",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    stock: 20,
    ecoFriendly: true,
    points: 110,
    discount: 12,
    specs: [
      { label: "Frame", value: "Mazuchelli Cellulose Bio-Acetate" },
      { label: "Lenses", value: "UVA/UVB Polarized Cr-39 lenses" },
      { label: "Hinges", value: "7-Barrel Gold-Plated Hinges" },
      { label: "Eye-Bridge-Temple", value: "50mm - 21mm - 145mm" }
    ],
    colors: [
      { name: "Amber Tortoise", hex: "#7c2d12" },
      { name: "Gloss Black", hex: "#000000" },
      { name: "Champagne Crystal", hex: "#fef08a" }
    ],
    reviews: [
      { id: "rev-6-1", author: "Robert M.", rating: 4, date: "May 29, 2026", comment: "High quality weight. The polarization is extremely clear. A bit snug on wider heads, but breaks in perfectly.", helpfulCount: 14 }
    ]
  },
  {
    id: "fash-3",
    name: "Terra Organic Leather Chelsea Boots",
    description: "Rugged elegance refined. Handcrafted in Tuscany from vegetable-tanned full-grain leather. Built with a traditional Goodyear welt for durability and resoling, and fitted with an organic rubber crepe sole for comfort.",
    price: 380.00,
    rating: 4.8,
    reviewsCount: 52,
    category: "Fashion",
    subcategory: "Shoes",
    brand: "Terra",
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80",
    stock: 7,
    ecoFriendly: true,
    points: 190,
    specs: [
      { label: "Upper Leather", value: "Full-Grain Italian Vegetable-Tanned" },
      { label: "Construction", value: "360° Goodyear Welted" },
      { label: "Outsole", value: "Eco-Lactae Hevea Natural Rubber" },
      { label: "Insole", value: "Cork Fill & Steel Shank Supportive Footbed" }
    ],
    colors: [
      { name: "Cognac Brown", hex: "#854d0e" },
      { name: "Stealth Black", hex: "#1c1c1c" }
    ],
    reviews: [
      { id: "rev-7-1", author: "Nate H.", rating: 5, date: "June 10, 2026", comment: "The leather smells amazing. Breaking them in took about 4 days, but now they fit like a second skin. Incredible quality.", helpfulCount: 17 }
    ]
  },

  // --- HOME ---
  {
    id: "home-1",
    name: "Lumen Geometric Brass Desk Lamp",
    description: "An elegant interplay of geometry and light. This designer desk lamp stands on a heavy, solid white Carrara marble base, holding a slender, adjustable brushed brass arm. Warm dimmable LED casts soft, diffuse light.",
    price: 195.00,
    rating: 4.8,
    reviewsCount: 65,
    category: "Home",
    subcategory: "Lighting",
    brand: "Lumina",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    stock: 10,
    ecoFriendly: true,
    points: 95,
    specs: [
      { label: "Base", value: "Solid Honed Carrara Marble" },
      { label: "Arm/Shade", value: "Brushed Solid Brass, Lacquered" },
      { label: "Light Source", value: "Integrated 8W Warm-Dim LED (2200K - 3000K)" },
      { label: "Cord", value: "2.5m Hand-Braided Cotton Cable" },
      { label: "Brightness", value: "650 Lumens Max (Stepless Dimming)" }
    ],
    colors: [
      { name: "Brushed Brass & Marble", hex: "#e2e8f0" },
      { name: "Matte Black & Nero Marquina", hex: "#1e293b" }
    ],
    reviews: [
      { id: "rev-8-1", author: "Elena M.", rating: 5, date: "April 30, 2026", comment: "Absolutely gorgeous lamp. The marble base is solid and heavy. The dial dimmer is incredibly smooth.", helpfulCount: 9 }
    ]
  },
  {
    id: "home-2",
    name: "Solis Tuscan Terracotta Vase",
    description: "Individually thrown on a potter's wheel in Tuscany. This earthy, beautiful terracotta vase features an elegant flared rim and a coarse natural glaze texture. Perfect for holding dry botanicals or as a standalone art piece.",
    price: 115.00,
    originalPrice: 145.00,
    rating: 4.7,
    reviewsCount: 39,
    category: "Home",
    subcategory: "Decor",
    brand: "Solis",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    stock: 6,
    ecoFriendly: true,
    points: 55,
    discount: 20,
    specs: [
      { label: "Origin", value: "Siena, Tuscany, Italy" },
      { label: "Material", value: "100% Organic Local Clay" },
      { label: "Dimensions", value: "32cm Height x 18cm Diameter" },
      { label: "Craft", value: "Hand-Thrown and Wood-Fired at 1000°C" }
    ],
    colors: [
      { name: "Sienna Earth", hex: "#ca8a04" },
      { name: "Olive Ash", hex: "#854d0e" }
    ],
    reviews: [
      { id: "rev-9-1", author: "Fiona C.", rating: 5, date: "June 05, 2026", comment: "Each one is unique. Mine has subtle firing marks on the back that add so much character. Absolute love.", helpfulCount: 11 }
    ]
  },
  {
    id: "home-3",
    name: "Vellum Solid Walnut Desk Organizer",
    description: "Bring luxurious structure to your workspace. Crafted from a single, continuous grain block of American Walnut, featuring milled pen channels, magnetic accessory compartments, and an elegant brushed brass phone slot.",
    price: 135.00,
    rating: 4.9,
    reviewsCount: 27,
    category: "Home",
    subcategory: "Decor",
    brand: "Vellum",
    image: "https://images.unsplash.com/photo-1593085260707-5377ba37f868?auto=format&fit=crop&w=800&q=80",
    stock: 9,
    ecoFriendly: true,
    points: 65,
    isBestSeller: true,
    specs: [
      { label: "Wood", value: "FSC Certified Solid American Black Walnut" },
      { label: "Accents", value: "Solid C360 Brass Plate" },
      { label: "Finish", value: "Hand-Rubbed Organic Linseed Oil & Beeswax" },
      { label: "Features", value: "Embedded Neodymium Magnets for paperclips" }
    ],
    colors: [
      { name: "Natural Walnut", hex: "#451a03" }
    ],
    reviews: [
      { id: "rev-10-1", author: "Daniel G.", rating: 5, date: "May 12, 2026", comment: "Immaculate woodworking. The grain is beautifully matching across components. Keeps my fountain pens securely stored.", helpfulCount: 4 }
    ]
  },

  // --- BEAUTY ---
  {
    id: "beau-1",
    name: "Aurum Radiance 24k Peptide Serum",
    description: "An elixir of pure radiance. Formulated with intensive peptides, deep plant-derived hyaluronic acid, and suspended flecks of genuine 24k gold. Boosts cell rejuvenation, leaving a luminous, smooth, silk-like skin finish.",
    price: 95.00,
    rating: 4.9,
    reviewsCount: 154,
    category: "Beauty",
    subcategory: "Skincare",
    brand: "Aurum",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    stock: 18,
    ecoFriendly: true,
    points: 45,
    isBestSeller: true,
    specs: [
      { label: "Active Ingredients", value: "Matrixyl 3000 Peptides, 24k Gold, Ferulic Acid" },
      { label: "Skin Types", value: "All (Sensitive-Safe)" },
      { label: "Ethical Profile", value: "Cruelty-Free, Vegan, Paraben-Free" },
      { label: "Volume", value: "50ml / 1.7 fl. oz" }
    ],
    colors: [
      { name: "Radiant Gold", hex: "#fef08a" }
    ],
    reviews: [
      { id: "rev-11-1", author: "Isabella L.", rating: 5, date: "June 19, 2026", comment: "Literally a bottle of magic. My skin has never looked so plump and hydrated. The slight shimmer it gives is divine.", helpfulCount: 33 }
    ]
  },
  {
    id: "beau-2",
    name: "Aether Royal Oud Hand-Poured Cologne",
    description: "An sensory voyage. Royal Oud blends the deep warmth of organic Cambodian agarwood with rich sandalwood, amber, and light top notes of spicy cardamom and saffron. Encased in a massive geometric crystal glass decanter.",
    price: 180.00,
    rating: 4.8,
    reviewsCount: 82,
    category: "Beauty",
    subcategory: "Fragrance",
    brand: "Aether",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    stock: 12,
    ecoFriendly: false,
    points: 90,
    specs: [
      { label: "Concentration", value: "Extrait de Parfum (22% Oil)" },
      { label: "Top Notes", value: "Cardamom, Saffron, Rosewater" },
      { label: "Heart Notes", value: "Cambodian Oud, Atlas Cedar" },
      { label: "Base Notes", value: "Sandalwood, Ambergris, Leather" },
      { label: "Bottle", value: "Magnetic Cap, Italian Geometric Crystal" }
    ],
    colors: [
      { name: "Deep Amber", hex: "#b45309" }
    ],
    reviews: [
      { id: "rev-12-1", author: "Lucas A.", rating: 5, date: "June 08, 2026", comment: "The complexity of this fragrance is wild. It opens up with cardamom and shifts into a smooth, buttery oud. Lasts 12 hours easily.", helpfulCount: 26 }
    ]
  },
  {
    id: "beau-3",
    name: "Terra Botanical Rose Cleansing Balm",
    description: "Transform daily skin routines. Formulated with cold-pressed organic rosehip oil, soothing English chamomile, and essential lavender flower wax. It melts on contact with skin to effortlessly dissolve makeup and impurities.",
    price: 65.00,
    originalPrice: 75.00,
    rating: 4.7,
    reviewsCount: 46,
    category: "Beauty",
    subcategory: "Skincare",
    brand: "Terra",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
    stock: 22,
    ecoFriendly: true,
    points: 30,
    discount: 13,
    specs: [
      { label: "Main Extracts", value: "Organic Rosehip, Chamomile, Lavender Wax" },
      { label: "Volume", value: "100g / 3.5 oz" },
      { label: "Packaging", value: "Infinitely Recyclable Violet Glass Jar" },
      { label: "Texture", value: "Solid Balm-to-Milk Emulsion" }
    ],
    colors: [
      { name: "Blush Pink", hex: "#fbcfe8" }
    ],
    reviews: [
      { id: "rev-13-1", author: "Meera P.", rating: 5, date: "May 14, 2026", comment: "Smells like walking through an English cottage garden in spring. Removes sunscreen easily and doesn't dry out my skin.", helpfulCount: 8 }
    ]
  },

  // --- SPORTS ---
  {
    id: "spor-1",
    name: "Solis Carbon Fiber Pro Road Bike",
    description: "The peak of human-powered velocity. Solis Pro integrates an aerodynamic monocoque T1000 carbon fiber frame with wireless electronic shifting. Full internal cable routing and high-performance hydraulic disc brakes.",
    price: 2499.00,
    rating: 4.9,
    reviewsCount: 31,
    category: "Sports",
    subcategory: "Equipment",
    brand: "Solis",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
    stock: 2,
    ecoFriendly: true,
    points: 1250,
    specs: [
      { label: "Frame", value: "T1000 Carbon Monocoque, 780g" },
      { label: "Groupset", value: "Shimano Ultegra Di2 12-Speed Electronic" },
      { label: "Wheelset", value: "45mm Aerodynamic Carbon Tubeless-Ready" },
      { label: "Brakes", value: "Shimano Ultegra Hydraulic Disc" },
      { label: "Total Weight", value: "7.1 kg" }
    ],
    colors: [
      { name: "Matte Carbon", hex: "#22252a" },
      { name: "Racing Red", hex: "#b91c1c" }
    ],
    reviews: [
      { id: "rev-14-1", author: "Jonathan V.", rating: 5, date: "June 25, 2026", comment: "Stiffness-to-weight ratio is unreal. Going up climbs feels like cheating. The wireless shifting is instantaneous.", helpfulCount: 14 }
    ]
  },
  {
    id: "spor-2",
    name: "Terra Organic Leather Gym Duffle",
    description: "Refined travel and fitness companion. Hand-cut from heavy, vegetable-tanned full-grain leather that will develop a dark, rich patina. Features a dedicated ventilated shoe compartment and waterproof internal tech sleeves.",
    price: 320.00,
    rating: 4.8,
    reviewsCount: 57,
    category: "Sports",
    subcategory: "Bags",
    brand: "Terra",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    stock: 11,
    ecoFriendly: true,
    points: 160,
    isBestSeller: true,
    specs: [
      { label: "Leather", value: "4mm Tuscan Vegetable-Tanned Cowhide" },
      { label: "Zippers", value: "YKK Solid Brass Excella Zippers" },
      { label: "Lining", value: "Waterproof, Anti-Microbial Ripstop Nylon" },
      { label: "Size", value: "52cm L x 26cm W x 28cm H (38L Capacity)" }
    ],
    colors: [
      { name: "Tuscan Tan", hex: "#78350f" },
      { name: "Charcoal Black", hex: "#1f2937" }
    ],
    reviews: [
      { id: "rev-15-1", author: "Brian F.", rating: 5, date: "May 24, 2026", comment: "Absolutely massive. It easily fits my lifting belt, two pairs of shoes, and change of clothes. Thick leather is bulletproof.", helpfulCount: 19 }
    ]
  },
  {
    id: "spor-3",
    name: "Aether UV Smart Steel Bottle",
    description: "Pure hydration. The Aether Smart Bottle features an integrated medical-grade UVC LED cap that automatically purifies water and sanitizes the inner bottle walls. Double-wall copper vacuum insulation keeps liquids ice cold.",
    price: 85.00,
    rating: 4.6,
    reviewsCount: 112,
    category: "Sports",
    subcategory: "Accessories",
    brand: "Aether",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    stock: 35,
    ecoFriendly: true,
    points: 42,
    specs: [
      { label: "Purification", value: "275nm UVC LED (Kills 99.99% of Bio-Contaminants)" },
      { label: "Material", value: "Food-Grade 18/8 Stainless Steel (BPA-Free)" },
      { label: "Insulation", value: "24h Cold / 12h Hot (Copper Plated Vacuum)" },
      { label: "Battery", value: "Li-Poly USB Magnetic Recharge (1 Charge = 1 Month)" }
    ],
    colors: [
      { name: "Satin Slate", hex: "#4b5563" },
      { name: "Obsidian Black", hex: "#0f172a" },
      { name: "Alpine White", hex: "#f9fafb" }
    ],
    reviews: [
      { id: "rev-16-1", author: "Evelyn K.", rating: 4, date: "June 20, 2026", comment: "No more musty bottle smell! It actually works. The satin finish is very grippy and premium.", helpfulCount: 22 }
    ]
  },
  {
    id: "nike-airmax-270",
    name: "Air Max 270 React — Triple Black",
    description: "Elevated Air. Artistic React. Nike's first lifestyle Air Max meets its softest, smoothest and most resilient foam, Nike React. The design draws inspiration from radiating patterns of color and texture found in modern art movements like Bauhaus and Impressionism.",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.6,
    reviewsCount: 1284,
    category: "Sports",
    subcategory: "Shoes",
    brand: "Nike",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    stock: 24,
    ecoFriendly: true,
    points: 90,
    isBestSeller: true,
    discount: 30,
    specs: [
      { label: "Style", value: "Modern Lifestyle / Athletics" },
      { label: "Midsole", value: "Nike React Foam with 270-degree Air Max Unit" },
      { label: "Upper", value: "Lightweight woven fabric with no-sew overlays" },
      { label: "Outsole", value: "Solid rubber with deep flex grooves" },
      { label: "Weight", value: "310g (Size 9)" }
    ],
    colors: [
      { name: "Triple Black", hex: "#111111" },
      { name: "Summit White", hex: "#ffffff" },
      { name: "Royal Blue", hex: "#1d4ed8" },
      { name: "Cool Grey", hex: "#78716c" }
    ],
    sizes: ["6", "7", "8", "9", "10", "11", "12", "13"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80"
    ],
    qas: [
      { id: "qa-1", question: "Do these run true to size?", answer: "Yes, they fit perfectly true to size. If you have extremely wide feet, we recommend going up half a size.", date: "Jan 12, 2026", helpfulCount: 45 },
      { id: "qa-2", question: "Are these water-resistant?", answer: "The upper is made of breathable woven mesh and is not fully waterproof, but it holds up well in light drizzle.", date: "Feb 08, 2026", helpfulCount: 12 },
      { id: "qa-3", question: "What is the return policy?", answer: "We offer free 30-day returns for members. The shoes must be in their original packaging and unworn condition.", date: "Mar 19, 2026", helpfulCount: 8 }
    ],
    reviews: [
      { id: "rev-nike-1", author: "Julian S.", rating: 5, date: "June 14, 2026", comment: "The 270 Max Air unit is incredibly bouncy, and the React foam makes the forefoot feel smooth. Triple Black looks insanely sleek.", helpfulCount: 42 },
      { id: "rev-nike-2", author: "Sarah M.", rating: 4, date: "May 28, 2026", comment: "Super comfy and goes with literally any casual outfit. They do run slightly narrow so size up if needed.", helpfulCount: 19 },
      { id: "rev-nike-3", author: "Dave K.", rating: 5, date: "April 12, 2026", comment: "Love the Bauhaus inspiration details on the upper fabric panels. Feels like walking on clouds.", helpfulCount: 8 }
    ]
  },
  {
    id: "nike-airmax-pulse",
    name: "Air Max Pulse",
    description: "The Air Max Pulse pulls inspiration from the London music scene, bringing an underground touch to the iconic Air Max line. Its textile-wrapped midsole and point-loaded cushioning system delivers a bounce that pushes the limits.",
    price: 150.00,
    rating: 4.5,
    reviewsCount: 421,
    category: "Sports",
    subcategory: "Shoes",
    brand: "Nike",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    stock: 12,
    ecoFriendly: true,
    points: 150,
    specs: [
      { label: "Cushioning", value: "Point-loaded active Air system" },
      { label: "Materials", value: "Textile Upper with Leather Overlays" },
      { label: "Country of Origin", value: "Vietnam" }
    ],
    colors: [
      { name: "Volt White", hex: "#f0fdf4" },
      { name: "Laser Orange", hex: "#f97316" }
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
    reviews: [
      { id: "rev-pulse-1", author: "Liam T.", rating: 5, date: "June 02, 2026", comment: "Best sneaker design in years. It looks fantastic with jeans and is incredibly comfortable for walking all day.", helpfulCount: 11 }
    ]
  },
  {
    id: "nike-airforce-1",
    name: "Air Force 1 '07",
    description: "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
    price: 115.00,
    rating: 4.8,
    reviewsCount: 948,
    category: "Sports",
    subcategory: "Shoes",
    brand: "Nike",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    stock: 18,
    ecoFriendly: false,
    points: 115,
    specs: [
      { label: "Construction", value: "Stitched Leather Overlays" },
      { label: "Cushioning", value: "Nike Air Unit" },
      { label: "Collar", value: "Padded, Low-cut" }
    ],
    colors: [
      { name: "Triple White", hex: "#fdfdfd" },
      { name: "Triple Black", hex: "#1c1c1c" }
    ],
    sizes: ["6", "7", "8", "9", "10", "11", "12", "13"],
    reviews: [
      { id: "rev-af1-1", author: "Nate H.", rating: 5, date: "June 10, 2026", comment: "A timeless classic. I buy a new pair of triple whites every single summer. True to size.", helpfulCount: 25 }
    ]
  },
  {
    id: "nike-dunk-low",
    name: "Dunk Low Retro",
    description: "Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns with crisp overlays and original team colors. This basketball icon channels '80s vibes with premium leather and heritage styling.",
    price: 110.00,
    rating: 4.7,
    reviewsCount: 1105,
    category: "Sports",
    subcategory: "Shoes",
    brand: "Nike",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",
    stock: 8,
    ecoFriendly: false,
    points: 110,
    specs: [
      { label: "Design", value: "Retro '80s Basketball Silhouette" },
      { label: "Upper", value: "Premium Leather" },
      { label: "Outsole", value: "Rubber Traction Circle" }
    ],
    colors: [
      { name: "Panda Black & White", hex: "#2d2d2d" },
      { name: "UNC Blue", hex: "#60a5fa" }
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
    reviews: [
      { id: "rev-dunk-1", author: "Gregory B.", rating: 5, date: "May 15, 2026", comment: "Classic color block looks good with everything. Extremely wearable, comfortable flat soul.", helpfulCount: 31 }
    ]
  },
  {
    id: "nike-airmax-90",
    name: "Air Max 90 GORE-TEX",
    description: "Lace up and feel the legacy. This champion running shoe was built to cross intersections of art, music and culture. Styled with GORE-TEX weatherproofing, it stands ready to protect you from wet climates while retaining original retro look.",
    price: 160.00,
    rating: 4.7,
    reviewsCount: 234,
    category: "Sports",
    subcategory: "Shoes",
    brand: "Nike",
    image: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80",
    stock: 5,
    ecoFriendly: true,
    points: 160,
    specs: [
      { label: "Protection", value: "Waterproof GORE-TEX Membrane" },
      { label: "Midsole", value: "Max Air heel cushioning with foam" },
      { label: "Collar", value: "Low-cut padded" }
    ],
    colors: [
      { name: "Anthracite Grey", hex: "#334155" },
      { name: "Desert Cargo", hex: "#78350f" }
    ],
    sizes: ["8", "9", "10", "11", "12"],
    reviews: [
      { id: "rev-am90-1", author: "Robert M.", rating: 5, date: "May 29, 2026", comment: "Keeps my feet perfectly dry in rainy Seattle weather. Still has that classic Air Max 90 shape.", helpfulCount: 14 }
    ]
  }
];

export const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Sports"
];

export const BRANDS_BY_CATEGORY: Record<string, string[]> = {
  "Electronics": ["Aurum", "Solis", "Aether", "Lumina"],
  "Fashion": ["Vellum", "Solis", "Terra", "Aether", "Nike"],
  "Home": ["Lumina", "Solis", "Vellum", "Terra"],
  "Beauty": ["Aurum", "Aether", "Terra"],
  "Sports": ["Solis", "Terra", "Aether", "Nike"]
};

export const SUBCATEGORIES_BY_CATEGORY: Record<string, string[]> = {
  "Electronics": ["Headphones", "Audio", "Wearables", "Accessories"],
  "Fashion": ["Outerwear", "Shoes", "Bags", "Accessories"],
  "Home": ["Lighting", "Decor"],
  "Beauty": ["Skincare", "Fragrance"],
  "Sports": ["Equipment", "Bags", "Accessories", "Shoes"]
};
