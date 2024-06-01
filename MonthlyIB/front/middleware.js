export { default } from "next-auth/middleware";

// admin page 추가하기 -> 검색해야됨

export const config = {
  matcher: ["/about/:path*"], //protect when not logged in
};
