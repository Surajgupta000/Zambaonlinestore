"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaYoutube, FaWhatsapp, FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";
import productsData from "../../../public/products_db.json";

// Custom UPI icon component
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

export default function ProductDetailPage({ params }) {
  // Resolve params promise for Next.js 15+ compatibility
  const resolvedParams = use(params);
  const sku = resolvedParams.sku;

  // Retrieve product from consolidated database
  const product = productsData[sku];

  // --- STATE MANAGEMENT ---
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const cartLoadedRef = useRef(false);
  const [pulseCart, setPulseCart] = useState(false);
  
  // Header search state
  const [navSearchVal, setNavSearchVal] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const [activeCat, setActiveCat] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Gallery state
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedCoupon, setCopiedCoupon] = useState(null);

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

  // Reset active image index when SKU changes
  useEffect(() => {
    setActiveImgIndex(0);
    setQuantity(1);
  }, [sku]);

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--plum)" }}>
        <h2 style={{ fontSize: "28px", color: "#fff", marginBottom: "16px" }}>Product Not Found</h2>
        <p style={{ color: "var(--gray)", marginBottom: "24px" }}>We couldn't find the product with SKU: {sku}</p>
        <Link href="/" className="btn-primary">Back to Homepage</Link>
      </div>
    );
  }

  // --- HANDLERS ---
  const enterSite = () => {
    localStorage.removeItem("zamba_age_verified");
    if (typeof window !== "undefined") {
      window.__zamba_age_verified = true;
    }
    setShowAgeGate(false);
  };

  const handleAddToCart = (name, price, image) => {
    // Add multiple items if quantity > 1
    const newItems = Array.from({ length: quantity }).map(() => ({
      name,
      price,
      emoji: image
    }));
    setCart((prev) => [...prev, ...newItems]);
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

  const handleBuyNowWhatsApp = () => {
    const message = `Hello! 👋\n\nI would like to buy this product:\n\n🛒 *${product.name}*\n🔢 SKU: ${product.sku}\n💰 Price: ₹${product.price}\n📦 Quantity: ${quantity}\n\nPlease confirm availability and proceed with the order. Thank you! 🙏`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918866652629?text=${encodedMessage}`, "_blank");
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCoupon(code);
      setTimeout(() => setCopiedCoupon(null), 2000);
    });
  };

  // Compile flat list of all products for search suggestions
  const allProductsList = Object.values(productsData);
  const suggestedProducts = navSearchVal.trim()
    ? allProductsList.filter((p) =>
        p.name.toLowerCase().includes(navSearchVal.toLowerCase())
      ).slice(0, 5)
    : [];

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Format Category Label
  const categoryLabelMap = {
    mens_toys: "Men's Toys",
    womens_toys: "Women's Toys",
    couple_toys: "Couple Toys",
    vibrators: "Vibrators"
  };
  const categoryLabel = categoryLabelMap[product.category] || "Intimate Wellness";
  const categoryPath = `/${product.category.replace('_', '-')}`;

  // Get Related Products (4 products from same category, excluding current product)
  const relatedProducts = allProductsList
    .filter((p) => p.category === product.category && p.sku !== product.sku)
    .slice(0, 4);

  // Product images mapping
  // Fallback to product.emoji or placeholder if no images
  const productImages = product.images && product.images.length > 0
    ? product.images
    : [product.image || "/file.svg"];

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
                          handleAddToCart(p.name, p.price, p.images[0] || p.emoji);
                          setNavSearchVal("");
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="suggestion-img">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
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
                            handleAddToCart(p.name, p.price, p.images[0] || p.emoji);
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
          <div className="cat-item">
            <Link href="/mens-toys">
              Men's Toys
            </Link>
          </div>
          {/* Women's */}
          <div className="cat-item">
            <Link href="/womens-toys">
              Women's Toys
            </Link>
          </div>
          {/* Couples */}
          <div className="cat-item">
            <Link href="/couple-toys">
              Couple Toys
            </Link>
          </div>
          {/* Vibrators */}
          <div className="cat-item">
            <Link href="/vibrators">
              Vibrators
            </Link>
          </div>
        </div>
        </div>
      </header>

      {/* PRODUCT BREADCRUMB */}
      {/* PRODUCT BREADCRUMB */}
      <nav className="product-page-breadcrumb">
        <Link href="/" style={{ color: "#fff", transition: "0.2s" }} onMouseOver={(e) => e.target.style.color = "var(--magenta)"} onMouseOut={(e) => e.target.style.color = "#fff"}>Home</Link>
        <span>/</span>
        <Link href={categoryPath} style={{ color: "#fff", transition: "0.2s" }} onMouseOver={(e) => e.target.style.color = "var(--magenta)"} onMouseOut={(e) => e.target.style.color = "#fff"}>{categoryLabel}</Link>
        <span>/</span>
        <span style={{ color: "var(--magenta)", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</span>
      </nav>

      {/* MAIN PRODUCT DETAIL GRID */}
      <main className="product-page-container">
        <div className="product-grid">
          
          {/* LEFT COLUMN: IMAGES GALLERY */}
          <div className="product-gallery">
            {/* Big active image display */}
            <div className="product-main-img-box">
              {productImages[activeImgIndex] && productImages[activeImgIndex].startsWith("/") ? (
                <img 
                  src={productImages[activeImgIndex]} 
                  alt={product.name} 
                  className="zoom-image"
                />
              ) : (
                <span className="product-emoji-fallback">{product.emoji}</span>
              )}

              {/* Discount Tag Overlay */}
              <span style={{ position: "absolute", top: "20px", left: "20px", background: "var(--coral)", color: "#fff", fontSize: "12px", fontWeight: "700", padding: "6px 14px", borderRadius: "50px", textTransform: "uppercase" }}>
                Save {product.off}%
              </span>

              {/* Premium Badge Overlay if exists */}
              {product.badge && (
                <span style={{ position: "absolute", top: "20px", right: "20px", background: "var(--gold)", color: "#1A0A2E", fontSize: "11px", fontWeight: "700", padding: "6px 14px", borderRadius: "50px", textTransform: "uppercase" }}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails list below if there are multiple images */}
            {productImages.length > 1 && (
              <div className="product-thumbnail-strip">
                {productImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`product-thumbnail-btn ${activeImgIndex === idx ? "active" : ""}`}
                  >
                    <img src={img} alt={`${product.name} thumb ${idx}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PRODUCT SPECIFICATIONS & ACTIONS */}
          <div className="product-info-col">
            
            {/* Category Label */}
            <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--magenta)" }}>
              {categoryLabel}
            </span>

            {/* Product Title */}
            <h1 className="product-title">
              {product.name}
            </h1>

            {/* Ratings and Reviews */}
            <div className="product-rating-box">
              <span style={{ color: "var(--gold)", fontSize: "16px" }}>
                {"★".repeat(Math.floor(product.rating))}
                {"☆".repeat(5 - Math.floor(product.rating))}
              </span>
              <strong style={{ fontSize: "14px", color: "#fff" }}>{product.rating}</strong>
              <span style={{ fontSize: "14px", color: "var(--gray)" }}>({product.reviews} verified reviews)</span>
            </div>

            {/* Pricing Section */}
            <div className="product-price-box">
              <span className="product-price-amount">
                ₹{product.price}
              </span>
              <span className="product-price-original">
                ₹{product.orig}
              </span>
              <span className="product-price-saving">
                SAVE ₹{product.orig - product.price} ({product.off}% OFF)
              </span>
            </div>

            {/* Product description */}
            <p style={{ fontSize: "15px", color: "var(--gray)", lineHeight: "1.7" }}>
              {product.description}
            </p>

            {/* Excel Metadata Specifications Grid */}
            <div className="product-spec-grid">
              <div style={{ fontSize: "13px", color: "var(--gray)" }}>
                SKU ID: <strong style={{ color: "#fff" }}>{product.sku}</strong>
              </div>
              {product.product_code && (
                <div style={{ fontSize: "13px", color: "var(--gray)" }}>
                  Product Code: <strong style={{ color: "#fff" }}>{product.product_code}</strong>
                </div>
              )}
              {product.asin && (
                <div style={{ fontSize: "13px", color: "var(--gray)" }}>
                  Amazon ASIN: <strong style={{ color: "#fff" }}>{product.asin}</strong>
                </div>
              )}
              <div style={{ fontSize: "13px", color: "var(--gray)" }}>
                Availability:{" "}
                {product.quantity > 0 ? (
                  <strong style={{ color: "#22c55e" }}>In Stock (Only {product.quantity} left)</strong>
                ) : (
                  <strong style={{ color: "var(--magenta)" }}>Ships in 24 Hours (Fast Dispatch)</strong>
                )}
              </div>
              {(product.length_cm || product.breadth_cm) && (
                <div style={{ fontSize: "13px", color: "var(--gray)", gridColumn: "span 2", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "10px", marginTop: "4px" }}>
                  Packaging Girth:{" "}
                  <strong style={{ color: "#fff" }}>
                    {product.length_cm ? `${product.length_cm} cm (L) ` : ""}
                    {product.breadth_cm ? `x ${product.breadth_cm} cm (B) ` : ""}
                    (Ultra-compact & private envelope size)
                  </strong>
                </div>
              )}
            </div>

            {/* Coupons Strip */}
            <div className="product-coupons-box">
              <span className="product-coupons-title">🔥 Active Deals & Coupons</span>
              <div className="product-coupons-strip">
                {["ZAMBA20", "FREESHIP"].map((code) => (
                  <div 
                    key={code} 
                    onClick={() => copyCouponCode(code)}
                    className="product-coupon-badge"
                  >
                    <span className="product-coupon-code">{code}</span>
                    <span className="product-coupon-status">{copiedCoupon === code ? "Copied!" : "Click to Copy"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION ROW: Quantity selector and Add/Buy Buttons */}
            <div className="product-action-row">
              <div className="product-action-buttons-wrap">
                
                {/* Quantity Count Selector */}
                <div className="product-qty-selector">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="product-qty-btn"
                  >
                    -
                  </button>
                  <span className="product-qty-value">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="product-qty-btn"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button 
                  className="product-btn-cart" 
                  onClick={() => handleAddToCart(product.name, product.price, productImages[0])}
                >
                  🛒 Add to Cart
                </button>
              </div>

              {/* Direct Checkout on WhatsApp */}
              <button 
                onClick={handleBuyNowWhatsApp}
                className="product-btn-whatsapp"
              >
                <FaWhatsapp size={20} />
                <span>Buy Now on WhatsApp (Fast Dispatch)</span>
              </button>
            </div>

            {/* TRUST BADGES STRIP */}
            <div className="product-trust-grid">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--gray)" }}>
                <span style={{ fontSize: "20px" }}>📦</span>
                <div>
                  <strong style={{ color: "#fff", display: "block" }}>100% Discreet Packaging</strong>
                  No brand names or logos externally.
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--gray)" }}>
                <span style={{ fontSize: "20px" }}>🛡️</span>
                <div>
                  <strong style={{ color: "#fff", display: "block" }}>Body Safe Materials</strong>
                  Medical-grade hypoallergenic silicone.
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--gray)" }}>
                <span style={{ fontSize: "20px" }}>💳</span>
                <div>
                  <strong style={{ color: "#fff", display: "block" }}>Secure UPI & Card Payments</strong>
                  Encrypted SSL safety verification.
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--gray)" }}>
                <span style={{ fontSize: "20px" }}>🔞</span>
                <div>
                  <strong style={{ color: "#fff", display: "block" }}>Adults Only Wellness</strong>
                  Strictly 18+ verification enforced.
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <section id="related-products" style={{ padding: "80px 0 0", maxWidth: "100%" }}>
            <div className="section-header" style={{ marginBottom: "36px", textAlign: "left" }}>
              <span className="section-eyebrow">Explore More</span>
              <h2 className="section-title" style={{ fontSize: "28px" }}>Related Wellness Toys</h2>
            </div>
            <div className="products-grid">
              {relatedProducts.map((p, i) => (
                <div key={i} className="prod-card" style={{ display: "flex", flexDirection: "column" }}>
                  <Link href={`/product/${p.sku}`} style={{ display: "block", flexGrow: 1 }}>
                    <div className="prod-img">
                      {p.images && p.images[0] ? (
                        <img src={p.images[0]} alt={p.name} className="prod-card-img" />
                      ) : (
                        <span className="prod-emoji">{p.emoji}</span>
                      )}
                      <span className="prod-badge-off">-{p.off}%</span>
                      {p.badge && <span className="prod-badge-best">{p.badge}</span>}
                    </div>
                    <div className="prod-info" style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
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
                      <div className="prod-prices" style={{ marginTop: "auto" }}>
                        <span className="prod-price">₹{p.price}</span>
                        <span className="prod-orig">₹{p.orig}</span>
                      </div>
                    </div>
                  </Link>
                  <div style={{ padding: "0 18px 18px 18px" }}>
                    <button 
                      className="btn-cart" 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleAddToCart(p.name, p.price, p.images[0] || p.emoji);
                      }}
                      style={{ width: "100%" }}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FAQ SECTION */}
      <section id="faq" style={{ background: "var(--dark-card)", padding: "64px 40px" }}>
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
              <li><Link href="/mens-toys?search=sleeve">Sleeves & Extenders</Link></li>
              <li><Link href="/mens-toys?search=stroker">Automatic Strokers</Link></li>
              <li><Link href="/mens-toys?search=cup">Masturbator Cups</Link></li>
              <li><Link href="/couple-toys?search=cage">Chastity Devices</Link></li>
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
