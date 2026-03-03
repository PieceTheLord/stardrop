import { UploadForm } from "@/components/creator/upload-form";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-background text-foreground pb-20">
      <div className="w-full max-w-md space-y-8 mt-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            StarDrop
          </h1>
        </div>

        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Monetize instantly</h2>
            <p className="text-muted-foreground">
              Sell digital files directly via Telegram Stars
            </p>
          </div>

          <UploadForm />
          <a href="/" className="w-full h-full mt-4">
            <Button  variant={"outline"} className="w-full rounded-xl mt-4">
              Cancel
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
}
