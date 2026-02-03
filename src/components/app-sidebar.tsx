"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth-context";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Trees,
  TrendingUp,
  DollarSign,
  UserCog,
} from "lucide-react";

const getNavigation = (role: "admin" | "cashier") => {
  const baseNavigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      permission: "dashboard:view",
    },
    {
      name: "Inventory",
      href: "/inventory",
      icon: Package,
      permission: "inventory:view",
    },
    {
      name: "Penjualan",
      href: "/sales",
      icon: ShoppingCart,
      permission: "sales:view",
    },
    {
      name: "Kontak",
      href: "/contacts",
      icon: Users,
      permission: "contacts:view",
    },
  ];

  const adminNavigation = [
    ...baseNavigation,
    {
      name: "Biaya",
      href: "/expenses",
      icon: CreditCard,
      permission: "expenses:view",
    },
    {
      name: "Laporan",
      href: "/reports",
      icon: FileText,
      permission: "reports:view",
    },
    {
      name: "Manajemen User",
      href: "/users",
      icon: UserCog,
      permission: "users:view",
    },
    {
      name: "Pengaturan",
      href: "/settings",
      icon: Settings,
      permission: "settings:view",
    },
  ];

  const cashierNavigation = [
    ...baseNavigation,
    {
      name: "Laporan",
      href: "/reports",
      icon: FileText,
      permission: "reports:view",
    },
  ];

  return role === "admin" ? adminNavigation : cashierNavigation;
};

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();

  if (!user) return null;

  const navigation = getNavigation(user.role).filter(item => hasPermission(item.permission));

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-white">
      <div className="flex items-center h-16 px-6 border-b border-slate-800">
        <Trees className="h-8 w-8 text-green-400 mr-3" />
        <div>
          <h1 className="text-lg font-semibold">Kayu LOG</h1>
          <p className="text-xs text-slate-400">Sistem Pengolahan Kayu</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-slate-800 text-white hover:bg-slate-700"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-slate-800">
        <div className="mb-3 px-2">
          <p className="text-xs text-slate-400">Login sebagai:</p>
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-slate-400 capitalize">{user.role}</p>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-400 hover:text-white"
          onClick={logout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Keluar
        </Button>
      </div>
    </div>
  );
}