import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If authenticated user tries to visit login/signup, redirect to dashboard
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
                       req.nextUrl.pathname.startsWith("/signup");

    if (isAuthPage && req.nextauth.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only run middleware if user is NOT authenticated AND trying to access a protected route
      authorized({ token, req }) {
        const isProtected =
          req.nextUrl.pathname.startsWith("/dashboard") ||
          req.nextUrl.pathname.startsWith("/workout")  ||
          req.nextUrl.pathname.startsWith("/progress") ||
          req.nextUrl.pathname.startsWith("/formcheck")||
          req.nextUrl.pathname.startsWith("/profile");

        if (isProtected) return !!token;
        return true;
      },
    },
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workout/:path*",
    "/progress/:path*",
    "/formcheck/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
  ],
};
