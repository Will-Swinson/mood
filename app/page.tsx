import Link from "next/link";
import { auth } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();

  let href = userId ? "/journal" : "/new-user";
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-black text-white">
      <div className="w-full max-w-[600px] mx-auto">
        <h1 className="text-6xl mb-4">The best journal app, period.</h1>
        <p className="text-2xl text-white/60 mb-4">
          This is the best app for tracking your mood through your life. All you
          have to do is be honest.
        </p>
        <Link href={href}>
          <button className="rounded-lg bg-blue-600 py-2 px-4 text-xl">
            get started
          </button>
        </Link>
      </div>
    </div>
  );
}
