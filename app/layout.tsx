import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pit Wall",
  description: "A simulated racing team engineering dashboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
