import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Timestamp } from "firebase/firestore";

interface ICookieProps {
	name: string;
	access: number;
	blocked: { endBan: Timestamp } | null;
}

export function middleware(request: NextRequest) {
	const userCookie = request.cookies.get("userDB")?.value;
	const decoder = userCookie && decodeURIComponent(userCookie);
	const user: ICookieProps | null = decoder ? JSON.parse(decoder) : null;

	const pathRegExp =
		/^\/(|admin-panel|my-list|profile|profile\/[^/]*|profile-edit|messages|friends)(\/|$)/;

	if (!user && pathRegExp.test(request.nextUrl.pathname)) {
		return NextResponse.rewrite(new URL("/auth/signin", request.url));
	}

	if (user) {
		if (request.nextUrl.pathname.startsWith("/auth")) {
			return NextResponse.rewrite(new URL("/", request.url));
		}
		if (request.nextUrl.pathname.startsWith("/admin-panel") && (!user.access || user.access < 1)) {
			return NextResponse.rewrite(new URL("/no-rights", request.url));
		}

		if (pathRegExp.test(request.nextUrl.pathname) && user.blocked?.endBan) {
			const userEndBan = user.blocked.endBan.seconds;
			const dateNow = Timestamp.now().seconds;
			if (userEndBan > dateNow) {
				return NextResponse.rewrite(new URL(`/ban-details/${user.name}`, request.url));
			}
		}
	}
}

export const config = {
	matcher: [
		"/my-list/:path*",
		"/profile/:path*",
		"/profile-edit",
		"/messages",
		"/friends",
		"/admin-panel",
		"/auth/:path*",
	],
};
