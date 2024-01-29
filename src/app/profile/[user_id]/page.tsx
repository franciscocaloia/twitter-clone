import Image from "next/image";
import { VscAccount } from "react-icons/vsc";
import { api } from "~/trpc/server";
import FollowButton from "./components/FollowButton";

export default function Page({ user_id }) {
  const profile = await api.user.getById.query({ id: user_id });
  if (profile === null) return;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      <h2>{profile.name}</h2>
      <h2>{profile.tweets}</h2>
      <h2>followers:{profile.followers}</h2>
      <h2>following: {profile.following}</h2>
      <FollowButton profile={profile} />
      {profile.image ? (
        <Image
          width={100}
          height={100}
          src={profile.image}
          alt="profile picture"
        />
      ) : (
        <VscAccount className="h-6 w-6" />
      )}
    </main>
  );
}
