import Spinner from "@/components/Spinner";

import { prisma } from "@/utils/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function createNewUser() {
  const user = await currentUser();
  console.log(user);
  const match = await prisma.user.findUnique({
    where: {
      clerkId: user.id as string,
    },
  });

  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user?.emailAddresses[0].emailAddress,
      },
    });
  }

  redirect("/journal");
}

export default async function NewUserPage() {
  await createNewUser();
  return <Spinner />;
}
