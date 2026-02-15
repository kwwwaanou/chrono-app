import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chronosport",
  description: "Mobile-first sports set timer",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-gray-200">
        {children}
      </body>
    </html>
  );
}
