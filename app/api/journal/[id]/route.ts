import { analyze } from "@/utils/ai";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(request: Request, { params: { id } }: Params) {
  const { content } = await request.json();
  const user = await getUserByClerkID();
  const updatedEntry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    data: {
      content,
    },
  });

  // // OPTION 1 OF UPDATING ANALYSIS
  // // analyze the new updated entry
  // const updatedAnalysis = await analyze(updatedEntry.content);
  // // then we want to save the analysis to the database and return the updated analysis
  // console.log("UPDATED ENTRY:", updatedEntry.id);
  // await prisma.analysis.update({
  //   where: {
  //     journalEntryId: updatedEntry.id,
  //   },
  //   data: {
  //     ...updatedAnalysis,
  //   },
  // });

  // // OPTION 2 OF UPDATING ANALYSIS
  // // then we want to save the analysis to the database and return the updated analysis
  // console.log("UPDATED ENTRY:", updatedEntry.id);
  // await prisma.analysis.update({
  //   where: {
  //     journalEntryId: updatedEntry.id,
  //   },
  //   data: {
  //     // updating the analysis with the new analysis
  //     // using instant destructuring with await
  //     ...(await analyze(updatedEntry.content)),
  //   },
  // });

  // OPTION 3 OF UPDATING ANALYSIS
  // then we want to save the analysis to the database and return the updated analysis

  // using the upsert method to update the analysis which will give a default to update with if nothing is found at that id or where clause
  const updatedAnalysis = await analyze(updatedEntry.content);

  const updated = await prisma.analysis.upsert({
    where: {
      journalEntryId: updatedEntry.id,
    },
    create: {
      // updating the analysis with the new analysis
      // using instant destructuring with await
      userId: user.id,
      journalEntryId: updatedEntry.id,
      ...updatedAnalysis,
    },
    update: updatedAnalysis,
  });
  console.log("UPDATED ANALYSIS:", updated);

  return NextResponse.json({ data: { ...updatedEntry, analysis: updated } });
}
