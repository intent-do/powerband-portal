import { NextResponse } from 'next/server';

export function middleware(req) {
    const userId = req.cookies.get('userId')?.value;

    if (userId) {
        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/lastactive`, {
        // fetch(`http://portal.powerbandelectrical.com.au/api/lastactive`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        }).catch(console.error);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/dashboard/:path*', // Apply only to dashboard routes
};
