import { NextRequest, NextResponse } from "next/server";
import { getUser, updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest, response: NextResponse) {
  const protectedRoutesList = ["/nuevo"],
    authRoutesList = ["/", "/login", "/sign-up"];
  const currentPath = new URL(request.url).pathname;

  const {
    data: { user },
  } = await getUser(request, response);
  if (protectedRoutesList.includes(currentPath) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (authRoutesList.includes(currentPath) && user) {
    return NextResponse.redirect(new URL("/rendiciones", request.url));
  }
  await updateSession(request);
}
export const config = {
  matcher: [
    
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
};
