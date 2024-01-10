"use client";
import { useSession } from "next-auth/react";
import { Button } from "./button";
import { ProfilePicture } from "./profilePicture";
import { api } from "~/trpc/react";
import { useLayoutEffect, useRef, useState } from "react";
import type { User } from "@prisma/client";

type NewTweetFormProps = {
  user: User;
};

function UpdateTextAreaHeight(textarea: HTMLTextAreaElement | null) {
  if (!textarea) return;
  textarea.style.height = "1px";
  textarea.style.height = textarea.scrollHeight + "px";
}

export const NewTweetForm = ({ user }: NewTweetFormProps) => {
  const [tweetValue, setTweetValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const tweetMutation = api.tweet.create.useMutation({
    onSuccess: () => {
      setTweetValue("");
    },
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    tweetMutation.mutate({ text: tweetValue });
  };

  useLayoutEffect(() => {
    UpdateTextAreaHeight(textAreaRef.current);
  }, [tweetValue]);
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b border-b-greyborder px-4 py-2"
    >
      <div className="flex">
        <ProfilePicture src={user.image} />
        <textarea
          ref={textAreaRef}
          rows={1}
          placeholder="What's happening?"
          name="text"
          value={tweetValue}
          className="flex-grow resize-none overflow-hidden border-b border-b-greyborder bg-greybg p-4 text-lg outline-none"
          onChange={(e) => setTweetValue(e.target.value)}
        />
      </div>
      <Button className="self-end">Postear</Button>
    </form>
  );
};

export const NewTweet = () => {
  const session = useSession();
  if (session.status !== "authenticated") return null;

  return <NewTweetForm user={session.data.user as User} />;
};
