import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar"; // Ensure the path to Sidebar is correct
import AuthProvider from '@/components/AuthProvider'; // Import the AuthProvider
import NavBar from '/src/components/NavBar.jsx';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
      <AuthProvider>
        {/* Sidebar */}
        <Sidebar />

          {/* NavBar */}
          <NavBar />
        {/* Main Content */}
        <div className="ml-64">

          
          {children}
       

        </div>
           </AuthProvider>
      </body>
    </html>
  );
}