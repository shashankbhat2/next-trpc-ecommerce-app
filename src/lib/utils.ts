import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const maskEmail = (email: string) => {
  const [username, domain] = email.split("@");
  let maskedUsername = "";

  if (username!.length < 4) {
    maskedUsername = "*".repeat(username!.length) + "@" + domain;
  }

  maskedUsername = username?.slice(0, -3) + "***" + "@" + domain;

  return maskedUsername;
};
