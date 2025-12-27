"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isSessionExpired } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (isSessionExpired) {
      toast({
        title: "Session Expired",
        description: "Your session has expired due to inactivity. Please log in again.",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [isSessionExpired, router, toast]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf7]">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-[#e6b756] border-t-[#181c23] rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
