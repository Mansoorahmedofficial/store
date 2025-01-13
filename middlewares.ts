import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if(pathname.startsWith("/api/webhook")){
          return true
        }
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/loging" ||
          pathname === "/register"
        ) {
          return true;
        }
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }
        return !!token;
      },
    },
  }
);

export const config = { matcher: ["/admin"] };
