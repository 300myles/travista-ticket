"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export function DashboardNav({ user }: { user?: any } = {}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="bg-white/20 backdrop-blur-sm hidden md:block sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold text-foreground">
          Travista
        </Link>

        <div className="flex items-center gap-4">
          {user?.email && (
            <span className="text-sm text-muted-foreground">{user.email}</span>
          )}
          <Link
            href="/dashboard/settings"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Settings
          </Link>
          <Link
            href="/dashboard/withdraw"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Wallet
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-smooth"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNav;
