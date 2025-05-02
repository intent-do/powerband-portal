"use client";  // Marks this component as a client-side component

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";  // useRouter for redirect
import { useTheme } from "@emotion/react";
import { Avatar, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Stack, Typography, CircularProgress } from "@mui/material";
import LogoutPopover from "@/components/popover/LogoutPopover";
import Link from "next/link";
import { getCookie, isTokenExpired, setCookie } from "@/helper/functions";

export default function DashboardLayout({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const payload = getCookie("payload");
        if (payload != '' && payload != null && payload != undefined) {
            const { accessToken } = JSON?.parse(payload);
            // If token is not found or expired, redirect to login
            if (!accessToken || isTokenExpired(accessToken)) {
                setCookie('payload', '', 7);
                router.push("/login");  // If no token or token expired, redirect to login
            } else {
                setIsAuthenticated(true);  // If token exists and valid, allow access to dashboard
            }
        }
        else {
            router.push("/login");
        }
    }, [router]);

    if (!isAuthenticated) {
        return <div style={{ justifyContent: "center", display: "flex", alignItems: "center", height: "77vh" }}>
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
    }

    return (
        <div className="layout">
            <>
                {children}
            </>
        </div>
    );
}
