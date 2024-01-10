"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

export const SideNav = () => {
  const session = useSession();

  return (
    <nav className="sticky top-0 px-2 py-4">
      <ul className="">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href={`/profile/${session.data?.user.id}`}>Profile</Link>
        </li>
        <li>
          {session.status === "authenticated" ? (
            <button onClick={() => signOut()}>LogOut</button>
          ) : (
            <button onClick={() => signIn()}>LogIn</button>
          )}
        </li>
      </ul>
    </nav>
  );
};
