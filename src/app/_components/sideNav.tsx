"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { ButtonHoverEffect } from "./infiniteTweetList";
import { VscAccount, VscHome, VscSignIn, VscSignOut } from "react-icons/vsc";

export const SideNav = () => {
  const session = useSession();

  return (
    <nav className="sticky top-0 px-2 py-4">
      <ul className="m-2 flex flex-col gap-4">
        <li>
          <Link href="/">
            <ButtonHoverEffect>
              <span className="flex items-center gap-4">
                <VscHome className="h-6 w-6 " />
                <span className="hidden text-lg md:inline">Home</span>
              </span>
            </ButtonHoverEffect>
          </Link>
        </li>
        {session.data?.user && (
          <li>
            <Link href={`/profile/${session.data?.user.id}`}>
              <ButtonHoverEffect>
                <span className="flex items-center gap-4">
                  <VscAccount className="h-6 w-6" />
                  <span className="hidden text-lg md:inline">Profile</span>
                </span>
              </ButtonHoverEffect>
            </Link>
          </li>
        )}
        <li>
          {session.status === "authenticated" ? (
            <button onClick={() => signOut()}>
              <ButtonHoverEffect>
                <span className="flex items-center gap-4">
                  <VscSignOut className="h-6 w-6" />
                  <span className="hidden text-lg md:inline">LogOut</span>
                </span>
              </ButtonHoverEffect>
            </button>
          ) : (
            <button onClick={() => signIn()}>
              <ButtonHoverEffect>
                <span className="flex items-center gap-4">
                  <VscSignIn className="h-6 w-6 " />
                  <span className="hidden text-lg md:inline">LogIn</span>
                </span>
              </ButtonHoverEffect>
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};
