import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Syria Vision - Building Tomorrow's Leaders",
  description:
    "Syria Vision is an annual innovation event that brings together ambitious Syrian youth to develop creative projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
