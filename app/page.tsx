import { createClient } from "@/utils/supabase/server";
import { UploadForm } from "@/components/creator/upload-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Plus,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import { formatBytes } from "@/lib/utils";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch files
  const { data: files, error } = await supabase
    .from('files')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching files:", error);
  }

  // Calculate stats
  const totalFiles = files?.length || 0;
  // Note: download_count is not in the initial migration, defaulting to 0 for demo UI
  const totalDownloads = files?.reduce((acc: number, file: any) => acc + (file.download_count || 0), 0) || 0;
  const totalRevenue = files?.reduce((acc: number, file: any) => acc + (parseFloat(file.price || 0) * (file.download_count || 0)), 0) || 0;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-background text-foreground pb-24">
      <div className="w-full max-w-2xl space-y-8 mt-6">
        {/* Profile Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold border-2 border-white/10">
              ST
            </div>
            <div>
              <h1 className="text-xl font-bold">StarCreator</h1>
              <p className="text-sm text-muted-foreground flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Active Content Creator
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-[#1c1c1e] border-none shadow-xl">
            <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-400">Files</p>
              <p className="text-lg font-bold">{totalFiles}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1c1c1e] border-none shadow-xl">
            <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Download className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-400">Sales</p>
              <p className="text-lg font-bold">{totalDownloads}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1c1c1e] border-none shadow-xl">
            <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-400">Revenue</p>
              <p className="text-lg font-bold">${totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity / Files List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              Your Content
            </h2>
            <Link href="#upload" className="text-sm text-blue-500 hover:underline">
              Upload New
            </Link>
          </div>

          <div className="space-y-3">
            {files && files.length > 0 ? (
              files.map((file: any) => (
                <Card key={file.id} className="bg-[#1c1c1e] border-none hover:bg-[#2c2c2e] transition-colors group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium text-white truncate">{file.filename}</p>
                        <p className="text-xs text-gray-400">{formatBytes(file.size)} • {new Date(file.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-right shrink-0">
                      <div>
                        <p className="text-sm font-bold text-white">{file.download_count || 0}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Sales</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-400">${parseFloat(file.price || 0).toFixed(2)}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Price</p>
                      </div>
                      <Button variant="ghost" size="icon" className="group-hover:text-blue-500 transition-colors" asChild>
                         <Link href={`/d/${file.id}`}>
                            <ExternalLink className="w-4 h-4" />
                         </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-[#1c1c1e] rounded-3xl border border-dashed border-white/5 mx-auto w-full">
                <p className="text-gray-500">No files uploaded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div id="upload" className="space-y-4 pt-4">
          <div className="px-2">
             <h2 className="text-lg font-semibold">Generate Secure Link</h2>
             <p className="text-sm text-muted-foreground">Upload a file and set your price to start earning.</p>
          </div>
          <UploadForm />
        </div>
      </div>
    </main>
  );
}
