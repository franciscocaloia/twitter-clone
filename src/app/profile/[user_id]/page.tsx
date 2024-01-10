"use client";
import { useSession } from "next-auth/react";

export default function Page() {
  const session = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      {session.data?.user.name}
    </main>
  );
}
