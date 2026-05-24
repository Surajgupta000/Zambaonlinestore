import "./globals.css";

const SITE_URL = "https://zambaonlinestore.vercel.app";
const SITE_NAME = "ZambaOnlineShop";
const SITE_TITLE = "ZambaOnlineShop — India's #1 Premium Adult Store";
const SITE_DESCRIPTION =
  "India's most trusted adult wellness store. Shop 100% body-safe vibrators, masturbators, couple toys, dildos & more — shipped in discreet packaging. Fast delivery across India.";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const metadata = {
  // ── Core ──────────────────────────────────────────────────────────
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "adult toys India",
    "sex toys online India",
    "vibrators India",
    "dildo buy online",
    "masturbators for men",
    "couples toys",
    "women pleasure toys",
    "discreet adult shopping",
    "body safe adult toys",
    "buy vibrator India",
    "intimate wellness India",
    "adult store online",
    "pleasure products India",
    "zamba online shop",
    "zambaonlineshop",
    "adult toys with discreet shipping",
    "sex toys for couples India",
    "women vibrators India",
    "men sex toys India",
    "buy adult toys discreetly",
  ],
  authors: [{ name: "ZambaOnlineShop", url: SITE_URL }],
  creator: "ZambaOnlineShop",
  publisher: "ZambaOnlineShop",
  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Canonical URL ────────────────────────────────────────────────
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },

  // ── Open Graph (Facebook, WhatsApp, Telegram, LinkedIn) ─────────
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "ZambaOnlineShop — India's Premium Adult Wellness Store",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X Card ────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@zambaonlineshop",
    creator: "@zambaonlineshop",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },

  // ── Icons / Favicon ─────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/og-image.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/og-image.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },

  // ── Misc ─────────────────────────────────────────────────────────
  category: "shopping",
  classification: "Adult Wellness & Pleasure Products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* WhatsApp / Telegram / iMessage — explicit OG fallback */}
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="ZambaOnlineShop — India's Premium Adult Wellness Store" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* WhatsApp explicit */}
        <meta name="description" content={SITE_DESCRIPTION} />

        {/* Theme color for Android / browser chrome */}
        <meta name="theme-color" content="#E91E8C" />
        <meta name="msapplication-TileColor" content="#1A0A2E" />
        <meta name="msapplication-TileImage" content="/og-image.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
