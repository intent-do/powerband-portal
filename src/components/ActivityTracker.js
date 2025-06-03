'use client'
import { useEffect } from 'react';

export default function ActivityTracker({ userId }) {
    useEffect(() => {
        const updateLastActive = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/lastactive`, {
                // await fetch(`http://portal.powerbandelectrical.com.au/api/lastactive`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
        };

        const interval = setInterval(updateLastActive, 1 * 60 * 1000); // Update every 1 minutes

        return () => clearInterval(interval);
    }, [userId]);

    return null;
}