import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    JWT_SECRET: z.string(),
    MAILTRAP_USER: z.string(),
    MAILTRAP_PASS: z.string(),
  },
  client: {
    NEXT_PUBLIC_VERCEL_URL: z.string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    MAILTRAP_USER: process.env.MAILTRAP_USER,
    MAILTRAP_PASS: process.env.MAILTRAP_PASS,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
