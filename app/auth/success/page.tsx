import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center p-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="border-white/5 bg-[#1c1c1e]/80 backdrop-blur-xl text-white shadow-2xl rounded-[32px] overflow-hidden">
          <CardHeader className="pt-12 pb-6 flex flex-col items-center">
            {/* Success Icon with Glow */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
              <div className="relative bg-gradient-to-tr from-green-400 to-emerald-600 p-4 rounded-full shadow-lg shadow-green-500/20 ring-4 ring-green-500/10">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>

            <CardTitle className="text-3xl font-extrabold text-center tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
              Welcome Aboard!
            </CardTitle>
            <CardDescription className="text-gray-400 text-center text-base mt-2 px-4">
              Your account has been successfully created. You're ready to start sharing and earning.
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-12 px-8 flex flex-col space-y-4">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

            <p className="text-center text-gray-300 text-sm mb-4">
              Join the community of creators on StarDrop.
            </p>

            <Button
              asChild
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-500/25 border-none font-bold text-lg group"
            >
              <Link href="/auth/login" className="flex items-center justify-center gap-2">
                Continue to Login
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest mt-6">
              © 2026 StarDrop Secure File Store
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
