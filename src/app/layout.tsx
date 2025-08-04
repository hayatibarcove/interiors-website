import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Luminare Studio - Luxury Interior Design & Creative Solutions",
  description: "Transform your space with Luminare Studio's innovative interior design services. From residential elegance to commercial sophistication, we create timeless environments that inspire.",
  keywords: "interior design, luxury design, residential design, commercial design, sustainable design, home renovation, space planning, furniture selection, lighting design, color consultation, Luminare Studio",
  authors: [{ name: "Luminare Studio" }],
  openGraph: {
    title: "Luminare Studio - Luxury Interior Design",
    description: "Elevate your space with our innovative interior design solutions. Residential and commercial projects with timeless elegance.",
    type: "website",
    images: [
      {
        url: "/photos/luminare-studio-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Luminare Studio Interior Design Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luminare Studio - Luxury Interior Design",
    description: "Transform your space with innovative interior design solutions",
    images: ["/photos/luminare-studio-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/logo.ico" />
        <link rel="canonical" href="https://luminarestudio.com" />
      </head>
      <body className={`${inter.variable} ${playfairDisplay.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
