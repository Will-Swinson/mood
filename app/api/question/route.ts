import { qa } from "@/utils/ai";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  // Takes in the body of the request and destructures the question from it
  const { question } = await request.json();
  // Grabs the current users info
  const user = await getUserByClerkID();
  // Makes a query to the database to grab all the entries for the current user
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    // Selecting only the neccessary fields
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  // Feeding the question and all the entries to our AI qa function
  console.log("QUESTION:", question);
  const answer = await qa(question, entries);
  console.log("ANSWER:", answer);
  // Returning the answer to the client
  return NextResponse.json({ data: answer });
}
