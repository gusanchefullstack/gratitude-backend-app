import { prisma } from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { DatabaseError } from "../utils/errors.js";

type TagCount = {
  name: string;
  count: number;
};

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

const calculateCurrentStreak = (dates: Date[]) => {
  if (dates.length === 0) {
    return 0;
  }

  const uniqueDays = Array.from(new Set(dates.map(toIsoDate))).sort((a, b) =>
    a < b ? 1 : -1,
  );

  const todayIso = toIsoDate(new Date());
  const yesterdayIso = toIsoDate(new Date(Date.now() - 86_400_000));

  // Streak starts only if user has a gratitude for today or yesterday.
  if (uniqueDays[0] !== todayIso && uniqueDays[0] !== yesterdayIso) {
    return 0;
  }

  let streak = 1;

  for (let i = 1; i < uniqueDays.length; i += 1) {
    const previousDate = new Date(`${uniqueDays[i - 1]}T00:00:00.000Z`);
    const currentDate = new Date(`${uniqueDays[i]}T00:00:00.000Z`);
    const dayDiff =
      (previousDate.getTime() - currentDate.getTime()) / 86_400_000;

    if (dayDiff === 1) {
      streak += 1;
      continue;
    }

    break;
  }

  return streak;
};

const buildTopTags = (tagsLists: string[][], limit = 5): TagCount[] => {
  const counts = new Map<string, number>();

  for (const tags of tagsLists) {
    for (const tag of tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
};

export const readDashboardSummarySvc = async (userId: string) => {
  try {
    const [totalGratitudes, recentGratitudes, allTagsAndDates] =
      await prisma.$transaction([
        prisma.gratitude.count({
          where: { userId },
        }),
        prisma.gratitude.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            createdAt: true,
            tags: true,
          },
        }),
        prisma.gratitude.findMany({
          where: { userId },
          select: {
            createdAt: true,
            tags: true,
          },
        }),
      ]);

    const currentStreak = calculateCurrentStreak(
      allTagsAndDates.map((item) => item.createdAt),
    );
    const topTags = buildTopTags(allTagsAndDates.map((item) => item.tags));

    return {
      status: "Ok",
      data: {
        totalGratitudes,
        currentStreak,
        topTags,
        recentGratitudes,
      },
      items: 1,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError("Failed to retrieve dashboard summary", error.code);
    }

    throw error;
  }
};
