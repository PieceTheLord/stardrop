'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      active: pathname === '/',
    },
    {
      name: 'Create',
      href: '/create', // Placeholder, creates are currently inline on home
      icon: PlusCircle,
      active: false, // Always show as action
      isAction: true,
    },
    {
      name: 'Earnings',
      href: '/earnings',
      icon: Wallet,
      active: pathname === '/earnings',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-md z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1",
              item.isAction ? "" : "text-muted-foreground hover:text-foreground",
              item.active && !item.isAction ? "text-blue-500" : ""
            )}
          >
            {item.isAction ? (
               <Button size="icon" className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg -mt-8 border-4 border-background">
                  <item.icon className="h-6 w-6" />
               </Button>
            ) : (
                <>
                    <item.icon className={cn("h-6 w-6", item.active ? "stroke-blue-500" : "stroke-current")} />
                    <span className="text-[10px] font-medium">{item.name}</span>
                </>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
