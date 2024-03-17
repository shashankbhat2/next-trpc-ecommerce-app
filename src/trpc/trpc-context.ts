import { deserializeUser } from "~/server/middleware/auth-middleware";

export const createTRPCContext = async () => deserializeUser();

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
