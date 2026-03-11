import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthenticationError } from "../../src/utils/errors.js";

const prismaMock = {
  user: {
    create: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
  },
  refreshSession: {
    create: vi.fn(),
    findFirst: vi.fn(),
    updateMany: vi.fn(),
    update: vi.fn(),
  },
  $transaction: vi.fn(),
};

vi.mock("../../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

vi.mock("../../src/utils/passwords.js", () => ({
  hashPasswords: vi.fn().mockResolvedValue("hashed-password"),
  comparePasswords: vi.fn().mockResolvedValue(true),
}));

vi.mock("../../src/utils/jwt.js", () => ({
  issueTokenPair: vi.fn().mockResolvedValue({
    accessToken: "access-token",
    refreshToken: "refresh-token",
  }),
  verifyRefreshToken: vi
    .fn()
    .mockResolvedValue({ id: "user-1", exp: Math.floor(Date.now() / 1000) + 600 }),
}));

describe("authServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.$transaction.mockImplementation(async (ops: unknown[]) =>
      Promise.all(ops as Promise<unknown>[]),
    );
  });

  it("registerUser returns user and token pair", async () => {
    prismaMock.user.create.mockResolvedValue({
      id: "user-1",
      username: "demo",
      firstName: "Demo",
      lastName: "User",
      email: "demo@example.com",
    });
    prismaMock.refreshSession.create.mockResolvedValue({ id: "session-1" });

    const { registerUser } = await import("../../src/services/authServices.js");

    const result = await registerUser({
      username: "demo",
      password: "PlainPassword123!",
      firstName: "Demo",
      lastName: "User",
      email: "demo@example.com",
    });

    expect(result.newUser.email).toBe("demo@example.com");
    expect(result.accessToken).toBe("access-token");
    expect(result.refreshToken).toBe("refresh-token");
    expect(prismaMock.refreshSession.create).toHaveBeenCalledTimes(1);
  });

  it("refreshAuthSession throws when no active refresh session exists", async () => {
    prismaMock.refreshSession.findFirst.mockResolvedValue(null);

    const { refreshAuthSession } = await import("../../src/services/authServices.js");

    await expect(refreshAuthSession("missing-token")).rejects.toBeInstanceOf(
      AuthenticationError,
    );
  });
});
