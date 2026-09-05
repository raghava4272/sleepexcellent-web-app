import type { Metadata } from "next";
import { CartProvider } from "@/components/cart-provider";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SleepExcellent | Premium Mattresses & Interiors",
    template: "%s | SleepExcellent",
  },
  description:
    "Premium mattresses, custom sofas, designer beds and refined ceiling interiors for modern Indian homes.",
  keywords: [
    "premium mattresses",
    "custom sofas",
    "designer beds",
    "ceiling interiors",
    "SleepExcellent",
  ],
  openGraph: {
    title: "SleepExcellent | Premium Mattresses & Interiors",
    description:
      "Exceptional comfort, beautifully crafted for every room.",
    type: "website",
    locale: "en_IN",
    siteName: "SleepExcellent",
  },
  twitter: {
    card: "summary",
    title: "SleepExcellent | Premium Mattresses & Interiors",
    description:
      "Exceptional comfort, beautifully crafted for every room.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><CartProvider>{children}</CartProvider></body>
    </html>
  );
}
