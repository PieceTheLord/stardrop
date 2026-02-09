'use client';

import { useState } from 'react';
import { initiatePayment } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, File as FileIcon, Download, Loader2, CreditCard, Check } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { redirect } from 'next/navigation';

interface LockedFileProps {
  id: string;
  filename: string;
  size: number;
  price: number;
}

export function LockedFile({ id, filename, size, price }: LockedFileProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    try {
      setIsLoading(true);
      setError('');

      const result = await initiatePayment(id);

      if (result.success && result.downloadUrl) {
        setDownloadUrl(result.downloadUrl);
        // Trigger download automatically
        window.location.assign(result.downloadUrl);
        const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME!; // e.g., 'StarDropBot'
        console.log(botUsername, id);

        redirect(`https://t.me/${botUsername}?start=order_${id}`);
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFree = price === 0;

  if (downloadUrl) {
    return (
      <Card className="w-full bg-[#1c1c1e] text-white border-none shadow-2xl animate-in fade-in zoom-in duration-300">
        <CardContent className="p-8 space-y-6 flex flex-col items-center">
          <div className="rounded-full bg-green-500/20 p-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Unlocked!</h3>
            <p className="text-sm text-gray-400">Your download has started.</p>
          </div>

          <Button size="lg" asChild variant="outline" className="w-full border-white/10 text-white hover:bg-white/10">
            <a href={downloadUrl} rel="noopener noreferrer" download={filename}>
              <Download className="w-4 h-4 mr-2" />
              Download Again
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10 bg-[#1c1c1e] text-white border-none shadow-2xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-blue-500" />
        </div>
        <CardTitle className="text-xl font-medium">{filename}</CardTitle>
        <p className="text-sm text-gray-400">{formatBytes(size)}</p>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="text-center space-y-1">
          <p className="text-3xl font-bold">
            {isFree ? "Free" : `$${price.toFixed(2)}`}
          </p>
          <p className="text-sm text-gray-500">
            {isFree
              ? "Instant access"
              : "One-time payment"}
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-400 text-center bg-red-400/10 p-2 rounded-lg">{error}</p>
        )}
      </CardContent>

      <CardFooter className="pb-8">
        <Button
          className="w-full h-12 text-base font-semibold bg-[#007aff] hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
          onClick={initiatePayment.bind(null, id)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : isFree ? (
            <Download className="w-5 h-5 mr-2" />
          ) : (
            <CreditCard className="w-5 h-5 mr-2" />
          )}
          {isLoading ? "Processing..." : isFree ? "Download Now" : "Unlock File"}
        </Button>
      </CardFooter>
    </Card>
  );
}
