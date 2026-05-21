"use client";

import { useState, useEffect, useRef } from "react";
import { FaInstagram, FaTwitter, FaYoutube, FaWhatsapp, FaFacebook, FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";
import Link from "next/link";
import productsData from "../public/products_classified.json";
// Custom UPI icon component replacing the missing icon from react-icons/si
const SiUpi = ({ size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
    <text
      x="12"
      y="13"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize="7.5"
      fontWeight="900"
      fontStyle="italic"
      fontFamily="system-ui, -apple-system, sans-serif"
      fill="currentColor"
    >
      UPI
    </text>
  </svg>
);

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("login");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const cartLoadedRef = useRef(false);
  const [pulseCart, setPulseCart] = useState(false);
  const [navSearchVal, setNavSearchVal] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCat, setActiveCat] = useState(null);

  // Counter States
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [ratingText, setRatingText] = useState("0");
  const [countersStarted, setCountersStarted] = useState(false);

  // Visual Reveal State
  const [visibleElements, setVisibleElements] = useState({});

  // --- REFS FOR OBSERVERS ---
  const trustBarRef = useRef(null);
  const revealRefs = useRef([]);

  // --- DATA STRUCTURES ---
  // Load first 7 mens and womens products from JSON file (correct image paths)
  const menProducts = productsData.mens_toys.slice(0, 7);
  
  const womenProducts = [
    {
      name: "zamba 7 inch remote control vibrating suction dildo for women",
      price: 3399,
      orig: 5999,
      off: 43,
      rating: 4.8,
      reviews: 234,
      image: "/AllinOne/Intimate toys sku id wise images/Sku 1042/1.jpg",
      emoji: "🐰",
      badge: "Best Seller"
    },
    {
      name: "zamba Sucking Rose G Spot Vibrator For Women",
      price: 4499,
      orig: 7999,
      off: 44,
      rating: 4.7,
      reviews: 189,
      image: "/AllinOne/Intimate toys sku id wise images/Sku 1051/1.jpg",
      emoji: "🌟",
      badge: null
    },
    {
      name: "zamba 10 speed G spot rabbit vibrating dildo",
      price: 2799,
      orig: 5999,
      off: 53,
      rating: 4.7,
      reviews: 189,
      image: "/AllinOne/Intimate toys sku id wise images/Sku 1052/1.jpg",
      emoji: "💨",
      badge: "Top Pick"
    },
    {
      name: "Vibrator Rabbit Vibrator G-Spot Vibrator Patting for Women 3 in 1 Clitoris Vibrator Powerful Vibrator Anal Plug Sex Toys Adults",
      price: 4499,
      orig: 6999,
      off: 36,
      rating: 4.7,
      reviews: 189,
      image: "/AllinOne/Intimate toys sku id wise images/Sku 1068/1.jpg",
      emoji: "🌸",
      badge: null
    },
    {
      name: "10 Modes Wireless Battery Operated Vibrating Egg remote Women Adult sex toy",
      price: 2999,
      orig: 4999,
      off: 40,
      rating: 4.7,
      reviews: 189,
      image: "/AllinOne/Intimate toys sku id wise images/Sku 1083/1.jpg",
      emoji: "⚪",
      badge: null
    },
    {
      name: "zamba Wireless premium vib massager with remote 10 vibration modes for women or girls",
      price: 3499,
      orig: 5999,
      off: 42,
      rating: 4.7,
      reviews: 189,
      image: "/AllinOne/Intimate toys sku id wise images/Sku 1084/1.jpg",
      emoji: "🔫",
      badge: null
    },
    {
      name: "zamba Luv Link Silicon Vibrator – App-Controlled Wearable Massager for women",
      price: 2499,
      orig: 4999,
      off: 50,
      rating: 4.9,
      reviews: 189,
      image: "/AllinOne/Intimate toys sku id wise images/Sku 1089/1.jpg",
      emoji: "🔥",
      badge: null
    }
  ];

  const brands = [
    "LELO", "Lovense", "We-Vibe", "Satisfyer", "Fun Factory", "Fifty Shades", "Tenga", "Fleshlight", "Durex", "Ann Summers",
    "Je Joue", "Womanizer", "Hot Octopuss", "Tantus", "NS Novelties", "Doc Johnson", "CalExotics", "Naughty Bits", "Pipedream", "System JO",
    "pjur", "Sliquid", "Wicked", "Astroglide", "Trojan", "Kiiroo", "OhMiBod", "Dame Products", "Chakrubs", "Unbound"
  ];
  const doubledBrands = [...brands, ...brands];

  const faqs = [
    { q: "Is my order packaging 100% discreet?", a: "Yes, absolutely. All orders are shipped in plain, unlabeled brown boxes. There is no mention of ZambaOnlineShop, no product names, no logos, and no indication of the contents on the outside. Your privacy is our highest priority." },
    { q: "How do I know the products are authentic?", a: "We source directly from authorized manufacturers and distributors. Every product on ZambaOnlineShop comes with an authenticity guarantee. We also display brand authorization certificates on product pages." },
    { q: "What payment methods are accepted?", a: "We accept UPI (PhonePe, GPay, BHIM), credit/debit cards (Visa, Mastercard, Amex), net banking, Paytm, Amazon Pay, and Cash on Delivery (COD) in select cities. All payments are SSL-encrypted." },
    { q: "Is the billing also discreet?", a: "Yes. Your bank/card statement will show a generic merchant name — not ZambaOnlineShop or any adult-related name. We understand discretion extends to billing." },
    { q: "What is the return & refund policy?", a: "You can return unused, unopened products within 7 days of delivery for a full refund. For hygiene reasons, opened products cannot be returned unless defective. Defective items are replaced or fully refunded." },
    { q: "How fast is delivery?", a: "We offer same-day dispatch for orders placed before 2 PM in select cities. Standard pan-India delivery takes 2-5 business days. You'll receive a real-time tracking link on your email and WhatsApp." },
    { q: "Do you deliver to all parts of India?", a: "Yes, we deliver to 25,000+ pin codes across India. Same-day delivery is available in major metros including Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, and Kolkata." },
    { q: "Is there an age verification process?", a: "Yes. ZambaOnlineShop is strictly for adults aged 18+. You must confirm your age upon entering the site. We reserve the right to verify age for any order and cancel orders from minors." },
    { q: "Are the products safe to use?", a: "All products on our platform are made from body-safe materials — medical-grade silicone, ABS plastic, glass, or stainless steel. We do not sell products with harmful materials like phthalates." },
    { q: "How do I track my order?", a: "Once your order is dispatched, you'll receive an email and WhatsApp message with a tracking link. You can also click 'Track My Order' in the footer or your account dashboard." },
    { q: "What if I receive a damaged or wrong product?", a: "Contact our support team within 48 hours of delivery with photos of the issue. We will arrange a replacement or full refund within 3-5 business days at no extra cost." },
    { q: "Do you offer product usage guidance?", a: "Yes! Each product page has a detailed usage guide. We also have a blog section with beginner guides, tips, and expert advice. Our support team is also happy to assist discreetly." },
  ];

  // --- EFFECTS ---
  useEffect(() => {
    // Load Cart from localStorage
    const storedCart = localStorage.getItem("zamba_cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse stored cart", e);
      }
    }
    cartLoadedRef.current = true;

    // Age Gate Verification Check — reset on reload, persist on client-side routing
    if (typeof window !== "undefined" && !window.__zamba_age_verified) {
      setShowAgeGate(true);
    }

    // Header Global Scroll Class Trigger
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Hero Auto-Rotator Slide Transition Cycle
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(slideInterval);
    };
  }, []);

  // Save Cart to localStorage when it changes
  useEffect(() => {
    if (cartLoadedRef.current) {
      localStorage.setItem("zamba_cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Click outside suggestions popup to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (!event.target.closest('.cat-item')) {
        setActiveCat(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Intersection Observers for Scroll Reveals and Counter Triggers
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-reveal-id");
          setVisibleElements((prev) => ({ ...prev, [id]: true }));
          if (entry.target.classList.contains("trust-bar")) {
            startCounters();
          }
        }
      });
    }, observerOptions);

    revealRefs.current.forEach((el) => {
      if (el) revealObserver.observe(el);
    });

    const trustObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startCounters();
        });
      },
      { threshold: 0.3 }
    );

    if (trustBarRef.current) trustObserver.observe(trustBarRef.current);

    return () => {
      revealObserver.disconnect();
      trustObserver.disconnect();
    };
  }, []);

  // --- HANDLERS & LOGIC FUNCTIONALITIES ---
  const enterSite = () => {
    localStorage.removeItem("zamba_age_verified");
    if (typeof window !== "undefined") {
      window.__zamba_age_verified = true;
    }
    setShowAgeGate(false);
  };

  const handleAddToCart = (name, price, emoji) => {
    setCart((prev) => [...prev, { name, price, emoji }]);
    setPulseCart(true);
    setTimeout(() => setPulseCart(false), 300);
  };

  const handleRemoveFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    const cartSummary = cart
      .map((item, i) => `${i + 1}. ${item.name}\n   Price: ₹${item.price}`)
      .join("\n\n");

    const totalPrice = cartTotal;
    const message = `Hello! 👋\n\nI would like to place an order with the following items:\n\n${cartSummary}\n\n💰 Total Price: ₹${totalPrice}\n\nPlease confirm availability and proceed with the order. Thank you! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/918866652629?text=${encodedMessage}`;

    window.open(whatsappLink, "_blank");
  };

  const copyCode = (code, e) => {
    navigator.clipboard.writeText(code).then(() => {
      const originalText = e.target.textContent;
      e.target.textContent = "Copied!";
      setTimeout(() => {
        e.target.textContent = originalText;
      }, 2000);
    }).catch(() => { });
  };

  const toggleFAQ = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const startCounters = () => {
    if (countersStarted) return;
    setCountersStarted(true);

    animateCounter(100000, setCount1, "+");
    animateCounter(1000, setCount2, "+");
    animateCounter(30, setCount3, "");
    setTimeout(() => {
      setRatingText("4.9 ⭐");
    }, 1000);
  };

  const animateCounter = (target, setScore, suffix) => {
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setScore(Math.floor(current).toLocaleString("en-IN") + suffix);
      if (current >= target) clearInterval(timer);
    }, 16);
  };

  // Compile flat list of all products for search suggestions
  const allWebsiteProducts = [
    ...(productsData.mens_toys || []),
    ...(productsData.womens_toys || []),
    ...(productsData.couple_toys || []),
    ...(productsData.vibrators || [])
  ];
  const uniqueWebsiteProducts = [];
  const skuSeen = new Set();
  for (const prod of allWebsiteProducts) {
    if (!skuSeen.has(prod.sku)) {
      skuSeen.add(prod.sku);
      uniqueWebsiteProducts.push(prod);
    }
  }
  const suggestedProducts = navSearchVal.trim()
    ? uniqueWebsiteProducts.filter((p) =>
        p.name.toLowerCase().includes(navSearchVal.toLowerCase())
      ).slice(0, 5)
    : [];

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      {/* AGE GATE */}
      {showAgeGate && (
        <div id="agegate">
          <div className="ag-box">
            <div className="ag-badge">18+</div>
            <h2 className="ag-title">Adults Only</h2>
            <p className="ag-sub">
              This website contains adult content intended for individuals 18 years of age or older. By entering, you confirm you are of legal age in your jurisdiction.
            </p>
            <div className="ag-btns">
              <button className="btn-enter" onClick={enterSite}>
                I am 18+ · Enter
              </button>
              <button className="btn-leave" onClick={() => (window.location.href = "https://google.com")}>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      <div id="loginModal" className={isLoginModalOpen ? "open" : ""} onClick={(e) => e.target.id === "loginModal" && setIsLoginModalOpen(false)}>
        <div className="modal-box">
          <button className="modal-close" onClick={() => setIsLoginModalOpen(false)}>
            ✕
          </button>
          <h2 className="modal-title">{activeModalTab === "login" ? "Welcome Back 👋" : "Join Zamba 🎉"}</h2>
          <p className="modal-sub">Shop discreetly. Delivered to your door.</p>
          <div className="modal-tabs">
            <button className={`modal-tab ${activeModalTab === "login" ? "active" : ""}`} onClick={() => setActiveModalTab("login")}>
              Login
            </button>
            <button className={`modal-tab ${activeModalTab === "signup" ? "active" : ""}`} onClick={() => setActiveModalTab("signup")}>
              Sign Up
            </button>
          </div>
          {activeModalTab === "login" ? (
            <div id="loginForm">
              <input className="modal-input" type="email" placeholder="Email address" />
              <input className="modal-input" type="password" placeholder="Password" />
              <button className="btn-modal-submit">Login Securely 🔐</button>
            </div>
          ) : (
            <div id="signupForm">
              <input className="modal-input" type="text" placeholder="Full name" />
              <input className="modal-input" type="email" placeholder="Email address" />
              <input className="modal-input" type="tel" placeholder="Mobile number" />
              <input className="modal-input" type="password" placeholder="Create password" />
              <button className="btn-modal-submit">Create Account →</button>
            </div>
          )}
        </div>
      </div>

      {/* CART SIDEBAR */}
      <div id="cartSidebar" className={isCartOpen ? "open" : ""}>
        <div className="cart-header">
          <h3>Your Cart 🛒</h3>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>
            ✕
          </button>
        </div>
        <div id="cartItems">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-icon">🌶️</div>
              <p>Your cart is empty</p>
              <p style={{ fontSize: "13px", marginTop: "8px", color: "var(--magenta)", fontWeight: "600" }}>
                Don't leave your fantasies on read! Add some spice to your night... 💋
              </p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div className="cart-item" key={index}>
                <div className="cart-item-img">
                  {item.emoji && (item.emoji.startsWith("/") || item.emoji.startsWith("http")) ? (
                    <img src={item.emoji} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
                  ) : (
                    item.emoji
                  )}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price}</div>
                </div>
                <span className="cart-item-remove" style={{ cursor: "pointer", fontSize: "16px" }} onClick={() => handleRemoveFromCart(index)}>
                  🗑️
                </span>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div id="cartTotalSection">
            <div style={{ padding: "10px 15px", background: "rgba(255, 20, 147, 0.1)", borderRadius: "8px", marginBottom: "15px", fontSize: "13px", color: "#ff85c0", textAlign: "center", border: "1px solid rgba(255, 20, 147, 0.2)" }}>
              🔥 <strong>Warning:</strong> High levels of pleasure ahead. Don't keep your desires waiting! 😉
            </div>
            <div className="cart-total">
              <div className="cart-total-row">
                <span>Total</span>
                <span id="cartTotalAmt">₹{cartTotal}</span>
              </div>
              <button className="btn-checkout" onClick={handleWhatsAppCheckout}>📱 Checkout on WhatsApp</button>
            </div>
          </div>
        )}
      </div>

      {/* NAVBAR */}
      <header className={`sticky-header ${isScrolled ? "scrolled" : ""}`}>
        <div id="navbar">
        <div className="nav-top">
          <Link href="/" className="nav-logo">
            <div className="logo-icon">💋</div>
            <div className="logo-text">
              Zamba<span>Online</span>Shop
            </div>
          </Link>
          <div className="nav-search" style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search for vibrators, dildos, sleeves..."
              value={navSearchVal}
              onChange={(e) => {
                setNavSearchVal(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <button className="search-btn">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            {showSuggestions && navSearchVal.trim() && (
              <div className="search-suggestions" ref={suggestionsRef}>
                {suggestedProducts.length === 0 ? (
                  <div className="no-suggestions">No products found matching "{navSearchVal}"</div>
                ) : (
                  suggestedProducts.map((p, i) => (
                    <div
                      className="suggestion-item"
                      key={i}
                      onClick={() => {
                        handleAddToCart(p.name, p.price, p.image || p.emoji);
                        setNavSearchVal("");
                        setShowSuggestions(false);
                      }}
                    >
                      <div className="suggestion-img">
                        {p.image ? (
                          <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                        ) : (
                          <span>{p.emoji}</span>
                        )}
                      </div>
                      <div className="suggestion-info">
                        <div className="suggestion-name">{p.name}</div>
                        <div className="suggestion-price">₹{p.price}</div>
                      </div>
                      <button
                        className="suggestion-add-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(p.name, p.price, p.image || p.emoji);
                          setNavSearchVal("");
                          setShowSuggestions(false);
                        }}
                      >
                        🛒 Add
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="nav-actions">
            <div className="nav-cart" onClick={() => setIsCartOpen(true)}>
              <svg viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="cart-text">Cart</span>
              <span className={`cart-badge ${pulseCart ? "" : "pulse-animation"}`} id="cartBadge">
                {cart.length}
              </span>
            </div>
            {/* LOGIN AND SIGNUP BUTTONS COMMENTED OUT */}
            {/* <button className="btn-login" onClick={() => { setIsLoginModalOpen(true); setActiveModalTab("login"); }}>
              Login
            </button>
            <button className="btn-signup" onClick={() => { setIsLoginModalOpen(true); setActiveModalTab("signup"); }}>
              Sign Up
            </button> */}
          </div>
        </div>

        {/* MEGA MENU */}
        <div className="nav-cats">
          {/* Men's */}
          <div className={`cat-item ${activeCat === 'mens' ? 'open' : ''}`}>
            <Link
              href="/mens-toys"
              onClick={(e) => {
                if (e.target.closest('svg') || e.target.tagName.toLowerCase() === 'svg' || e.target.tagName.toLowerCase() === 'polyline') {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveCat(activeCat === 'mens' ? null : 'mens');
                }
              }}
            >
              Men's Toys <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
            </Link>
            <div className="mega-drop">
              <div className="drop-title">Men's Pleasure</div>
              <a href="#">Masturbators</a><a href="#">Penis Sleeves</a><a href="#">Cock Rings</a>
              <a href="#">Penis Pumps</a><a href="#">Prostate Massagers</a><a href="#">Delay Sprays</a>
              <a href="#">Sex Dolls</a><a href="#">Male Vibrators</a>
            </div>
          </div>
          {/* Women's */}
          <div className={`cat-item ${activeCat === 'womens' ? 'open' : ''}`}>
            <Link
              href="/womens-toys"
              onClick={(e) => {
                if (e.target.closest('svg') || e.target.tagName.toLowerCase() === 'svg' || e.target.tagName.toLowerCase() === 'polyline') {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveCat(activeCat === 'womens' ? null : 'womens');
                }
              }}
            >
              Women's Toys <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
            </Link>
            <div className="mega-drop">
              <div className="drop-title">Women's Pleasure</div>
              <a href="#">Vibrators</a><a href="#">Dildos</a><a href="#">Rabbit Vibrators</a>
              <a href="#">G-Spot Vibrators</a><a href="#">Bullet Vibrators</a><a href="#">Wand Massagers</a>
              <a href="#">Suction Toys</a><a href="#">Kegel Balls</a>
            </div>
          </div>
          {/* Couples */}
          <div className={`cat-item ${activeCat === 'couples' ? 'open' : ''}`}>
            <Link
              href="/couple-toys"
              onClick={(e) => {
                if (e.target.closest('svg') || e.target.tagName.toLowerCase() === 'svg' || e.target.tagName.toLowerCase() === 'polyline') {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveCat(activeCat === 'couples' ? null : 'couples');
                }
              }}
            >
              Couple Toys <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
            </Link>
            <div className="mega-drop">
              <div className="drop-title">For Couples</div>
              <a href="#">Couple Vibrators</a><a href="#">Remote Control Toys</a><a href="#">Strap-On Sets</a>
              <a href="#">Couple Rings</a><a href="#">Love Eggs</a><a href="#">Massage Candles</a>
              <a href="#">Fantasy Kits</a>
            </div>
          </div>
          {/* Vibrators */}
          <div className={`cat-item ${activeCat === 'vibrators' ? 'open' : ''}`}>
            <Link
              href="/vibrators"
              onClick={(e) => {
                if (e.target.closest('svg') || e.target.tagName.toLowerCase() === 'svg' || e.target.tagName.toLowerCase() === 'polyline') {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveCat(activeCat === 'vibrators' ? null : 'vibrators');
                }
              }}
            >
              Vibrators <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
            </Link>
            <div className="mega-drop">
              <div className="drop-title">Vibrators</div>
              <a href="#">Clitoral</a><a href="#">G-Spot</a><a href="#">Wand</a>
              <a href="#">Rabbit</a><a href="#">Bullet</a><a href="#">Thrusting</a>
              <a href="#">Rechargeable</a><a href="#">Waterproof</a>
            </div>
          </div>
        </div>
      </div>
      </header>

      {/* MARQUEE */}
      <div className="marquee-bar">
        <div className="marquee-inner" id="marqueeInner">
          <span>SALE IS LIVE — Use code ZAMBA20 for 20% OFF</span>
          <span>Free Shipping above ₹999</span>
          <span>100% Discreet Packaging — No one will know</span>
          <span>30 International Brands · 1000+ Products</span>
          <span>Same Day Dispatch in Select Cities</span>
          <span>100% Authentic Products · Certified</span>
          <span>Easy Returns within 7 Days</span>
          <span>24/7 Customer Support</span>
          <span>SALE IS LIVE — Use code ZAMBA20 for 20% OFF</span>
          <span>Free Shipping above ₹999</span>
          <span>100% Discreet Packaging — No one will know</span>
          <span>30 International Brands · 1000+ Products</span>
          <span>Same Day Dispatch in Select Cities</span>
          <span>100% Authentic Products · Certified</span>
          <span>Easy Returns within 7 Days</span>
          <span>24/7 Customer Support</span>
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <div className="hero-bg">
          {/* Fading slide color overlays commented out to keep the background image clean at best quality
          <div className={`hero-slide ${currentSlide === 0 ? "active" : ""}`} id="slide0">
            <div className="hero-slide-bg" style={{ background: "linear-gradient(135deg, rgba(61, 11, 107, 0.4) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(74, 14, 46, 0.4) 100%)" }}></div>
            <div className="hero-overlay"></div>
          </div>
          <div className={`hero-slide ${currentSlide === 1 ? "active" : ""}`} id="slide1">
            <div className="hero-slide-bg" style={{ background: "linear-gradient(135deg, rgba(13, 27, 75, 0.4) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(61, 11, 107, 0.4) 100%)" }}></div>
            <div className="hero-overlay"></div>
          </div>
          <div className={`hero-slide ${currentSlide === 2 ? "active" : ""}`} id="slide2">
            <div className="hero-slide-bg" style={{ background: "linear-gradient(135deg, rgba(74, 18, 40, 0.4) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(61, 11, 107, 0.4) 100%)" }}></div>
            <div className="hero-overlay"></div>
          </div>
          */}
        </div>
        {/* Text, buttons, and badges commented out for now as requested
        <div className="hero-content">
          <div className="hero-tag">🔥 Biggest Sale of the Year · Up to 60% Off</div>
          <h1 className="hero-title">
            India's Most <em>Trusted</em>
            <br />
            Adult Pleasure Store
          </h1>
          <p className="hero-sub">
            Premium adult products — 100% authentic, discreetly packaged, delivered to your door. Explore 1000+ products from 30+ international brands.
          </p>
          <div className="hero-btns">
            <Link href="/mens-toys" className="btn-primary">
              Find Your Pleasure →
            </Link>
          </div>
        </div>

        <div className="hero-badges">

          <div className="hero-img-card card-1">
            <div className="hero-img-wrapper">
              <img
                src="/69-deal-days-pinkshop.jpg"
                alt="69 Deal Days"
                className="hero-banner-img"
              />
              <div className="hero-img-overlay" />
              <div className="hero-img-text">
                <span className="hero-img-tag">✦ Hot Deal</span>
                <p className="hero-img-tagline">
                  Unbeatable offers<br />
                  <span>on top sellers.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="hero-img-card card-2">
            <div className="hero-img-wrapper">
              <img
                src="/Erogenous_zones_e3cf9775-af85-4903-91e2-84b2215893d1.webp"
                alt="Erogenous Zones"
                className="hero-banner-img"
              />
              <div className="hero-img-overlay" />
              <div className="hero-img-text">
                <span className="hero-img-tag">✦ Exploration</span>
                <p className="hero-img-tagline">
                  Discover your body's<br />
                  <span>hidden maps.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="hero-img-card card-3">
            <div className="hero-img-wrapper">
              <img
                src="/Masturbation_in_relationship.webp"
                alt="Feel the Real Pleasure"
                className="hero-banner-img"
              />
              <div className="hero-img-overlay" />
              <div className="hero-img-text">
                <span className="hero-img-tag">✦ Self-Love</span>
                <p className="hero-img-tagline">
                  Feel the <em>real</em> pleasure<br />
                  <span>inside it.</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="hero-dots">
          <div className={`hero-dot ${currentSlide === 0 ? "active" : ""}`} onClick={() => setCurrentSlide(0)}></div>
          <div className={`hero-dot ${currentSlide === 1 ? "active" : ""}`} onClick={() => setCurrentSlide(1)}></div>
          <div className={`hero-dot ${currentSlide === 2 ? "active" : ""}`} onClick={() => setCurrentSlide(2)}></div>
        </div>
        */}
      </div>

      {/* COUPONS */}
      <div className="coupon-strip">
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "var(--magenta)", paddingRight: "12px", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
          🏷️ Coupons
        </div>
        {["ZAMBA20", "FIRST15", "FREESHIP", "COUPLE30", "BDSM25"].map((code, i) => {
          const descriptions = [
            "20% off on all orders",
            "15% off · First order",
            "Free shipping · All orders",
            "30% off couple toys",
            "25% off bondage range",
          ];
          return (
            <div className="coupon-card" key={code}>
              <div>
                <div className="coupon-code">{code}</div>
                <div className="coupon-desc">{descriptions[i]}</div>
              </div>
              <button className="coupon-btn" onClick={(e) => copyCode(code, e)}>
                Copy
              </button>
            </div>
          );
        })}
      </div>

      {/* TRUST BAR */}
      <div className="trust-bar" ref={trustBarRef}>
        <div className="trust-item">
          <span className="trust-icon">👥</span>
          <div className="trust-text">
            <strong>{count1 || "0+"}</strong>
            <span>Trusted Customers</span>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">📦</span>
          <div className="trust-text">
            <strong>{count2 || "0+"}</strong>
            <span>Premium Products</span>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🌍</span>
          <div className="trust-text">
            <strong>{count3 || "0"}</strong>
            <span>International Brands</span>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">⭐</span>
          <div className="trust-text">
            <strong>{countersStarted ? ratingText : "0"}</strong>
            <span>Average Rating</span>
          </div>
        </div>
      </div>

      {/* CATEGORY ICONS */}
      <section id="categories">
        <div className={`section-header reveal ${visibleElements["categories-header"] ? "visible" : ""}`} data-reveal-id="categories-header" ref={(el) => (revealRefs.current[0] = el)}>
          <span className="section-eyebrow">Explore</span>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-sub">Find exactly what you're looking for</p>
        </div>
        <div className={`cat-icons-grid reveal ${visibleElements["categories-grid"] ? "visible" : ""}`} data-reveal-id="categories-grid" ref={(el) => (revealRefs.current[1] = el)}>
          {[
            { label: "Masturbator", icon: "/masturbators.png", path: "/mens-toys?search=masturbator" },
            { label: "Sex Doll", icon: "/sex-dolls.png", path: "/mens-toys?search=doll" },
            { label: "Vibrator", icon: "/vibrators.png", path: "/womens-toys?search=vibrator" },
            { label: "Dildo", icon: "/dildos.png", path: "/womens-toys?search=dildo" },
            { label: "Penis Sleeve", icon: "/penis-sleeves.png", path: "/mens-toys?search=sleeve" },
            { label: "Cock Ring", icon: "/cock-ring.png", path: "/mens-toys?search=ring" },
            { label: "Anal Toy", icon: "/anal-toys.png", path: "/womens-toys?search=anal" },
            { label: "Butt Plug", icon: "/butt-plugs.png", path: "/womens-toys?search=plug" },
            { label: "BDSM", icon: "/bondage.png", path: "/couple-toys?search=bondage" },
            { label: "Lubricant", icon: "/lubes-lotions.png", path: "/couple-toys?search=lube" },
          ].map((cat, idx) => (
            <Link href={cat.path} className="cat-icon-item" key={idx}>
              <div className="cat-icon-circle">
                <img src={cat.icon} alt={cat.label} style={{ width: "40px", height: "40px", objectFit: "contain", zIndex: 1 }} />
              </div>
              <span className="cat-icon-label">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* MEN'S PRODUCTS */}
      <section className="products-section" id="men-products">
        <div className={`section-header reveal ${visibleElements["men-header"] ? "visible" : ""}`} data-reveal-id="men-header" ref={(el) => (revealRefs.current[2] = el)}>
          <span className="section-eyebrow">For Him</span>
          <h2 className="section-title">Top Men's Products</h2>
          <p className="section-sub">Best selling pleasure products for men</p>
        </div>
        <div className={`products-grid reveal ${visibleElements["men-grid"] ? "visible" : ""}`} data-reveal-id="men-grid" ref={(el) => (revealRefs.current[3] = el)}>
          {menProducts.map((p, i) => (
            <div className="prod-card" key={i}>
              <div className="prod-img">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="prod-card-img" />
                ) : (
                  <span className="prod-emoji">{p.emoji}</span>
                )}
                <span className="prod-badge-off">-{p.off}%</span>
                {p.badge ? <span className="prod-badge-best">{p.badge}</span> : <span className="prod-wish">♡</span>}
              </div>
              <div className="prod-info">
                <div className="prod-stars">
                  <span>
                    {"★".repeat(Math.floor(p.rating))}
                    {"☆".repeat(5 - Math.floor(p.rating))}
                  </span>
                  <em>
                    {p.rating} ({p.reviews})
                  </em>
                </div>
                <div className="prod-name">{p.name}</div>
                <div className="prod-prices">
                  <span className="prod-price">₹{p.price}</span>
                  <span className="prod-orig">₹{p.orig}</span>
                </div>
                <button className="btn-cart" onClick={() => handleAddToCart(p.name, p.price, p.image || p.emoji)}>
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
          <Link href="/mens-toys" className="see-more-card">
            <span className="arrow">→</span>
            <p>See All Men's Products</p>
          </Link>
        </div>
      </section>

      {/* WOMEN'S PRODUCTS */}
      <section className="products-section women" id="women-products">
        <div className={`section-header reveal ${visibleElements["women-header"] ? "visible" : ""}`} data-reveal-id="women-header" ref={(el) => (revealRefs.current[4] = el)}>
          <span className="section-eyebrow">For Her</span>
          <h2 className="section-title">Top Women's Products</h2>
          <p className="section-sub">Curated pleasure products for women</p>
        </div>
        <div className={`products-grid reveal ${visibleElements["women-grid"] ? "visible" : ""}`} data-reveal-id="women-grid" ref={(el) => (revealRefs.current[5] = el)}>
          {womenProducts.map((p, i) => (
            <div className="prod-card" key={i}>
              <div className="prod-img">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="prod-card-img" />
                ) : (
                  <span className="prod-emoji">{p.emoji}</span>
                )}
                <span className="prod-badge-off">-{p.off}%</span>
                {p.badge ? <span className="prod-badge-best">{p.badge}</span> : <span className="prod-wish">♡</span>}
              </div>
              <div className="prod-info">
                <div className="prod-stars">
                  <span>
                    {"★".repeat(Math.floor(p.rating))}
                    {"☆".repeat(5 - Math.floor(p.rating))}
                  </span>
                  <em>
                    {p.rating} ({p.reviews})
                  </em>
                </div>
                <div className="prod-name">{p.name}</div>
                <div className="prod-prices">
                  <span className="prod-price">₹{p.price}</span>
                  <span className="prod-orig">₹{p.orig}</span>
                </div>
                <button className="btn-cart" onClick={() => handleAddToCart(p.name, p.price, p.image || p.emoji)}>
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
          <Link href="/womens-toys" className="see-more-card">
            <span className="arrow">→</span>
            <p>See All Women's Products</p>
          </Link>
        </div>
      </section>

      {/* BRANDS & BUZZ */}
      <section id="brands">
        <div className={`section-header reveal ${visibleElements["brands-header"] ? "visible" : ""}`} data-reveal-id="brands-header" ref={(el) => (revealRefs.current[6] = el)}>
          <span className="section-eyebrow">Our Partners</span>
          <h2 className="section-title">Brands We Carry</h2>
          <p className="section-sub">30+ international brands — all 100% authentic</p>
        </div>
        <div className={`brands-track reveal ${visibleElements["brands-track"] ? "visible" : ""}`} data-reveal-id="brands-track" ref={(el) => (revealRefs.current[7] = el)}>
          <div className="brands-inner" id="brandsInner">
            {doubledBrands.map((b, i) => (
              <div className="brand-logo" key={i}>
                {b}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "20px", fontSize: "13px", fontWeight: "600", textAlign: "center", color: "var(--magenta)", marginBottom: "16px" }}>
          💬 What people are saying
        </div>
        <div className={`buzz-grid reveal ${visibleElements["buzz-grid"] ? "visible" : ""}`} data-reveal-id="buzz-grid" ref={(el) => (revealRefs.current[8] = el)}>
          {[
            { name: "Priya M.", initial: "P", tag: "✅ Verified Buyer · Mumbai", quote: '"Absolutely love ZambaOnlineShop! Packaging was so discreet, delivery was in 2 days. Product quality is amazing — exactly what was shown."' },
            { name: "Rohan K.", initial: "R", tag: "✅ Verified Buyer · Delhi", quote: '"Finally a trustworthy platform in India for adult products. Ordered 3 times already. 100% authentic products, great prices, and super helpful support."' },
            { name: "Anjali & Dev", initial: "A", tag: "✅ Verified Buyers · Bangalore", quote: '"The couple\'s vibrator we bought completely changed our relationship. Discreet packaging made it comfortable. Will definitely order again from Zamba!"' },
            { name: "Neha S.", initial: "N", tag: "✅ Verified Buyer · Pune", quote: '"5-star experience! The product arrived within 24 hours in discreet packaging. The quality is exceptional and the price is very competitive. Highly recommend!"' },
            { name: "Aditya M.", initial: "A", tag: "✅ Verified Buyer · Chennai", quote: '"Best online shopping experience. The website is user-friendly, checkout was smooth, and the product came exactly as described. Customer service is top-notch!"' },
            { name: "Simran & Vikram", initial: "S", tag: "✅ Verified Buyers · Hyderabad", quote: '"We were hesitant at first but ZambaOnlineShop made everything so easy and discreet. Amazing variety of products and fantastic deals. Definitely ordering again!"' },
          ].map((buzz, i) => (
            <div className="buzz-card" key={i}>
              <div className="buzz-stars">★★★★★</div>
              <p className="buzz-quote">{buzz.quote}</p>
              <div className="buzz-author">
                <div className="buzz-avatar">{buzz.initial}</div>
                <div>
                  <div className="buzz-name">{buzz.name}</div>
                  <div className="buzz-tag">{buzz.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTRO */}
      <section id="intro" className="intro-centered-section">

        {/* Animated background orbs */}
        <div className="intro-orb intro-orb-1" />
        <div className="intro-orb intro-orb-2" />
        <div className="intro-orb intro-orb-3" />

        <div className={`intro-center-content reveal ${visibleElements["intro-grid"] ? "visible" : ""}`} data-reveal-id="intro-grid" ref={(el) => (revealRefs.current[9] = el)}>

          <div className="intro-eyebrow-wrap">
            <span className="intro-pulse-dot" />
            <div className="intro-eyebrow">About ZambaOnlineShop</div>
          </div>

          <h2 className="intro-title intro-title-center">
            India's Most <span className="intro-shimmer-word">Trusted</span><br />
            Adult <span className="intro-glow-word">Pleasure</span> Store
          </h2>

          <p className="intro-body intro-body-center">
            We believe pleasure is a fundamental part of well-being. ZambaOnlineShop was founded to give India a <em>safe, discreet,</em> and <em>authentic</em> place to explore adult products — without judgment, without compromise.
          </p>

          {/* Animated scrolling pills */}
          <div className="intro-ticker-wrap">
            <div className="intro-ticker">
              {["💋 100% Discreet", "🔥 Authentic Only", "⚡ Same Day Dispatch", "🔒 Secure Payments", "🌙 Easy Returns", "✨ Premium Brands", "💋 100% Discreet", "🔥 Authentic Only", "⚡ Same Day Dispatch", "🔒 Secure Payments", "🌙 Easy Returns", "✨ Premium Brands"].map((t, i) => (
                <span key={i} className="intro-ticker-item">{t}</span>
              ))}
            </div>
          </div>

          {/* Spicy animated taglines */}
          <div className="intro-spicy-lines">
            <p className="spicy-line line-a">Your desires, delivered discreetly.</p>
            <p className="spicy-line line-b">Explore. Discover. Ignite.</p>
            <p className="spicy-line line-c">Real pleasure. Zero shame.</p>
          </div>

          <div className="hero-btns intro-center-btns">
            <a href="/mens-toys" className="btn-primary">
              Find Your Pleasure →
            </a>
            <a href="#trust" className="btn-outline">
              Why Choose Us
            </a>
          </div>

        </div>
      </section>

      {/* TRUST FEATURES */}
      <section id="trust">
        <div className={`section-header reveal ${visibleElements["trust-header"] ? "visible" : ""}`} data-reveal-id="trust-header" ref={(el) => (revealRefs.current[10] = el)}>
          <span className="section-eyebrow">Why Choose Us</span>
          <h2 className="section-title">Shop with Confidence</h2>
        </div>
        <div className={`trust-grid reveal ${visibleElements["trust-grid"] ? "visible" : ""}`} data-reveal-id="trust-grid" ref={(el) => (revealRefs.current[11] = el)}>

          {/* Discreet packaging */}
          <div className="trust-feat">
            <div className="trust-feat-icon">
              <svg viewBox="0 0 24 24"><path d="M20 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M12 12v4m-2-2h4"/></svg>
            </div>
            <h4>100% Discreet Packaging</h4>
            <p>All orders ship in plain, unlabeled boxes. No product names or logos on the outside. Your privacy is our promise.</p>
          </div>

          {/* Verified authentic */}
          <div className="trust-feat">
            <div className="trust-feat-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
            </div>
            <h4>Authentic Products Only</h4>
            <p>We source directly from manufacturers and authorized distributors. Every product comes with an authenticity guarantee.</p>
          </div>

          {/* Secure payments */}
          <div className="trust-feat">
            <div className="trust-feat-icon">
              <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            </div>
            <h4>100% Secure Payments</h4>
            <p>SSL-encrypted checkout. Pay via UPI, cards, wallets, net banking, or cash on delivery. Your financial data is never stored.</p>
          </div>

          {/* Easy returns */}
          <div className="trust-feat">
            <div className="trust-feat-icon">
              <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
            </div>
            <h4>Easy 7-Day Returns</h4>
            <p>Not satisfied? Return unused products in original packaging within 7 days. No questions asked, full refund.</p>
          </div>

          {/* 24/7 support — heart pulse */}
          <div className="trust-feat">
            <div className="trust-feat-icon">
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <h4>24/7 Expert Support</h4>
            <p>Our discreet support team is available round the clock via chat, WhatsApp, or email. Real humans, always.</p>
          </div>

          {/* Fast delivery — lightning */}
          <div className="trust-feat">
            <div className="trust-feat-icon">
              <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <h4>Fast & Reliable Delivery</h4>
            <p>Same-day dispatch in 15+ cities. Pan-India delivery within 2–5 days. Real-time tracking on every order.</p>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className={`section-header reveal ${visibleElements["faq-header"] ? "visible" : ""}`} data-reveal-id="faq-header" ref={(el) => (revealRefs.current[12] = el)}>
          <span className="section-eyebrow">Got Questions?</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>
        <div className={`faq-list reveal ${visibleElements["faq-list"] ? "visible" : ""}`} data-reveal-id="faq-list" ref={(el) => (revealRefs.current[13] = el)}>
          {faqs.map((f, i) => (
            <div className={`faq-item ${openFaqIndex === i ? "open" : ""}`} id={`faq${i}`} key={i}>
              <div className="faq-q" onClick={() => toggleFAQ(i)}>
                {f.q}
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-a" style={{ maxHeight: openFaqIndex === i ? "200px" : "0px" }}>
                <div className="faq-a-inner">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className={`footer-grid reveal ${visibleElements["footer-grid"] ? "visible" : ""}`} data-reveal-id="footer-grid" ref={(el) => (revealRefs.current[14] = el)}>
          <div className="footer-col">
            <div className="footer-logo">
              Zamba<span>Online</span>Shop
            </div>
            <p className="footer-tagline">India's most trusted adult pleasure store. Discreet. Authentic. Premium. Your pleasure, our priority.</p>
            <div className="social-icons">
              <a href="https://www.instagram.com/zambaonlinesell?igsh=bXE2c3lmMzBnbnZ1" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram"><FaInstagram size={18} /></a>
              <a href="https://www.facebook.com/share/1L7iCiPUfy/" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook"><FaFacebook size={18} /></a>
              <a href="https://youtube.com/@zambaonlinestore?si=fnDtdVa5eRhWEfYw" target="_blank" rel="noopener noreferrer" className="social-icon" title="YouTube"><FaYoutube size={18} /></a>
              <a href="https://wa.me/949427271290" target="_blank" rel="noopener noreferrer" className="social-icon" title="WhatsApp"><FaWhatsapp size={18} /></a>
            </div>
            <div className="payment-icons">
              <span className="pay-icon" title="Visa"><FaCcVisa size={20} /></span>
              <span className="pay-icon" title="Mastercard"><FaCcMastercard size={20} /></span>
              <span className="pay-icon" title="UPI"><SiUpi size={20} /></span>
              <span className="pay-icon" title="PayPal"><FaPaypal size={20} /></span>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">All Products</a></li>
              <li><a href="#">Today's Deals</a></li>
              <li><a href="#">New Arrivals</a></li>
              <li><a href="#">Best Sellers</a></li>
              <li><a href="#">Track My Order</a></li>
              <li><a href="#">Blog & Guides</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Policies</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Return Policy</a></li>
              <li><a href="#">Age Verification Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Refund Policy</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>We Deliver To</h4>
            <ul>
              <li><a href="#">Mumbai</a></li>
              <li><a href="#">Delhi NCR</a></li>
              <li><a href="#">Bangalore</a></li>
              <li><a href="#">Hyderabad</a></li>
              <li><a href="#">Chennai</a></li>
              <li><a href="#">Pune</a></li>
              <li><a href="#">Kolkata</a></li>
              <li><a href="#">Ahmedabad</a></li>
              <li><a href="#">Jaipur</a></li>
              <li><a href="#">Lucknow</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <a href="mailto:zambaonlineshop@gmail.com" className="footer-mail">
                  📧 E-mail: zambaonlineshop@gmail.com
                </a>
              </li>
              <li><a href="https://wa.me/949427271290" target="_blank" rel="noopener noreferrer">💬 WhatsApp: 94267 27129</a></li>
              <li><a href="#" style={{ fontSize: "13px" }}>🎥 YouTube: @zambaOnlinestore</a></li>
              <li style={{ marginTop: "12px" }}>
                <a href="#" style={{ background: "var(--magenta)", color: "#fff", padding: "8px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                  📦 Track Your Order
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 ZambaOnlineShop. All rights reserved.</p>
          <span className="age-notice">🔞 18+ Only · Adults Only Platform</span>
          <p style={{ fontSize: "11px" }}>Made with ❤️ in India · 100% Discreet</p>
        </div>
      </footer>
    </>
  );
}