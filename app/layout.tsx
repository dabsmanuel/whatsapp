import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhatsApp Link Generator - Create Professional Business Links",
  description: "Generate professional shortened URLs that open WhatsApp with pre-filled messages. Perfect for businesses to streamline customer communication and boost engagement.",
  keywords: [
    "whatsapp link generator",
    "whatsapp business links",
    "pre-filled whatsapp messages",
    "customer communication",
    "business messaging",
    "whatsapp marketing",
    "url shortener",
    "contact links"
  ],
  authors: [{ name: "Your Name" }],
  creator: "Dabs Manuel",
  publisher: "Dabs Manuel Oyibo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://whatslink-brown.vercel.app/",
    title: "WhatsApp Link Generator - Professional Business Communication",
    description: "Create custom WhatsApp links with pre-filled messages to streamline customer communication and boost business engagement.",
    siteName: "WhatsApp Link Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatsApp Link Generator - Professional Business Communication",
    description: "Create custom WhatsApp links with pre-filled messages to streamline customer communication and boost business engagement.",
    creator: "@dabs_manuel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}