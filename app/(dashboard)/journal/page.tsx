import EntryCard from "@/components/EntryCard";
import NewEntryCard from "@/components/NewEntryCard";
import Question from "@/components/Question";
import { analyze } from "@/utils/ai";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { revalidatePath } from "next/cache";
import Link from "next/link";

async function getEntries() {
  const user = await getUserByClerkID();
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      analysis: true,
    },
  });

  return entries;
}

export default async function JournalPage() {
  const entries = await getEntries();
  return (
    <div className="h-screen w-screen bg-zinc-400/10">
      <div className="p-10">
        <h2 className="text-3xl mb-8 ">Journal</h2>
        <div className="m-2">
          <Question />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <NewEntryCard />
          {entries.map((entry) => (
            <Link href={`/journal/${entry.id}`} key={entry.id}>
              <EntryCard entry={entry} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
