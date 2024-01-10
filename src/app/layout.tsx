import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { SideNav } from "./_components/sideNav";
import NextAuthProvider from "./context/nextAuthProvider";
import { TRPCReactProvider } from "~/trpc/react";
import { cookies } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata = {
  title: "Twitter",
  description: "a twitter clone",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`container mx-auto flex bg-[#282a36] font-sans text-white ${inter.variable}`}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <NextAuthProvider>
            <SideNav />
            <div className="min-h-screen flex-grow border-x border-x-[#1c1f26]">
              {children}
            </div>
          </NextAuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
