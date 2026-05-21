import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export async function requireUserId() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("UNAUTHENTICATED");
  }

  const user = await currentUser();
  const email = user?.emailAddresses.at(0)?.emailAddress ?? `${userId}@cutmode.local`;
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || null;

  const profile = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email,
      name,
      imageUrl: user?.imageUrl ?? null
    },
    create: {
      clerkId: userId,
      email,
      name,
      imageUrl: user?.imageUrl ?? null,
      goal: {
        create: {
          calorieTarget: 2050,
          proteinTarget: 130,
          tenDayDeficitGoal: 5000,
          activityLevel: "MODERATE"
        }
      }
    }
  });

  return profile.id;
}

export function isUnauthenticatedError(error: unknown) {
  return error instanceof Error && error.message === "UNAUTHENTICATED";
}
