'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar"; // Ensure the path to Sidebar is correct
import AuthProvider from '@/components/AuthProvider';


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const noLayoutRoutes = ["/user/login", "/user/signup"];
  const hideLayout = noLayoutRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <AuthProvider>
          {/* Conditionally show Sidebar and NavBar */}
          {!hideLayout && <Sidebar />}
     

          {/* Main Content */}
          <div className={`flex justify-center items-center ${!hideLayout ? "ml-64" : ""}`} style={{ minHeight: '100vh' }}>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
