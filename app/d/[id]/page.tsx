import { LockedFile } from "@/components/buyer/locked-file";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BuyerPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: file, error } = await supabase
    .from('files')
    .select('filename, size, price')
    .eq('id', id)
    .single();

  if (error || !file) {
    console.error("File fetch error:", error);
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground pb-20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            StarDrop
          </h1>
          <p className="text-muted-foreground">Secure File Transfer</p>
        </div>
        
        <LockedFile 
          id={id}
          filename={file.filename}
          size={file.size}
          price={file.price}
        />

        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground opacity-70">
            <ShieldCheck className="w-4 h-4" />
            <span>Secured by Telegram Payments</span>
        </div>
      </div>
    </main>
  );
}
