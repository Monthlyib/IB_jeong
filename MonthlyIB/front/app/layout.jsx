import "@/styles/global.css";

import Footer from "@/components/layoutComponents/Footer";
import AppLayout from "@/components/layoutComponents/AppLayout";


export const metadata = {
  title: "Monthly IB",
  description: "Generated by Next.js",
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <body>
          <AppLayout />
          {children}
          <Footer />
        </body>
      </html>
    </>
  );
}
