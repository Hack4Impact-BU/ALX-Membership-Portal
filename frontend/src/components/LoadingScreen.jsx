'use client';
import React from 'react';
import { Inter, Proza_Libre } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function LoadingScreen() {
    return (
      <div className={`loading-screen ${prozaLibre.className}`} style={{ height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p className="loading-message" style={{ textAlign: 'center', fontSize: '2rem' }}>
          Loading, please wait...
        </p>
      </div>
    );
  }