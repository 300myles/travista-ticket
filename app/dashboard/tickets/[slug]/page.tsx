"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { MdOutlineArrowOutward } from "react-icons/md";
import Link from "next/link";

interface Purchase {
  _id: string;
  ticketUID: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerWhatsapp: string;
  amount: number;
  paymentStatus: string;
  used: boolean;
  usedAt?: Date;
  createdAt: Date;
}

export default function TicketDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets/${slug}`);
        console.log(res);
        const data = await res.json();

        if (!res.ok) {
          toast.error("Ticket not found");
          return;
        }

        console.log("Ticket data:", data);
        setPurchases(data?.ticket.purchases || []);
      } catch (err) {
        toast.error("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-6"
        >
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Ticket Details
          </h1>
          <p className="text-muted-foreground">
            View and manage all purchases for this ticket
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {purchases.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No purchases yet</p>
            </Card>
          ) : (
            purchases.map((purchase) => (
              <Card key={purchase._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {purchase.buyerName}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {purchase.buyerEmail}
                    </p>
                    <p className="text-foreground font-semibold mt-2">
                      Ticket ID: {purchase.ticketUID}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      ₦{purchase.amount.toLocaleString()}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        purchase.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {purchase.paymentStatus}
                    </span>
                    <br />
                    {purchase.used && (
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        Used
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 flex items-center justify-between border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Purchased:{" "}
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </p>

                  <Link href={`/ticket/success/${purchase.ticketUID}`} className="flex-1">
                  <Button variant="outline" className="flex ml-auto">
                    <span>View</span>
                    <MdOutlineArrowOutward />
                  </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
