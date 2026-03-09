'use client';

import { Shimmer } from "shimmer-from-structure";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { ShieldCheck, Lock } from "lucide-react";

/**
 * Loading component for the buyer file page (d/[id]).
 * Uses shimmer-from-structure to provide a smooth loading transition
 * that matches the LockedFile component layout.
 */
export default function Loading() {
  return (
    <Shimmer shimmerColor="rgba(59, 130, 246, 0.05)">
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground pb-20">
        <div className="w-full max-w-md space-y-8">

          {/* Header Placeholder - Matches StarDrop logo and subtitle */}
          <div className="text-center space-y-2">
            <div className="h-9 w-40 bg-white/10 rounded-lg mx-auto mb-2" />
            <div className="h-4 w-48 bg-white/5 rounded mx-auto" />
          </div>

          {/* LockedFile Placeholder Card */}
          <Card className="w-full max-w-md mx-auto bg-[#1c1c1e] text-white border-none shadow-2xl">
            <CardHeader className="text-center pb-2">
              {/* Icon placeholder */}
              <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6">
                <div className="w-8 h-8 rounded bg-blue-500/20" />
              </div>
              {/* Filename placeholder */}
              <div className="h-6 w-3/4 bg-white/10 rounded mx-auto mb-2" />
              {/* Size placeholder */}
              <div className="h-4 w-20 bg-white/5 rounded mx-auto" />
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="text-center space-y-2">
                {/* Price placeholder */}
                <div className="h-9 w-24 bg-white/10 rounded mx-auto" />
                {/* Status placeholder */}
                <div className="h-4 w-32 bg-white/5 rounded mx-auto" />
              </div>
            </CardContent>

            <CardFooter className="pb-8">
              {/* Button placeholder */}
              <div className="w-full h-12 bg-blue-600/20 rounded-xl" />
            </CardFooter>
          </Card>

          {/* Footer Security Badge Placeholder */}
          <div className="flex items-center justify-center space-x-2 opacity-70">
            <div className="w-4 h-4 bg-white/10 rounded" />
            <div className="h-4 w-48 bg-white/5 rounded" />
          </div>

        </div>
      </main>
    </Shimmer>
  );
}
