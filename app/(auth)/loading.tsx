'use client'

import { ProfileDropdownMenu } from "@/components/ui/profileDropDown";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { Suspense } from "react";
import { Shimmer } from "shimmer-from-structure"

// 1. Define a component that will receive the email as a prop.
// Shimmer will inject 'email' here during the measurement phase.
function UserEmailHeader({ email }: { email?: string }) {
  return (
    <h1 className="text-xl font-bold">
      {email || "loading..."}
    </h1>
  );
}

// 2. loading.tsx should be a regular function (not async) 
// to ensure the loading shell appears instantly while data fetches.
export default function AuthLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-background text-foreground pb-24">
      <div className="w-full max-w-2xl space-y-8 mt-6">
        
        {/* Profile Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              {/* 3. Pass the mock data pattern via templateProps.
                  Shimmer will pass 'email' to the UserEmailHeader component below. */}
              <Shimmer templateProps={{ email: "useremail@example.com" }}>
                <UserEmailHeader />
              </Shimmer>
              
              <p className="text-sm text-muted-foreground flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Active Content Creator
              </p>
            </div>
          </div>
          {/* Profile menu remains as a simple fallback or hidden during load */}
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
        </div>

        {/* 4. For the DashboardContent, pass mock data to initialFiles 
            so the shimmer calculates a structure with multiple files. */}
        <Shimmer 
          templateProps={{ 
            initialFiles: [
              { id: 1, filename: "file_name_placeholder.png", size: 1024, sell_count: 5, price: 25 },
              { id: 2, filename: "another_placeholder.zip", size: 5048, sell_count: 2, price: 50 }
            ] 
          }}
        >
          <DashboardContent
            initialFiles={[]} // Real data starts empty
            userEmail="..."
          />
        </Shimmer>
      </div>
    </main>
  );
}
