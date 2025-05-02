"use client";  // Marks this component as a client-side component

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCookie, isTokenExpired, setCookie } from "@/helper/functions";
import { useTheme } from "@mui/material";
import './globals.css';
import { Providers } from './providers';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import Sidebar from '@/components/sidebar/Sidebar';

// Google Fonts configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Helper function to check token expiration

// import './globals.css';
// import { Providers } from './providers';
// import React, { useEffect, useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { useTheme } from '@mui/material/styles';
// import { Box, AppBar, Toolbar, Typography } from '@mui/material';
// import Sidebar from '@/components/sidebar/Sidebar';

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const drawerWidth = 240;
  const [isLoading, setIsLoading] = useState(true); // State to handle loading state

  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const expiration = decoded.exp * 1000;
      return Date.now() > expiration;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    const payload = getCookie("payload");

    if (payload != '' && payload != null && payload != undefined) {
      const { accessToken } = JSON?.parse(payload);
      // If token is not found or expired, redirect to login
      if (!accessToken || isTokenExpired(accessToken)) {
        setCookie('payload', '', 7);
        router.push("/login");  // Redirect to login page
      }
    }
    else {
      router.push("/login");
    }
    setIsLoading(false);  // Set loading to false after authentication check
  }, [router]);


  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>
          {/* {pathname ==  = '/login' ? children : children} */}
          {children}
        </Providers>
      </body>
    </html>
  );
}