'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar"; // Ensure the path to Sidebar is correct
import AuthProvider from '@/components/AuthProvider';
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const noLayoutRoutes = ["/user/login", "/user/signup"];
  const hideLayout = noLayoutRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
      <AuthProvider>
         {!hideLayout && <Sidebar />}  

          {/* Main Content */}
          <div className={!hideLayout ? "ml-64" : ""}>        
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}