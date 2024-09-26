import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar"; // Ensure the path to Sidebar is correct
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="ml-64 p-8">
          {children}
        </div>
      </body>
    </html>
  );
}