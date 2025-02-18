'use client';
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  }, [userId, router]);

  return (
    <div>
      Redirecting ...
    </div>
  );
}
