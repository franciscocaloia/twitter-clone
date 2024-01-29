"use client";

import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

type FollowButtonProps = {
  profile: {
    id: string;
    name: string | null;
    image: string | null;
    followers: number;
    following: number;
    tweets: number;
    isFollowing: boolean;
  };
};

export default function FollowButton({ profile }: FollowButtonProps) {
  const session = useSession();
  const utils = api.useUtils();
  const followUser = api.user.followUser.useMutation({
    onSuccess: async ({ followed }) => {
      utils.user.getById.setData({ id: profile.id }, (oldData) => {
        if (oldData == null) return null;

        return {
          id: oldData.id,
          name: oldData.name,
          image: oldData.image,
          tweets: oldData.tweets,
          following: oldData.following,
          followers: oldData.followers + (followed ? 1 : -1),
          isFollowing: followed,
        };
      });
    },
  });
  if (session.status !== "authenticated" || session.data.user.id === profile.id)
    return null;
  return (
    <button onClick={() => followUser.mutate({ id: profile.id })}>
      {profile.isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
