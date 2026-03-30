import { NextResponse } from "next/server";
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)"],
};

const protectedRoutes = ["/mypage"];
const publicRoutes = ["/login", "/signup", "/find"];
const adminRoutes = ["/adminpage"];

const matchesRoute = (currentPath, routes) =>
  routes.some(
    (route) => currentPath === route || currentPath.startsWith(`${route}/`)
  );

export async function middleware(req) {
  const token = req.cookies.get("accessToken")?.value;
  const authority = req.cookies.get("authority")?.value;

  const currentPath = req.nextUrl.pathname;

  if (!token && matchesRoute(currentPath, protectedRoutes)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (matchesRoute(currentPath, adminRoutes) && (!token || authority !== "ADMIN")) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (token && matchesRoute(currentPath, publicRoutes)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
