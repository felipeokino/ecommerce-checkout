import "@/app/globals.css";
import Header from '@/components/layout/header';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/context/cart.context';
import { activeBanner, appName } from '@/lib/utils';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: appName,
  description: "Created by Felipe O.",
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
        <CartProvider>
          <Header  />
          <div className='mb-4'>
            {activeBanner.active && <activeBanner.component />}
          </div>
          {children}
           <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
