import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

type Token = {
	name: string;
	email: string;
	sub: string;
	accessToken: string;
	refreshToken: string;
	username: string;
	accessTokenExpies: number;
	iat: number;
	exp: number;
	jti: string;
};

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
	// Token will exist once user is logged in
	const token = await getToken({ req, secret: process.env.JWT_SECRET });
	// get pathname from nextUrl
	const { pathname } = req.nextUrl;
	// allow the request if below is true
	// 1) Its a request for next-auth session & provider fetching
	// 2) Token exist
	if (pathname.includes('/api/auth') || token) {
		return NextResponse.next();
	}

	// redirect them to login if they dont have token AND are requesting a protected route
	if (!token && pathname !== '/login') {
		return NextResponse.redirect('/login');
	}
}
