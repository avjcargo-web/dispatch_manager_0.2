import type { Metadata } from "next";
import "./globals.css";

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
    <html
      lang="en"
      data-portal-theme="dark"
      className="h-full antialiased"
    >
      <body className="min-h-full font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
