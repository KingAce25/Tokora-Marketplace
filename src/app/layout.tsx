import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tokora Marketplace",
    template: "%s | Tokora Marketplace",
  },

  description:
    "Discover amazing products, connect with trusted sellers, and enjoy a seamless shopping experience on Tokora Marketplace.",

  keywords: [
    "Tokora",
    "Tokora Marketplace",
    "Marketplace",
    "Wallet",
    "Events",
    "E-commerce",
    "Online Shopping",
    "Buy Online",

    "Sell Online",
    "Nigeria Marketplace",
  ],

  authors: [{ name: "Tokora Marketplace" }],
  creator: "Tokora Marketplace",
  publisher: "Tokora Marketplace",

  manifest: "/site.webmanifest",

  icons: {
    icon: [
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    title: "Tokora Marketplace",
    description:
      "Discover amazing products, connect with trusted sellers, and enjoy a seamless shopping experience on Tokora Marketplace.",
    siteName: "Tokora Marketplace",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tokora Marketplace",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Tokora Marketplace",
    description:
      "Discover amazing products, connect with trusted sellers, and enjoy a seamless shopping experience on Tokora Marketplace.",
    images: ["/og-image.png"],
  },

  metadataBase: new URL("https://tokora.com"), // Replace with actual domain
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
        <Navbar />
      </body>
    </html>
  );
}
