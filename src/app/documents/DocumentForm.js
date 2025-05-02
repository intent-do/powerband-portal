'use client'
import React, { useState } from 'react';
import {
    Box,
    useTheme,
} from '@mui/material';
import DocumentsTable from '@/components/documents/DocumentsTable';

import { usePathname } from 'next/navigation'
import DocumentsTable_Dark from '@/components/documents/DocumentsTable_Dark';


// Main App
export default function Dashboard(props) {
    const pathname = usePathname()
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [activeTab, setActiveTab] = useState(pathname);
    const drawerWidth = 240;

    const handleDrawerToggle = () => {
        setOpen(!open);
    };


    return (
        <Box sx={{ display: 'flex', position: 'relative' }}>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    // p: 3,
                    // mt: 8,
                    // backgroundColor: '#f5f5f5',
                    minHeight: '100vh',
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    marginLeft: open ? 0 : `-${drawerWidth}px`,
                }}
            >
                <DocumentsTable_Dark res={props} />
            </Box>
        </Box >
    );
}