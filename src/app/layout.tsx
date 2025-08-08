import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { Analytics } from "@vercel/analytics/next"
import Head from "next/head";
import Header from "../components/Header";
import WhatsappButton from "./_components/WhatsappButton";

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
    icon: 'https://www.lubella.com.mx/imgs/favicon.png',
    shortcut: 'https://www.lubella.com.mx/imgs/favicon.png',
    apple: 'https://www.lubella.com.mx/imgs/favicon.png',
    other: {
      rel: 'icon',
      url: 'https://www.lubella.com.mx/imgs/favicon.png',
    },
  },
  openGraph: {
    title: "Lubella – Bienestar íntimo consciente",
    description: "Productos Lubella para mujer, pañoletas, toallas femeninas, nocturnas, calzones menstruales y más",
    images: "https://www.lubella.com.mx/imgs/lubella-productos.JPG",
    url: "https://lubella.com.mx",
    siteName: "Lubella",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lubella – Bienestar íntimo consciente",
    description: "Productos Lubella para mujer, pañoletas, toallas femeninas, nocturnas, calzones menstruales y más",
    images: "https://www.lubella.com.mx/imgs/lubella-productos.JPG",
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  //style={{ backgroundImage: 'url(https://img.freepik.com/foto-gratis/fondo-rosa-fondo-blanco-fondo-rosa_10126-1942.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
  return (
    <html lang="es">
      <Head>
        <title>Lubella – Bienestar íntimo consciente</title>
        <meta name="description" content="Productos Lubella para mujer, pañoletas, toallas femeninas, nocturnas, calzones menstruales y más" />

        <meta property="og:title" content="Lubella – Bienestar íntimo consciente" />
        <meta property="og:description" content="Productos Lubella para mujer, pañoletas, toallas femeninas, nocturnas, calzones menstruales y más" />
        <meta property="og:image" content="/imgs/lubella-productos.JPG" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lubella.com.mx" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lubella – Bienestar íntimo consciente" />
        <meta name="twitter:description" content="Productos Lubella para mujer, pañoletas, toallas femeninas, nocturnas, calzones menstruales y más" />
        <meta name="twitter:image" content="/imgs/lubella-productos.JPG" />

        <link rel="icon" href="/imgs/favicon.png" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} >
        <Analytics />
        <CartProvider>
          <Header />
          {children}
          <WhatsappButton />
        </CartProvider>
      </body>
    </html>
  );
}
