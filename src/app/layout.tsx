import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { Analytics } from "@vercel/analytics/next"
import Header from "../components/Header";
import WhatsappButton from "./_components/WhatsappButton";
import {SEOConfig} from "../components/SEOConfig";
import { PostHogContext } from "../context/PostHogContext";

const domain = process.env.NEXT_PUBLIC_DOMAIN as string;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lubella – Bienestar íntimo consciente",
  description: "Productos Lubella para mujer, pañoletas, toallas femeninas, nocturnas, calzones menstruales y más",
  icons: {
    icon: `${domain}/imgs/favicon.png`,
    shortcut: `${domain}/imgs/favicon.png`,
    apple: `${domain}/imgs/favicon.png`,
    other: {
      rel: 'icon',
      url: `${domain}/imgs/favicon.png`,
    },
  },
  openGraph: {
    title: "Lubella – Bienestar íntimo consciente",
    description: "Productos Lubella para mujer, pañoletas, toallas femeninas, nocturnas, calzones menstruales y más",
    images: `${domain}/imgs/lubella-productos.JPG`,
    url: domain,
    siteName: "Lubella",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lubella – Bienestar íntimo consciente",
    description: "Productos Lubella para mujer, pañoletas, toallas femeninas, nocturnas, calzones menstruales y más",
    images: `${domain}/imgs/lubella-productos.JPG`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <PostHogContext>
        <Analytics />
        <SEOConfig />
        <CartProvider>
          
          <Header />
          {children}
          <WhatsappButton />
        </CartProvider>
        </PostHogContext>
      </body>
    </html>
  );
}