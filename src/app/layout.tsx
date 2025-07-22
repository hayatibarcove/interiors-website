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
  title: "ARTISTRY - A Visual Journey Through Art, Design & Photography",
  description: "An immersive digital gallery showcasing the evolution of art, design principles, and photography through interactive 3D book experience.",
  keywords: "art, design, photography, interactive gallery, Bauhaus, minimalism, color theory, digital art",
  authors: [{ name: "Creative Studio" }],
  openGraph: {
    title: "ARTISTRY - Digital Art Gallery",
    description: "Explore art history through an interactive 3D book experience",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfairDisplay.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
