
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Authentication cookie
  const token =
    request.cookies.get("accessToken")?.value ??
    request.cookies.get("token")?.value;

  // Logged-in user opening the home page
  if (pathname === "/" && token) {
    // If role is stored in a cookie, use it to redirect
    const role = request.cookies.get("role")?.value?.toUpperCase();

    const dashboardPath =
      role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
