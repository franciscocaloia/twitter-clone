"use client";
import { api } from "~/trpc/react";
import { InfiniteTweetList } from "./infiniteTweetList";

export default function RecentTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isLoading={tweets.isLoading}
      isError={tweets.isError}
      hasMore={tweets.hasNextPage ?? false}
      fetchNextPage={tweets.fetchNextPage}
    />
  );
}
