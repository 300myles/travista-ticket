"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PurchaseForm from "@/components/purchase-form";
import TicketDisplay from "@/components/ticket-display";

interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  description?: string;
}

interface Ticket {
  _id: string;
  name: string;
  eventDate: string;
  flyerUrl: string;
  organizerId: string;
  description?: string;
  ticketTypes: TicketType[];
}

export default function PublicTicketPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets/${slug}`);
        const data = await res.json();

        if (!res.ok) {
          setError("Ticket not found");
          return;
        }

        setTicket(data.ticket);
      } catch (err) {
        setError("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Oops!</h1>
          <p className="text-muted-foreground">{error || "Ticket not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <TicketDisplay ticket={ticket} />
          </div>
          <div>
            <PurchaseForm ticket={ticket} />
          </div>
        </div>
      </div>
    </div>
  );
}
