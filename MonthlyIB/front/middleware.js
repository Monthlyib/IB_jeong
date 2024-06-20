import { NextResponse } from "next/server";
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)"],
};

const protectedRoutes = ["/mypage"];
const publicRoutes = ["/login", "/signup", "/find"];
const adminRoutes = ["/adminpage"];

export async function middleware(req) {
  const token = req.cookies.get("accessToken")?.value;
  const authority = req.cookies.get("authority")?.value;

  const currentPath = req.nextUrl.pathname;

  if (!token && protectedRoutes.includes(currentPath)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (!token && adminRoutes.includes(currentPath) && authority !== "ADMIN") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (token && publicRoutes.includes(currentPath)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
