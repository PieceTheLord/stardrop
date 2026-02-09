import { UploadForm } from "@/components/creator/upload-form";
import { Button } from "@/components/ui/button";

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

            <div className="pt-4">
                 <Button variant="outline" className="w-full rounded-xl h-12 border-white/10 bg-white/5 hover:bg-white/10 text-white">
                    Connect Wallet
                 </Button>
            </div>
        </div>
      </div>
    </main>
  );
}
