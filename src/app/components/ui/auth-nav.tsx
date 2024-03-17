"use client";
import React from "react";
import { trpc } from "~/trpc/trpc";
import { toast } from "sonner";
import queryClient from "~/trpc/query-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthMenu({username}: {username: string}) {
  const router = useRouter();

  const { mutate: logoutFn } = trpc.logoutUser.useMutation({
    onError(error) {
      toast.error(error.message);
      console.log("Error message:", error.message);
    },
    onSuccess() {
      queryClient.clear();
      toast.success("logout successful");
      router.push("/login");
    },
  });

  return (
    <>
      {" "}
      <p>Hi, {username}</p>
      <button className="cursor-pointer" onClick={() => logoutFn()}>
        Logout
      </button>
    </>
  );
}
