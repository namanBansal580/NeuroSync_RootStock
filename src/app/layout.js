import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ContextProvider from "./components/context";
import { headers } from "next/headers";
import Footer from "./components/Footer";
import { ThemeProvider } from "next-themes";
import { GoogleOAuthProvider } from '@react-oauth/google';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
async function getCookies() {
  const headerList = headers();
  return headerList.get("cookie") || "";
}
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NeuroSync",
  description: "Crypto Trading Bot",
};

export default async  function RootLayout({ children }) {
  const cookies = await getCookies(); // Await inside the async RootLayout

  return (
    <GoogleOAuthProvider clientId="509478278825-5evqs019g7s3j42tm5ddfccs26kr6rdn.apps.googleusercontent.com">

    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ContextProvider cookies={cookies}>
        <Navbar></Navbar>
        
        {children}
        </ContextProvider>
        <Footer></Footer>
        <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
      </body>
    </html>
          </GoogleOAuthProvider>
  );
}
