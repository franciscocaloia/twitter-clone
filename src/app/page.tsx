import { NewTweet } from "./_components/newTweetForm";
import RecentTweets from "./_components/recentTweets";

export default async function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-b-[#1c1f26]">
        <h1 className="my-2 px-4">Home</h1>
      </header>
      <NewTweet />
      <RecentTweets />
    </>
  );
}
