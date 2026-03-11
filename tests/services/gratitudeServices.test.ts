import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  gratitude: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
  $transaction: vi.fn(),
};

vi.mock("../../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

describe("gratitudeServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.$transaction.mockImplementation(async (ops: unknown[]) =>
      Promise.all(ops as Promise<unknown>[]),
    );
  });

  it("readAllGratitudesSvc returns paginated payload", async () => {
    prismaMock.gratitude.findMany.mockResolvedValue([
      {
        id: "g-1",
        title: "Grateful for friends",
        details: "A good conversation helped today.",
        tags: ["friends"],
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    prismaMock.gratitude.count.mockResolvedValue(3);

    const { readAllGratitudesSvc } = await import(
      "../../src/services/gratitudeServices.js"
    );

    const result = await readAllGratitudesSvc("user-1", {
      page: 1,
      limit: 2,
      search: "friends",
      tag: "friends",
      sortBy: "createdAt",
      order: "desc",
    });

    expect(result.status).toBe("Ok");
    expect(result.items).toBe(1);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 2,
      totalItems: 3,
      totalPages: 2,
    });
    expect(prismaMock.gratitude.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.gratitude.count).toHaveBeenCalledTimes(1);
  });
});
