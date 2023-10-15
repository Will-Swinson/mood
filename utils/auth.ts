import { auth } from "@clerk/nextjs";
import { prisma } from "./db";

export async function getUserByClerkID() {
  const { userId } = await auth();
  const user = await prisma.user.findUniqueOrThrow({
    where: { clerkId: userId },
  });
  return user;
}
