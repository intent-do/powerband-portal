'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, isTokenExpired, setCookie } from "@/helper/functions";
import { usePathname } from 'next/navigation'

const HomePage = () => {
    const router = useRouter();

    const pathname = usePathname()
    useEffect(() => {
        const payload = getCookie("payload");

        if (payload) {
            const { accessToken } = JSON?.parse(payload);
            if (!accessToken || isTokenExpired(accessToken)) {
                router.push("/login");  // If no token or token expired, redirect to login
                setCookie('payload', '', 7);
            }
        }
        else {
            router.push("/login")
        }
    }, [router]);

    return (
        <></>
    );
};

export default HomePage;