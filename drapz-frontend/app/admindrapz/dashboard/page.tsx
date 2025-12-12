"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {HeaderAdmin} from "@/components/headAdmin";

export default function AdminDashboardPage() {
  const { isAdmin, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/");
    }
  }, [isAdmin, loading, isAuthenticated, router]);

  if (loading || !isAuthenticated || !isAdmin) {
    return <p>Loading or redirecting...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p className="mt-4 text-lg">Welcome to the admin dashboard!</p>
    </div>
  );
}
