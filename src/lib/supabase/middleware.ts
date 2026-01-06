import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
   let response = NextResponse.next({
      request: {
         headers: request.headers,
      },
   });

   const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
         getAll() {
            return request.cookies.getAll();
         },
         setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
            response = NextResponse.next({
               request: {
                  headers: request.headers,
               },
            });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
         },
      },
   });

   const {
      data: { user },
   } = await supabase.auth.getUser();

   const isLoginPage = request.nextUrl.pathname === "/login";

   if (!user && !isLoginPage) {
      return NextResponse.redirect(new URL("/login", request.url));
   }

   if (user && isLoginPage) {
      return NextResponse.redirect(new URL("/", request.url));
   }

   return response;
}
