'use client';
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (userId) {
        router.push("/dashboard");
      } else {
        router.push("/landing");
      }
    }
  }, [isLoaded, userId, router]);

  return (
    <div>
      Redirecting...
    </div>
  );
}
