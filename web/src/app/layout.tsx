import type { Metadata } from "next";
import { TRPCProvider } from "./_components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shark Tank - Project Evaluator",
  description: "Get your project evaluated by a panel of Shark Tank investors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
