import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header"; // Importieren Sie den Header
import { MantineProvider } from '@mantine/core'; // Import MantineProvider
import '@mantine/core/styles.css'; // Import Mantine CSS
import '@mantine/tiptap/styles.css'; // Import Tiptap CSS

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Compare Top CFD & Forex Brokers | TradeSpotter",
  description: "Find the best CFD and Forex brokers. Compare spreads, platforms, and regulations. Trade smarter with expert insights from TradeSpotter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider> {/* Restored */}
          <Header /> {/* Header wiederhergestellt */}
          {children} {/* Seiteninhalt wird hier gerendert */}
          {/* Hier könnten wir später den Footer hinzufügen */}
        </MantineProvider> {/* Restored */}
      </body>
    </html>
  );
}
