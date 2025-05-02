"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import Sidebar from '@/components/sidebar/Sidebar';
import { getCookie, isTokenExpired, setCookie } from "@/helper/functions";
import Sidebar_Dark from '@/components/sidebar/Sidebar_Dark';

const theme = createTheme();

export function Providers({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(true);
    const drawerWidth = 240;
    const [username, setUserName] = useState('');
    const [companyName, setCompanyName] = useState('');


    useEffect(() => {
        const payload = getCookie("payload");
        const publicPages = ['/', '/login'];

        if (payload != '' && payload != null && payload != undefined) {
            const { accessToken, name, isAdmin, organizationName } = JSON?.parse(payload);
            setUserName(name);
            setCompanyName(organizationName);
            if (!accessToken || isTokenExpired(accessToken)) {
                setCookie('payload', '', 7);
                router.push("/login");
            } else {
                if (publicPages.includes(pathname)) {
                    isAdmin ? router.push('/users') : router.push('/dashboard');
                }
            }
        } else {
            if (!publicPages.includes(pathname)) {
                router.push("/login");
            }
        }

        // After auth check, remove loader
        setIsLoading(false);

    }, [pathname, router]);
    const renderContainerHeading = () => {
        if (pathname == '/dashboard') {
            return (
                <div style={{ marginTop: "15px" }}>
                    <Typography noWrap component="div" sx={{ color: '#FFFFFF', fontWeight: '600', marginLeft: open ? "0px" : "25px", fontSize: "32px", letterSpacing: "-0.2px" }}>
                        {companyName}
                    </Typography>
                    <Typography noWrap component="div" sx={{ color: '#E95E1B', marginLeft: open ? "0px" : "25px", fontSize: "24px", fontWeight: "400px" }}>
                        Welcome back, {username}!
                    </Typography>
                </div>
            );
        } else if (pathname == '/jobs') {
            return (
                <div style={{ marginTop: "15px" }}>
                    <Typography noWrap component="div" sx={{ color: '#FFFFFF', fontWeight: '600', marginLeft: open ? "0px" : "25px", fontSize: "32px", letterSpacing: "-0.2px" }}>
                        {companyName}
                    </Typography>
                    <Typography noWrap component="div" sx={{ color: "#E95E1B", fontWeight: "bold", marginLeft: open ? "0px" : "25px", fontSize: "24px" }}>
                        Jobs
                    </Typography>
                </div>
            );
        } else if (pathname == '/documents') {
            return (
                <div style={{ marginTop: "15px" }}>
                    <Typography noWrap component="div" sx={{ color: '#FFFFFF', fontWeight: '600', marginLeft: open ? "0px" : "25px", fontSize: "32px", letterSpacing: "-0.2px" }}>
                        {companyName}
                    </Typography>
                    <Typography noWrap component="div" sx={{ color: '#E95E1B', fontWeight: "bold", marginLeft: open ? "0px" : "25px", fontSize: "24px" }}>
                        Report & Invoices
                    </Typography>
                </div>
            );
        } else if (pathname == '/users') {
            return (
                <div style={{ marginTop: "15px" }}>
                    <Typography noWrap component="div" sx={{ color: '#FFFFFF', fontWeight: '600', marginLeft: open ? "0px" : "25px", fontSize: "32px", letterSpacing: "-0.2px", fontFamily: "Nunito" }}>
                        {companyName}
                    </Typography>
                    <Typography noWrap component="div" sx={{ color: "#E95E1B", fontWeight: "bold", marginLeft: open ? "0px" : "25px", fontSize: "24px", fontFamily: "Nunito" }}>
                        Welcome back, {username}!
                    </Typography>
                </div>
            );
        }
    };
    // Loader till auth check completes
    if (isLoading) {
        return (
            <div style={{ justifyContent: "center", display: "flex", alignItems: "center", height: "100vh" }}>
                <div style={{ position: "relative", display: "inline-block", padding: "12px" }}>
                    <div style={{
                        position: "absolute",
                        top: "-26px",
                        left: "3px",
                        width: "9rem",
                        height: "9rem",
                        border: "3px solid transparent",
                        borderTop: "3px solid #000",
                        borderRadius: "100%",
                        animation: "rotateCircle 1.5s linear infinite",
                        boxSizing: "border-box"
                    }} />
                    <img
                        src="/images/dashboard/logo.png"
                        alt="Logo"
                        style={{
                            width: "8rem",
                            display: "block",
                            position: "relative",
                            zIndex: 1
                        }}
                    />
                </div>
                <style>
                    {`
                        @keyframes rotateCircle {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>
            </div>
        );
    }

    // If on login page, no layout wrapper
    if (pathname === '/login' || pathname === '/') {
        return children;
    }

    return (
        <ThemeProvider theme={theme}>

            <Box sx={{ display: 'flex', backgroundColor: "#0A0A0A" }}>
                {/* <Sidebar open={open} drawerWidth={drawerWidth} /> */}
                <Sidebar_Dark open={open} drawerWidth={drawerWidth} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        minHeight: '100vh',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <AppBar
                        position="fixed"
                        sx={{
                            width: `calc(100% - ${drawerWidth}px)`,
                            // bgcolor: 'white',
                            bgcolor: '#0A0A0A',
                            boxShadow: '0px 6px 7px rgba(0, 0, 0, 0.67)',
                            padding: "8px"
                        }}
                    >
                        <Toolbar sx={{ padding: '0 24px' }}>
                            {renderContainerHeading()}
                        </Toolbar>
                    </AppBar>

                    <Box sx={{
                        flexGrow: 1,
                        marginTop: '80px',
                        // marginRight: "29px",
                        padding: '  24px',
                    }}>
                        {children}
                    </Box>
                </Box>
            </Box>


        </ThemeProvider>
    );
}