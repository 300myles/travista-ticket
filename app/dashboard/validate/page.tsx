"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QRScanner } from "@/components/qr-scanner";
import { toast } from "sonner";
import getDate from "@/utils/getDate";

interface ValidatedTicket {
  ticketUID: string;
  buyerName: string;
  buyerEmail: string;
  status: "valid" | "used" | "invalid";
  ticketName: string;
  usedAt: Date | null;
}

export default function ValidatePage() {
  const [showScanner, setShowScanner] = useState(false);
  const [manualTicketID, setManualTicketID] = useState("");
  const [validatedTicket, setValidatedTicket] =
    useState<ValidatedTicket | null>(null);
  const [loading, setLoading] = useState(false);

  const validateTicket = async (ticketUID: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/purchase?ticketUID=${ticketUID}`);
      const data = await res.json();

      if (data.purchase) {
        const ticket = data.purchase;

        let status: "valid" | "used" | "invalid" = "valid";
        if (ticket.paymentStatus !== "completed") {
          status = "invalid";
        } else if (ticket.used) {
          status = "used";
        }

        setValidatedTicket({
          ticketUID: ticket.ticketUID,
          buyerName: ticket.buyerName,
          buyerEmail: ticket.buyerEmail,
          status,
          ticketName: ticket.ticketName || "Ticket",
          usedAt: ticket?.usedAt || null,
        });

        if (status === "used") {
          toast.error("This ticket has already been used");
        } else if (status === "valid") {
          toast.success("Ticket is valid and can be used");
        } else {
          toast.error("Ticket invalid or payment not completed");
        }
      } else {
        toast.error("Ticket not found");
      }
    } catch (error) {
      toast.error("Failed to validate ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleManualValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTicketID.trim()) {
      toast.error("Please enter a ticket ID");
      return;
    }
    validateTicket(manualTicketID);
    setManualTicketID("");
  };

  const handleScannerResult = (ticketUID: string) => {
    validateTicket(ticketUID);
    setShowScanner(false);
  };

  const markAsUsed = async () => {
    if (!validatedTicket) return;
  
    try {
      const res = await fetch(`/api/purchase/${validatedTicket.ticketUID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ used: true }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        toast.error(data.error || "Failed to update ticket");
        return;
      }
  
      toast.success("Ticket marked as used");
      setValidatedTicket(null);
  
    } catch (error) {
      console.error("Mark ticket used error:", error);
      toast.error("Failed to mark ticket as used");
    }
  };
  

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Validate Tickets
          </h1>
          <p className="text-muted-foreground">
            Scan or enter ticket IDs to validate entries
          </p>
        </div>

        {!validatedTicket ? (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Scan QR Code
              </h2>
              {showScanner ? (
                <div>
                  <QRScanner onScan={handleScannerResult} />
                  <Button
                    onClick={() => setShowScanner(false)}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowScanner(true)} className="w-full">
                  Open Scanner
                </Button>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Or Enter Ticket ID
              </h2>
              <form onSubmit={handleManualValidate} className="space-y-4">
                <Input
                  placeholder="Enter ticket ID (e.g., TRV-YYYYMMDD-XXXXX)"
                  value={manualTicketID}
                  onChange={(e) => setManualTicketID(e.target.value)}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Validating..." : "Validate"}
                </Button>
              </form>
            </Card>
          </div>
        ) : (
          <Card className="p-6">
            <div className="text-center mb-6">
              <div
                className={`inline-block px-4 py-2 rounded-lg mb-4 ${
                  validatedTicket.status === "valid"
                    ? "bg-green-100 text-green-800"
                    : validatedTicket.status === "used"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {validatedTicket.status.toUpperCase()}
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                {validatedTicket.ticketName}
              </h2>
            </div>

            <div className="space-y-3 bg-card p-4 rounded-lg mb-6">
              <div>
                <p className="text-muted-foreground text-sm">Ticket ID</p>
                <p className="text-foreground font-semibold">
                  {validatedTicket.ticketUID}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Buyer Name</p>
                <p className="text-foreground font-semibold">
                  {validatedTicket.buyerName}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="text-foreground font-semibold">
                  {validatedTicket.buyerEmail}
                </p>
              </div>

              {validatedTicket?.usedAt && (
                <div>
                <p className="text-muted-foreground text-sm">Used at</p>
                <p className="text-foreground font-semibold">
                  {validatedTicket?.usedAt && getDate(validatedTicket?.usedAt)}
                </p>
              </div>
              )}
            </div>

            <div className="flex gap-3">
              {validatedTicket.status === "valid" && (
                <Button onClick={markAsUsed} className="flex-1">
                  Mark as Used
                </Button>
              )}

              <Button
                onClick={() => setValidatedTicket(null)}
                variant="outline"
                className="flex-1"
              >
                {validatedTicket.status === "valid"
                  ? "Another Ticket"
                  : "Close"}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
