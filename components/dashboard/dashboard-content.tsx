'use client';

import { useState, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Info
} from "lucide-react";
import Link from "next/link";
import { formatBytes } from "@/lib/utils";
import { CardDropDown } from "@/components/ui/cardDropDown";
import { UploadForm } from "@/components/creator/upload-form";
import { createClient } from "@/utils/supabase/client";

interface DashboardContentProps {
  initialFiles: any[];
  userEmail: string;
}

export function DashboardContent({ initialFiles, userEmail }: DashboardContentProps) {
  const [files, setFiles] = useState(initialFiles);
  const supabase = createClient();

  // Recalculate stats based on current files state
  const totalFiles = files.length;
  const totalDownloads = files.reduce((acc: number, file: any) => acc + (file.sell_count || 0), 0);
  const totalRevenue = files.reduce((acc: number, file: any) => acc + (parseFloat(file.price || 0) * (file.sell_count || 0)), 0);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('email', userEmail);

    if (!error && data) {
      setFiles(data);
    }
  };

  const handleDelete = (storage_path: string) => {
    setFiles(prev => prev.filter(f => f.storage_path !== storage_path));
  };

  const handleUploadSuccess = () => {
    fetchFiles();
  };

  return (
    <div className="w-full max-w-2xl space-y-8 mt-6">
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
        <Card className="bg-[#1c1c1e] border-none shadow-xl relative">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
            <div className="absolute top-2 right-2 group items-center flex">
              <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 transition-colors cursor-help" />
              <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-2 py-1 bg-[#2c2c2e] text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border border-white/5 shadow-xl select-none">
                10% fee
              </div>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-400">Revenue</p>
            <p className="text-lg font-bold">⭐{totalRevenue.toFixed(0)}</p>
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
        </div>

        <div className="space-y-3">
          {files.length > 0 ? (
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
                      <p className="text-sm font-bold text-white">{file.sell_count || 0}</p>
                      <p className="text-[10px] text-gray-500 uppercase">Sales</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-400">⭐{parseFloat(file.price || 0).toFixed(0)}</p>
                      <p className="text-[10px] text-gray-500 uppercase">Price</p>
                    </div>
                    <Button variant="ghost" size="icon" className="group-hover:text-blue-500 transition-colors" asChild>
                      <Link href={`/d/${file.id}`}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Suspense>
                      <CardDropDown
                        storage_path={file.storage_path}
                        onDelete={() => handleDelete(file.storage_path)}
                      />
                    </Suspense>
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
        <UploadForm onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
}
