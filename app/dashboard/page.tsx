"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/dashboard-nav";
import { CreateTicketModal } from "@/components/create-ticket-modal";
import { TicketsList } from "@/components/tickets-list";

interface DashboardStats {
  totalTickets: number;
  totalSold: number;
  totalRevenue: number;
  walletBalance: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    totalSold: 0,
    totalRevenue: 0,
    walletBalance: 0,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await fetch("/api/me");
        const meData = await meRes.json();

        if (!meData.user) {
          router.push("/auth/login");
          return;
        }

        setUser(meData.user);

        const ticketsRes = await fetch("/api/tickets/list");
        const ticketsData = await ticketsRes.json();

        const tickets = ticketsData.tickets || [];
        const totalSold = tickets.reduce(
          (sum: number, t: any) => sum + (t.totalSold || 0),
          0
        );
        const totalRevenue = tickets.reduce(
          (sum: number, t: any) => sum + (t.totalRevenue || 0),
          0
        );

        setStats({
          totalTickets: tickets.length,
          totalSold,
          totalRevenue,
          walletBalance: meData.user.walletBalance || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, refreshKey]);

  const handleTicketCreated = () => {
    setShowCreateModal(false);
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="max-w-7xl mx-auto mt-3 px-4 py-12 md:px-8">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-lg md:text-3xl font-bold text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                Welcome back, {user?.fullName}
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-foreground text-background text-sm md:text-base font-medium rounded-lg hover:opacity-90 transition-smooth"
            >
              Create Ticket
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 border border-border rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground font-medium">
                Total Tickets
              </div>
              <div className="text-3xl font-bold text-foreground mt-2">
                {stats.totalTickets}
              </div>
            </div>
            <div className="p-6 border border-border rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground font-medium">
                Tickets Sold
              </div>
              <div className="text-3xl font-bold text-foreground mt-2">
                {stats.totalSold}
              </div>
            </div>
            <div className="p-6 border border-border rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground font-medium">
                Total Revenue
              </div>
              <div className="text-3xl font-bold text-foreground mt-2">
                ₦{stats?.totalRevenue?.toLocaleString()}
              </div>
            </div>
            <div className="p-6 border border-border rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground font-medium">
                Wallet Balance
              </div>
              <div className="text-3xl font-bold text-foreground mt-2">
                ₦{stats.walletBalance.toLocaleString()}
              </div>
              <Button
                onClick={() => router.push("/dashboard/withdraw")}
                size="sm"
                variant="outline"
                className="mt-3 w-full"
              >
                Withdraw
              </Button>
            </div>
          </div>
        </div>

        <TicketsList key={refreshKey} />
      </main>

      {showCreateModal && (
        <CreateTicketModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSuccess={() => handleTicketCreated}
        />
      )}
    </div>
  );
}
