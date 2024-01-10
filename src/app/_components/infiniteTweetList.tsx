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

export function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <li className="flex gap-4 border-b border-b-greyborder p-4">
      <Link href={`/profile/${tweet.user.id}`}>
        <ProfilePicture src={tweet.user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
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
        <HeartButton likeCount={tweet.likeCount} likedByMe={tweet.likedByMe} />
      </div>
    </li>
  );
}
type HeartButtonProps = {
  likedByMe: boolean;
  likeCount: number;
};

export function HeartButton({ likedByMe, likeCount }: HeartButtonProps) {
  "use client";
  const session = useSession();
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;
  if (session.status !== "authenticated")
    return (
      <div className="text-gray-500 flex items-center justify-center">
        <HeartIcon />
        <span className="ml-1">{likeCount}</span>
      </div>
    );
  return (
    <div className="text-gray-500 flex items-center justify-center">
      <HeartIcon />
      <span className="ml-1">{likeCount}</span>
    </div>
  );
}
