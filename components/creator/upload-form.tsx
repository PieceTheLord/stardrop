'use client';

import { useActionState, useState, useEffect } from 'react';
import { generateLink, type ActionState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UploadCloud, File as FileIcon, Loader2, Copy, Check, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/utils'; // Assuming this utility exists, or I will create it. Actually I'll implement inline for now.

const initialState: ActionState = {
  success: false,
  message: '',
  link: '',
  error: '',
};

export function UploadForm() {
  const [state, formAction, isPending] = useActionState(generateLink, initialState);
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
          setDragActive(true);
      } else if (e.type === "dragleave") {
          setDragActive(false);
      }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleSubmit = (formData: FormData) => {
      if (file && !formData.get('file')) {
          formData.set('file', file);
      }
      formAction(formData);
  }

  const copyToClipboard = () => {
    if (state.link) {
      navigator.clipboard.writeText(`${window.location.origin}${state.link}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
      e.stopPropagation();
      setFile(null);
  }

  // Effect to reset state when file changes (optional, but good UX)
  useEffect(() => {
     // If needed
  }, [file]);


  if (state.success && state.link) {
    return (
      <Card className="w-full bg-[#1c1c1e] text-white border-none shadow-2xl animate-in fade-in zoom-in duration-300">
        <CardContent className="p-8 space-y-6 flex flex-col items-center">
            <div className="rounded-full bg-green-500/20 p-4">
                 <Check className="w-8 h-8 text-green-500" />
            </div>
            
            <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Ready to Share!</h3>
                <p className="text-sm text-gray-400">Your secure link is generated.</p>
            </div>

            <div className="flex items-center space-x-2 w-full p-4 bg-[#2c2c2e] rounded-xl border border-white/10">
                <span className="text-sm text-gray-300 break-all line-clamp-1 flex-1 font-mono">
                    {`${window.location.origin}${state.link}`}
                </span>
                 <Button 
                    size="icon"
                    variant="ghost" 
                    onClick={copyToClipboard}
                    className="hover:bg-white/10 shrink-0 h-8 w-8"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
            </div>
          
            <Button 
                variant="outline" 
                className="w-full border-white/10 hover:bg-white/5 text-gray-300 hover:text-white" 
                onClick={() => window.location.reload()}
            >
                Upload Another
            </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-transparent border-none shadow-none">
      <form action={handleSubmit}>
        <div className="space-y-6">
          <div
            className={cn(
              "relative group border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center min-h-[220px] bg-[#1c1c1e]",
              dragActive ? "border-blue-500 bg-[#1c1c1e]/80" : "border-white/10 hover:bg-[#2c2c2e] hover:border-white/20",
              file ? "border-blue-500/50" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              name="file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              required={!file} 
            />
            
            {file ? (
                <div className="flex flex-col items-center animate-in fade-in space-y-4 w-full z-10">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                        <FileIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="space-y-1 max-w-full">
                         <p className="font-medium text-sm text-white truncate px-4">{file.name}</p>
                         <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        onClick={clearFile}
                    >
                        <X className="w-4 h-4 mr-1" /> Remove
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-4 z-10">
                    <div className="w-16 h-16 rounded-full bg-[#007aff] flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-lg font-semibold text-white">Click to upload</p>
                        <p className="text-sm text-gray-400">XS, PNG, ZIP or PDF (max. 50MB)</p>
                    </div>
                </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#1c1c1e] rounded-xl border border-white/5">
                 <div className="flex flex-col">
                     <label htmlFor="price" className="text-sm font-medium text-gray-300">
                        Price (USD)
                     </label>
                     <p className="text-xs text-gray-500">Approx. $2.50 USD</p>
                 </div>
                 <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        placeholder="0.00" 
                        min="0" 
                        step="0.01" 
                        className="pl-7 bg-[#2c2c2e] border-transparent focus:border-blue-500 text-white placeholder:text-gray-600 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
                    />
                 </div>
            </div>
          </div>
          
           {state.message && (
              <p className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded-lg">{state.message}</p>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold bg-[#007aff] hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]" 
            disabled={isPending || !file}
          >
            {isPending ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Link...
                </>
            ) : (
                "Create Link"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
