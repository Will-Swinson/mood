import Editor from "@/components/Editor";
import { analyze } from "@/utils/ai";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";

interface Params {
  params: {
    id: string;
  };
}
export interface Entry {
  entry: {
    id: string;
    content: string;
    createdAt: number | string | Date;
    updatedAt: number | string | Date;
    userId: string;
  } | null;
}

async function getEntry(id: string) {
  const user = await getUserByClerkID();
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  });

  return entry;
}

// async function getAnalysis(id: string) {
//   // take the id from params
//   // get the analysis from the db where the id matches the journal id
//   const analysisData = await prisma.analysis.findUnique({
//     where: {
//       journalEntryId: id,
//     },
//   });
//   console.log(analysisData);
//   // return the analysis data
//   return analysisData;
// }

export default async function EntryPage({ params: { id } }: Params) {
  const entry = await getEntry(id);
  
  return (
    <div className="w-full h-full  ">
      <Editor entry={entry} />
    </div>
  );
}
