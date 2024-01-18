import InfiniteScroll from "react-infinite-scroll-component";
import { VscHeartFilled, VscHeart } from "react-icons/vsc";

export type Tweet = {
  id: string;
  text: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: {
    id: string | null;
    name: string | null;
    image: string | null;
  };
};
type InfiniteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  tweets?: Tweet[];
  fetchNextPage: () => Promise<unknown>;
};

export function InfiniteTweetList({
  isLoading,
  isError,
  tweets,
  fetchNextPage,
  hasMore,
}: InfiniteTweetListProps) {
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (tweets == null || tweets.length === 0) return <div>No tweets</div>;

  return (
    <InfiniteScroll
      dataLength={tweets.length}
      next={fetchNextPage}
      loader={"Loading..."}
      hasMore={hasMore}
    >
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </InfiniteScroll>
  );
}

import { ProfilePicture } from "./profilePicture";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { IconType } from "react-icons";
import { api } from "~/trpc/react";

export function TweetCard({ tweet }: { tweet: Tweet }) {
  const utils = api.useUtils();
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess({ addedLike }) {
      const updateLikeValue = addedLike ? 1 : -1;

      utils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        console.log(oldData);
        if (oldData == null) return;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            tweets: page.tweets.map((t) =>
              tweet.id == t.id
                ? {
                    ...t,
                    likeCount: t.likeCount + updateLikeValue,
                    likedByMe: addedLike,
                  }
                : t,
            ),
          })),
        };
      });
    },
  });
  function handleLike() {
    toggleLike.mutate({ id: tweet.id });
  }
  return (
    <li className="flex gap-4 border-b border-b-greyborder p-4">
      <Link href={`/profile/${tweet.user.id}`}>
        <ProfilePicture src={tweet.user.image} />
      </Link>
      <div className="flex flex-grow flex-col gap-2">
        <div className="flex gap-2">
          <Link
            className=" font-bold underline-offset-2 hover:underline"
            href={`/profile/${tweet.user.id}`}
          >
            {tweet.user.name}
          </Link>
          <span className="text-gray-500"> · </span>
          <span className="text-gray-500">
            {`${tweet.createdAt.getDay()}/${tweet.createdAt.getMonth()}/${tweet.createdAt.getFullYear()}`}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{tweet.text}</p>
        <HeartButton
          onClick={handleLike}
          likeCount={tweet.likeCount}
          likedByMe={tweet.likedByMe}
        />
      </div>
    </li>
  );
}
type HeartButtonProps = {
  likedByMe: boolean;
  likeCount: number;
  onClick: () => void;
};

type ButtonHoverEffectProps = {
  children: React.ReactNode;
  red?: boolean;
};

export function ButtonHoverEffect({
  children,
  red = false,
}: ButtonHoverEffectProps) {
  const colorClass = red
    ? "group-hover:bg-red-500 group-hover:bg-opacity-20 hover:bg-red-500 hover:bg-opacity-20"
    : "group-hover:bg-gray-200 group-hover:bg-opacity-20 hover:bg-gray-200 hover:bg-opacity-20";
  return (
    <div
      className={`-m-2 rounded-full p-2 transition-colors duration-200 ${colorClass}`}
    >
      {children}
    </div>
  );
}

export function HeartButton({
  likedByMe = false,
  likeCount,
  onClick,
}: HeartButtonProps) {
  "use client";
  const session = useSession();

  const HeartIcon: IconType = likedByMe
    ? (VscHeartFilled as IconType)
    : (VscHeart as IconType);
  if (session.status !== "authenticated")
    return (
      <div className="flex items-center justify-center self-start text-gray-500">
        <HeartIcon />
        <span className="ml-1">{likeCount}</span>
      </div>
    );
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-center gap-1 self-start transition-colors duration-200  ${
        likedByMe
          ? "text-red-500"
          : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
      }`}
    >
      <ButtonHoverEffect red>
        <HeartIcon
          className={`transition-colors duration-200  ${
            likedByMe
              ? "fill-red-500"
              : "fill-gray-500 group-hover:fill-red-500"
          }`}
        />
      </ButtonHoverEffect>
      <span>{likeCount}</span>
    </button>
  );
}
