import { createClient } from "@/utils/supabase/server";
import { ProfileDropdownMenu } from "@/components/ui/profileDropDown";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { Suspense } from "react";

export default async function Home() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Fetch initial files
  const { data: files, error } = await supabase
    .from("files")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("email", user.data.user!.email);

  if (error) {
    console.error("Error fetching files:", error);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-background text-foreground pb-24">
      <div className="w-full max-w-2xl space-y-8 mt-6">
        {/* Profile Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold">{user.data.user?.email}</h1>
              <p className="text-sm text-muted-foreground flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Active Content Creator
              </p>
            </div>
          </div>
          <ProfileDropdownMenu />
        </div>
        <DashboardContent
          initialFiles={files || []}
          userEmail={user.data.user!.email!}
        />
      </div>
    </main>
  );
}
