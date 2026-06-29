import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "FreightFlow Control",
    template: "%s | FreightFlow Control",
  },
  description:
    "Professional logistics management portal for dispatch, fleet visibility, and warehouse coordination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
