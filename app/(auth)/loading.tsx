'use client';

// Import Shimmer from shimmer-from-structure to create the skeleton loading effect
import { Shimmer } from "shimmer-from-structure";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, DollarSign, TrendingUp, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Loading component for the dashboard (auth) section.
 * Uses shimmer-from-structure to automatically generate a shimmer effect
 * based on the provided JSX structure.
 */
export default function Loading() {
  return (
    // Wrap the entire structure in the Shimmer component to enable the effect
    <Shimmer>
      <main className="flex min-h-screen flex-col items-center p-4 bg-background text-foreground pb-24">
        <div className="w-full max-w-2xl space-y-8 mt-6">

          {/* Profile Summary Placeholder */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                {/* Placeholder for the user's email */}
                <div className="h-7 w-48 bg-gray-700 rounded-md mb-2" />
                {/* Placeholder for the 'Active Content Creator' status */}
                <div className="flex items-center h-4 w-32 bg-gray-800 rounded-sm" />
              </div>
            </div>
            {/* Placeholder for the ProfileDropdownMenu trigger */}
            <div className="w-10 h-10 rounded-full bg-gray-800" />
          </div>

          {/* Stats Grid Placeholder - Matches the 3-column layout in DashboardContent */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-[#1c1c1e] border-none shadow-xl">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                  {/* Icon placeholder */}
                  <div className="w-9 h-9 rounded-lg bg-gray-800" />
                  {/* Label placeholder */}
                  <div className="h-3 w-10 bg-gray-800 rounded" />
                  {/* Value placeholder */}
                  <div className="h-6 w-8 bg-gray-800 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity / Files List Placeholder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="h-6 w-32 bg-gray-800 rounded" />
            </div>

            <div className="space-y-3">
              {/* Generate 3 placeholder cards for the files list */}
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-[#1c1c1e] border-none">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* File icon placeholder */}
                      <div className="w-10 h-10 rounded-xl bg-gray-800 shrink-0" />
                      <div className="space-y-2">
                        {/* Filename placeholder */}
                        <div className="h-4 w-32 bg-gray-800 rounded" />
                        {/* Size/Date placeholder */}
                        <div className="h-3 w-24 bg-gray-800 rounded" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      {/* Stats placeholders (Sales/Price) */}
                      <div className="h-8 w-10 bg-gray-800 rounded" />
                      <div className="h-8 w-10 bg-gray-800 rounded" />
                      {/* Action button placeholders */}
                      <div className="w-8 h-8 bg-gray-800 rounded" />
                      <div className="w-8 h-8 bg-gray-800 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upload Section Placeholder */}
          <div className="space-y-4 pt-4">
            <div className="px-2">
              <div className="h-6 w-48 bg-gray-800 rounded mb-2" />
              <div className="h-4 w-64 bg-gray-800 rounded" />
            </div>
            {/* Placeholder for the upload form box */}
            <div className="h-32 w-full bg-[#1c1c1e] rounded-xl border border-dashed border-white/5" />
          </div>

        </div>
      </main>
    </Shimmer>
  );
}
