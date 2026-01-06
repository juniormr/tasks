import { type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
   const url = request.nextUrl.clone();

   // Only protect dashboard routes
   if (url.pathname.startsWith("/dashboard")) {
      return null; // Let client-side handle auth
   }

   return null;
}

export const config = {
   matcher: ["/dashboard/:path*"],
};
