'use client'
import React, { useState } from 'react';
import {
    Box,
    useTheme,

} from '@mui/material';
import JobsTableSection from '@/components/jobs/JobsTableSection';
import { usePathname } from 'next/navigation'
import JobsTableSection_Dark from '@/components/jobs/JobsTableSection_Dark';

export default function JobUI_Dark(props) {
    const pathname = usePathname()
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [activeTab, setActiveTab] = useState(pathname);
    const drawerWidth = 240;

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex', position: 'relative', marginTop:"25px" }}>

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
                {/* <JobsTableSection res={props?.res} /> */}
                <JobsTableSection_Dark res={props?.res} />
            </Box>
        </Box >
    );
}