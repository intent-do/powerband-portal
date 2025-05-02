// app/components/Sidebar.js
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    Avatar,
} from '@mui/material';
import Link from 'next/link';
import LogoutPopover from '@/components/popover/LogoutPopover';
import { getCookie, isTokenExpired, setCookie } from "@/helper/functions";

const Sidebar_Dark = ({ open, drawerWidth = 240 }) => {
    const pathname = usePathname();
    const payload = getCookie("payload");

    const router = useRouter();

    useEffect(() => {
        if (!payload || payload === '' || payload === null || payload === undefined) {
            router.push("/login"); // Redirect to login page
        }
    }, [payload]);

    // Sidebar menu items
    const menuItems = [
        { text: 'Overview', icon: "/images/dashboard/sidebarOverview1.svg", url: "/dashboard" },
        { text: 'Jobs', icon: "/images/dashboard/sidebarJobs1.svg", url: "/jobs" },
        { text: 'Documents', icon: "/images/dashboard/sidebarDocuments1.svg", url: "/documents" },
        { text: 'Users', icon: "/images/dashboard/sidebarOverview1.svg", url: "/users" },
    ];

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    padding: 0,
                    borderRight: '1px solid #232323',
                    backgroundColor: "#0A0A0A"
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <img
                src="/images/dashboard/logo2.png"
                alt="Logo"
                style={{ padding: "16px" }}
            />

            {/* Menu Items */}
            {/* <List sx={{ flexGrow: 1, padding: 0 }}>
                {menuItems.map((item) => (
                    <Link href={item.url} key={item.text} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItem
                            selected={pathname === item.url}
                            sx={{
                                padding: '12px 16px',
                                '&.Mui-selected': {
                                    backgroundColor: '#f5f5f5',
                                }
                            }}
                        >
                            <Box
                                component="img"
                                src={item.icon}
                                alt={item.text}
                                sx={{
                                    width: 20, height: 20, marginRight: 1.5, filter: pathname === item.url ? "invert(100%)" : "invert(0%)",
                                }}
                            />
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: "14px",
                                    fontWeight: pathname === item.url ? 800 : 500,
                                    color: pathname === item.url ? "#212121" : "#9E9E9E"
                                }}
                            />
                        </ListItem>
                    </Link>
                ))}
            </List> */}
            <List sx={{ flexGrow: 1, padding: 0 }}>
                {menuItems
                    .filter((item) =>
                        payload && JSON?.parse(payload)?.email
                            ? JSON?.parse(payload)?.isAdmin
                                ? item.text === "Users"
                                : ["Overview", "Jobs", "Documents"].includes(item.text)
                            : false
                    )
                    .map((item) => (
                        <Link href={item.url} key={item.text} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div>
                                <ListItem
                                    selected={pathname === item.url}
                                    sx={{
                                        padding: '10px 16px',
                                        backgroundColor: pathname === item.url ? "#171717" : "transparent",
                                        margin: "5px 0px",
                                        width: "70%",
                                        marginLeft: "35px",
                                        borderRadius: "12px",
                                        '&.Mui-selected': {
                                            // backgroundColor: '#f5f5f5',
                                            backgroundColor: '#000',
                                        }
                                    }}
                                >
                                    <div style={{
                                        backgroundColor: pathname === item.url ? "#E95E1B" : "#8B5CF61A",
                                        height: "32px",
                                        width: "32px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "10px",
                                        marginRight: "12px"
                                    }}>
                                        <Box
                                            component="img"
                                            src={item.icon}
                                            alt={item.text}
                                            sx={{
                                                width: 20, height: 20,
                                                //marginRight: 1.5, marginLeft: 1.5,
                                                // filter: pathname === item.url ? "invert(100%)" : "invert(0%)",
                                                filter: pathname === item.url ? 'brightness(0) invert(1)' : 'none',
                                            }}
                                        />
                                    </div>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontSize: "14px",
                                            // fontWeight: pathname === item.url ? 800 : 500,
                                            fontWeight: 600,
                                            // color: pathname === item.url ? "#212121" : "#9E9E9E"
                                            color: "#FAFAFA"

                                        }}
                                    />
                                </ListItem>
                            </div>
                        </Link>
                    ))}
            </List>

            {/* Profile at bottom */}
            <Box sx={{ p: 2, borderTop: '1px solid #232323', display: 'flex', alignItems: 'center', cursor: "pointer" }}>
                <LogoutPopover children={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Avatar alt={payload != '' && payload != null && payload != undefined && JSON?.parse(payload)?.name} />&nbsp; */}
                        <Avatar>
                            {payload && JSON?.parse(payload)?.name?.charAt(0)?.toUpperCase()}
                        </Avatar>&nbsp;
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Stack>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: "#FAFAFA" }}>{payload != '' && payload != null && payload != undefined && JSON?.parse(payload)?.name}</Typography>
                                <Typography variant="body2" color="#FAFAFA">{payload != '' && payload != null && payload != undefined && JSON?.parse(payload)?.email}</Typography>
                            </Stack>
                        </Box>
                    </div>
                } />
            </Box>
        </Drawer>
    );
};

export default Sidebar_Dark;
