import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context/App";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sahal M | Interactive OS Portfolio",
  description: "Explore the interactive OS-themed portfolio of Sahal M, a Full Stack Web Developer and B.Tech Computer Science graduate building unique digital experiences. ",
  keywords: [
    "Sahal", 
    "Sahal M", 
    "Sahal Muhammed", 
    "OS Portfolio", 
    "Web Developer", 
    "Frontend Developer", 
    "Thiruvananthapuram",
    "Fullstack Developer",
  ],
  authors: [{ name: "Sahal M" }],
  openGraph: {
    title: "Sahal M | Interactive OS Portfolio",
    description: "Explore the custom desktop OS-themed portfolio of Sahal Muhammed Zakkeer.",
    url: "https://sahalm.page",
    siteName: "Sahal's OS Portfolio",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
