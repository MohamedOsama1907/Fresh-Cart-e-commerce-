import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PAGES = ["/login", "/signup"];
const PROTECTED_PREFIXES = ["/profile", "/orders", "/myorders"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value?.trim();
  const hasToken = Boolean(token && token !== "undefined" && token !== "null");

  const isAuthPage = AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`),
  );

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  // Authenticated user attempting to access auth pages (/login, /signup) -> redirect to '/'
  if (hasToken && isAuthPage) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  // Unauthenticated user attempting to access protected routes -> redirect to '/login'
  if (!hasToken && isProtectedRoute) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/orders/:path*",
    "/myorders/:path*",
    "/login",
    "/signup",
  ],
};
