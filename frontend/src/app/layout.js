import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import Sidebar from "@/components/sidebar";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body className={inter.className}>
          <Sidebar />
          {children}
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}