import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { IUserFirebase } from "@/types/types";

export async function middleware(request: NextRequest) {
	const userCookie = request.cookies.get("userDB")?.value;
	const decoder = userCookie && decodeURIComponent(userCookie);
	const user: IUserFirebase | null = decoder ? JSON.parse(decoder) : null;

	const pathRegExp =
		/^\/(completed|admin-panel|watching|postponed|dropped|profile|profile\/[^/]*|profile-edit|messages|friends)(\/|$)/;

	if (!userCookie && pathRegExp.test(request.nextUrl.pathname)) {
		return NextResponse.redirect(new URL("/auth/signin", request.url));
	}

	if (userCookie && request.nextUrl.pathname.startsWith("/auth")) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (user && request.nextUrl.pathname.startsWith("/admin-panel")) {
		if (!user.access || user.access < 1) {
			return NextResponse.redirect(new URL("/no-rights", request.url));
		}
	}
}

export const config = {
	matcher: [
		"/completed",
		"/watching",
		"/postponed",
		"/dropped",
		"/profile",
		"/profile/:path*",
		"/profile-edit",
		"/messages",
		"/friends",
		"/admin-panel",
		"/auth/:path*",
	],
};
