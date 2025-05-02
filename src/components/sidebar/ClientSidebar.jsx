'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

const ClientSidebar = ({ open, drawerWidth = 240 }) => {
    const pathname = usePathname();

    return <Sidebar open={open} drawerWidth={drawerWidth} />;
};

export default ClientSidebar; 