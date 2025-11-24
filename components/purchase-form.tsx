"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
  ticketTypes: TicketType[];
}

interface PurchaseFormProps {
  ticket: Ticket;
}

export default function PurchaseForm({ ticket }: PurchaseFormProps) {
  const router = useRouter();
  const [selectedTypeId, setSelectedTypeId] = useState<string>(
    ticket.ticketTypes[0]?.id || ""
  );
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    buyerWhatsapp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedType = ticket.ticketTypes.find((t) => t.id === selectedTypeId);
  const isTicketAvailable =
    selectedType && selectedType.sold < selectedType.quantity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = new FormData();
      form.append("ticketId", ticket._id);
      form.append("ticketTypeId", selectedTypeId); // add selected ticket type
      form.append("buyerName", formData.buyerName);
      form.append("buyerEmail", formData.buyerEmail);
      form.append("buyerPhone", formData.buyerPhone);
      form.append("buyerWhatsapp", formData.buyerWhatsapp);

      const res = await fetch("/api/purchase", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create purchase");
        return;
      }

      if (data.isFreeTicket) {
        router.push(`/ticket/success/${data.ticketUID}`);
        return;
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        router.push(`/success?purchaseId=${data.purchaseId}`);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Get Your Ticket</h2>

      <form onSubmit={handlePurchase} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select Ticket Type
          </label>
          <div className="space-y-2">
            {ticket.ticketTypes.map((type) => {
              const available = type.sold < type.quantity;
              return (
                <label
                  key={type.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTypeId === type.id
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  } ${!available ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="ticketType"
                    value={type.id}
                    checked={selectedTypeId === type.id}
                    onChange={(e) => setSelectedTypeId(e.target.value)}
                    disabled={!available}
                    className="w-4 h-4"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-foreground">{type.name}</p>
                    {type.description && (
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {available ? (
                        <>{type.quantity - type.sold} available</>
                      ) : (
                        "Sold Out"
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-foreground">
                      {type.price === 0
                        ? "FREE"
                        : `₦${type.price.toLocaleString()}`}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="buyerName"
            value={formData.buyerName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="buyerEmail"
            value={formData.buyerEmail}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="buyerPhone"
            value={formData.buyerPhone}
            onChange={handleChange}
            placeholder="+234..."
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            WhatsApp Number
          </label>
          <input
            type="tel"
            name="buyerWhatsapp"
            value={formData.buyerWhatsapp}
            onChange={handleChange}
            placeholder="+234..."
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !isTicketAvailable}
          className="w-full py-3 font-medium"
        >
          {!isTicketAvailable
            ? "Ticket Type Sold Out"
            : loading
            ? "Processing..."
            : selectedType?.price === 0
            ? "Get Free Ticket"
            : `Buy Ticket - ₦${selectedType?.price.toLocaleString()}`}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        Your ticket will be sent to your email and WhatsApp after confirmation.
      </p>
    </div>
  );
}
