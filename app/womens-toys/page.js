"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaYoutube, FaWhatsapp, FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";
import productsData from "../../public/products_classified.json";

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
      fill="currentColor"
    >
      UPI
    </text>
  </svg>
);

export default function WomensToys() {
  const allProducts = productsData.womens_toys.slice(0, 16);
  /* Sliced and commented out remaining products:
  const remainingProducts = [
    { sku: 1018, name: "Moksh Vibrating Masturbation Cup for Men", price: 4449 },
    { sku: 1030, name: "zamba male masturbator automatic cup squeeze voice vibration...", price: 3999 },
    { sku: 1032, name: "zamba electric Beat Stroker for men", price: 2999 },
    { sku: 1033, name: "Zamba Double Sided Vibrating Masturbator With Sound FM...", price: 6999 },
    { sku: 1034, name: "Male Small Penis Cage Adjustable Ring Lock...", price: 1999 },
    { sku: 1035, name: "Male Chastity Device Hypoallergenic Plastic Cock Cage...", price: 2999 },
    { sku: 1036, name: "Spiral Chastity Cage For Men", price: 3499 },
    { sku: 1037, name: "Short Male Chastity Device w/ 5 Different Cock Rings...", price: 2999 },
    { sku: 1045, name: "zamba 6.5 inch remote control vibrating suction dildo for women", price: 2999 },
    { sku: 1046, name: "8.75 inch dildo vibrating , realistic penis sex toys couple", price: 2199 },
    { sku: 1050, name: "zamba Sucking Vibrator Sex Toys for Women...", price: 4899 },
    { sku: 1053, name: "zamba yoni-pink women full body electric rechargeable massager", price: 2799 },
    { sku: 1056, name: "zamba rose toy vibrator for women...", price: 2999 },
    { sku: 1057, name: "zamba 10 speed G spot rabbit vibrating dildo for women", price: 2699 },
    { sku: 1058, name: "zamba 30 speed vibration dildo rabbit vibrator for women...", price: 3599 },
    { sku: 1059, name: "zamba G spot vibrator comfort remote massager device for women...", price: 3299 },
    { sku: 1062, name: "zamba Reality Dildo Pleasure Vibrator 10 Strong Vibrations...", price: 6499 },
    { sku: 1063, name: "zamba 10 speed premium USB charging grove sexy toy for women...", price: 2099 },
    { sku: 1064, name: "zamba female vagina toy sexual vibrators clitor suck...", price: 2999 },
    { sku: 1065, name: "Pair Nipple Sucker Nipple Sex Toys...", price: 999 },
    { sku: 1067, name: "zamba 10 Modes Vibration Silicone Wireless Bendable Vibrator...", price: 2999 },
    { sku: 1072, name: "zamba waterproof vibrator- 5 multiple vibration modes...", price: 1699 },
    { sku: 1078, name: "zamba Orgasm Finger Vibrator G-Spot Dildo...", price: 2999 },
    { sku: 1080, name: "zamba Cocking Vibrating ,Silicone Ring Sex Toy...", price: 3299 },
    { sku: 1085, name: "zamba Whale Massager | Remote Control Full Body...", price: 2799 },
    { sku: 1086, name: "zamba Vibrators for Men, Sex Toy for Men...", price: 5499 }
  ];
  */

  // --- STATE MANAGEMENT ---
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const cartLoadedRef = useRef(false);
  const [pulseCart, setPulseCart] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Filtering & Sorting State
  const [navSearchVal, setNavSearchVal] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("default");
  const [activeCat, setActiveCat] = useState(null);

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

    // Age Gate Verification Check
    if (typeof window !== "undefined" && !window.__zamba_age_verified) {
      setShowAgeGate(true);
    }

    // Scroll listener for sticky header styling
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Read URL Search Query Parameter
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("search");
      if (query) {
        setNavSearchVal(query);
      }
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
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

  // --- HANDLERS ---
  const enterSite = () => {
    localStorage.removeItem("zamba_age_verified");
    if (typeof window !== "undefined") {
      window.__zamba_age_verified = true;
    }
    setShowAgeGate(false);
  };

  const handleAddToCart = (name, price, image) => {
    setCart((prev) => [...prev, { name, price, emoji: image }]);
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

    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    const message = `Hello! 👋\n\nI would like to place an order with the following items:\n\n${cartSummary}\n\n💰 Total Price: ₹${totalPrice}\n\nPlease confirm availability and proceed with the order. Thank you! 🙏`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918866652629?text=${encodedMessage}`, "_blank");
  };

  // --- FILTER & SORT LOGIC ---
  const filteredProducts = allProducts
    .filter((p) => p.name.toLowerCase().includes(navSearchVal.toLowerCase()))
    .filter((p) => p.price <= maxPrice)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return 0; // Default
    });

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
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* AGE GATE */}
      {showAgeGate && (
        <div id="agegate">
          <div className="ag-box">
            <div className="ag-badge">18+</div>
            <h2 className="ag-title">Age Verification</h2>
            <p className="ag-sub">
              You must be 18 years or older to enter ZambaOnlineShop. Please verify your age to continue.
            </p>
            <div className="ag-btns">
              <button className="btn-enter" onClick={enterSite}>
                I am 18 or Older
              </button>
              <button className="btn-leave" onClick={() => (window.location.href = "https://www.google.com")}>
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDING CART SIDEBAR */}
      <div id="cartSidebar" className={isCartOpen ? "open" : ""}>
        <div className="cart-header">
          <h3>Shopping Cart</h3>
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
                  {item.emoji && item.emoji.startsWith("/") ? (
                    <img src={item.emoji} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                  ) : (
                    <span>{item.emoji || "🎁"}</span>
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

            {/* Suggestions Dropdown */}
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
              style={{ borderBottomColor: "var(--magenta)", color: "#fff" }}
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

      {/* HERO / BANNER SECTION */}
      <section className="hero" style={{ minHeight: "360px", background: "linear-gradient(135deg, #380D29 0%, #2E0A21 100%)" }}>
        <div className="hero-content" style={{ margin: "0 auto", textAlign: "center", zIndex: 10 }}>
          <span className="hero-tag">For Her</span>
          <h1 className="hero-title" style={{ fontSize: "44px" }}>Women's Pleasure Toys</h1>
          <p className="hero-sub" style={{ margin: "0 auto", fontSize: "16px" }}>
            Explore our curated catalog of high-quality, body-safe vibrators, dildos, clitoral suction toys, and personal wellness massagers. 100% discreetly packaged.
          </p>
        </div>
      </section>

      {/* FILTER & SORT PANEL */}
      <section style={{ padding: "30px 40px 10px", background: "var(--plum2)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px", maxWidth: "1440px", margin: "0 auto" }}>
          
          {/* Price Range Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--gray)", textTransform: "uppercase" }}>
              Max Price: <span style={{ color: "var(--magenta)", fontWeight: "700" }}>₹{maxPrice}</span>
            </span>
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{
                accentColor: "var(--magenta)",
                width: "220px",
                cursor: "pointer"
              }}
            />
          </div>

          {/* Sorting */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--gray)", textTransform: "uppercase" }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "50px",
                outline: "none",
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "var(--font-ui)"
              }}
            >
              <option value="default" style={{ background: "var(--plum)" }}>Default</option>
              <option value="price-low" style={{ background: "var(--plum)" }}>Price: Low to High</option>
              <option value="price-high" style={{ background: "var(--plum)" }}>Price: High to Low</option>
              <option value="rating" style={{ background: "var(--plum)" }}>Top Rated</option>
              <option value="reviews" style={{ background: "var(--plum)" }}>Most Reviewed</option>
            </select>
          </div>

          {/* Product Count */}
          <div style={{ fontSize: "14px", color: "var(--gray)", fontWeight: "500" }}>
            Showing <strong style={{ color: "#fff" }}>{filteredProducts.length}</strong> of {allProducts.length} products
          </div>
        </div>
      </section>

      {/* PRODUCTS DISPLAY SECTION */}
      <section className="products-section" style={{ background: "var(--plum)" }}>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <h3 style={{ fontSize: "22px", marginBottom: "8px" }}>No products found</h3>
            <p style={{ color: "var(--gray)" }}>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((p, i) => (
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
          </div>
        )}
      </section>

      {/* TRUST METRICS */}
      <section id="trust" style={{ background: "var(--dark-card)" }}>
        <div className="trust-grid">
          <div className="trust-feat">
            <div className="trust-feat-icon">📦</div>
            <h4>100% Discreet Packaging</h4>
            <p>Shipped in unmarked plain boxes with generic billing statement descriptors to protect your privacy.</p>
          </div>
          <div className="trust-feat">
            <div className="trust-feat-icon">🚚</div>
            <h4>Free & Express Shipping</h4>
            <p>Free pan-India delivery. Orders are dispatched within 24 hours with fully trackable shipment status.</p>
          </div>
          <div className="trust-feat">
            <div className="trust-feat-icon">🛡️</div>
            <h4>Body Safe Materials</h4>
            <p>All devices are manufactured using medical-grade silicone, ABS, or hypoallergenic body-safe materials.</p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq">
        <div className="section-header">
          <span className="section-eyebrow">Customer Support</span>
          <h2 className="section-title">Common Questions</h2>
        </div>
        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-q">Is shipping absolutely discreet?</div>
            <div className="faq-a" style={{ maxHeight: "300px" }}>
              <div className="faq-a-inner">
                Yes, absolutely. All orders are shipped in plain, unlabeled packaging. There is no mention of Zamba or adult goods on the outside box, and billing appears as a generic description.
              </div>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-q">What materials are the toys made from?</div>
            <div className="faq-a" style={{ maxHeight: "300px" }}>
              <div className="faq-a-inner">
                Our products are made from body-safe, premium-grade materials such as medical-grade silicone, TPE, ABS plastic, and borosilicate glass. They are completely safe and skin-friendly.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MASTER FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              Zamba<span>Online</span>Shop
            </div>
            <p className="footer-tagline">
              India's premium online store for adult wellness and pleasure. 100% private, secure, and authentic.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon" title="Instagram"><FaInstagram size={18} /></a>
              <a href="#" className="social-icon" title="Twitter"><FaTwitter size={18} /></a>
              <a href="#" className="social-icon" title="YouTube"><FaYoutube size={18} /></a>
              <a href="https://wa.me/918866652629" target="_blank" rel="noopener noreferrer" className="social-icon" title="WhatsApp"><FaWhatsapp size={18} /></a>
            </div>
            <div className="payment-icons">
              <span className="pay-icon" title="Visa"><FaCcVisa size={22} /></span>
              <span className="pay-icon" title="Mastercard"><FaCcMastercard size={22} /></span>
              <span className="pay-icon" title="Paypal"><FaPaypal size={22} /></span>
              <span className="pay-icon" title="UPI"><SiUpi size={22} /></span>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/mens-toys">Men's Collection</Link></li>
              <li><Link href="/womens-toys">Women's Collection</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Shop Intimate</h4>
            <ul>
              <li><a href="#">Rabbit Vibrators</a></li>
              <li><a href="#">Clitoral Sucking Rose</a></li>
              <li><a href="#">G-Spot Pleasure Dildos</a></li>
              <li><a href="#">Kegel Training Balls</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Discreet Help</h4>
            <ul>
              <li><a href="#">Privacy Pledge</a></li>
              <li><a href="#">Discreet Shipping Info</a></li>
              <li><a href="#">FAQ support</a></li>
              <li><a href="#">Contact Desk</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Secure Orders</h4>
            <span className="footer-mail" style={{ marginBottom: "6px", display: "block" }}>support@zambaonlineshop.com</span>
            <a href="https://wa.me/918866652629" target="_blank" rel="noopener noreferrer" style={{ display: "block", fontSize: "13px", color: "var(--gray)", marginBottom: "6px" }}>💬 WhatsApp: 8866652629</a>
            <a href="tel:96622320209" style={{ display: "block", fontSize: "13px", color: "var(--gray)", marginBottom: "12px" }}>📞 Call: 96622320209</a>
            <span className="age-notice">🔞 Adults Only 18+</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 ZambaOnlineShop. All rights reserved. 100% private billing guaranteed.</p>
        </div>
      </footer>
    </div>
  );
}
