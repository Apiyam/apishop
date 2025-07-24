import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { Analytics } from "@vercel/analytics/next"
import Head from "next/head";
import Header from "../components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tienda Lubella de México",
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
      <body className={`${geistSans.variable} ${geistMono.variable}`} >
        <Analytics />
        <CartProvider>
          <Head>
            <title>Sitio de compras Lubella</title>
            <meta name="description" content="Sitio de compras Lubella, productos de Lubella, productos de Lubella en México" />
            <link rel="icon" href="/imgs/favicon.png" />
          </Head>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
