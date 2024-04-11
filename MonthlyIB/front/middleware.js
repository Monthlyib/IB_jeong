export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/about/:path*", "/mypage"], //protect when not logged in
};
