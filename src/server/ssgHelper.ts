import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "./api/root";
import { db } from "./db";
import superjson from "superjson";
import { cookies } from "next/headers";

const createInnerTRPCContext = () => {
  return {
    db,
    session: null,
    headers: new Headers({
      cookie: cookies().toString(),
      "x-trpc-source": "rsc",
    }),
  };
};

export const ssgHelpers = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext(),
    transformer: superjson, // optional - adds superjson serialization
  });
