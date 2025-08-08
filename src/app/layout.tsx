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
    icon: '/imgs/favicon.png',
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
        <meta name="description" content="Sitio de compras Lubella, productos de Lubella, productos de Lubella en México" />
        <link rel="icon" href="/imgs/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#e8416c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lubella" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta property="og:title" content="Lubella – Bienestar íntimo consciente" />
        <meta property="og:description" content="Descubre productos íntimos reutilizables y ecológicos como toallas femeninas y calzones menstruales. Cuida tu cuerpo y el planeta con Lubella." />
        <meta property="og:image" content="/imgs/lubella-productos.JPG" />
        <meta property="og:url" content="https://lubella.mx" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Lubella" />
        <meta property="og:locale" content="es_MX" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lubella – Bienestar íntimo consciente" />
        <meta name="twitter:description" content="Productos reutilizables y ecológicos para tu ciclo menstrual. Lubella es mexicano, consciente y natural." />
        <meta name="twitter:image" content="/imgs/lubella-productos.JPG" />
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
