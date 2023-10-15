import { PrismaClient } from "@prisma/client";

//This logic is to prevent hot reloading from creating new instances of Prisma in development

// You take the globalThis object and cast it to unknown and then to the type you want to use it as.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
// this code will then make a prisma varibale that is either the existing prisma instance or a new one based on if you made on already or not. and then export it
export const prisma =
  // checks the globalThis object to see if it has a prisma instance already
  globalForPrisma.prisma ??
  // if it does not have a prisma instance it will create a new one
  new PrismaClient({
    log: ["query"],
  });

// Then if we are not in production we set the globalThis object to have the prisma instance
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
