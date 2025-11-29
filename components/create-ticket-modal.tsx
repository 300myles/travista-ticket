"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TicketTypeInput {
  name: string;
  description: string;
  price: string;
  quantity: string;
}

interface CreateTicketModalProps {
  onClose?: () => void;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  organizerId?: string;
}

export function CreateTicketModal({
  onClose,
  onSuccess,
  open = true,
  onOpenChange,
  organizerId = "",
}: CreateTicketModalProps) {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    eventDate: "",
    flyerUrl: "",
  });

  const [ticketTypes, setTicketTypes] = useState<TicketTypeInput[]>([
    { name: "", description: "", price: "", quantity: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
    if (onClose) onClose();
  };

  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketTypeChange = (
    index: number,
    field: keyof TicketTypeInput,
    value: string
  ) => {
    const updated = [...ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    setTicketTypes(updated);
  };

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      { name: "", description: "", price: "", quantity: "" },
    ]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate ticket types
      if (!ticketTypes.some((t) => t.name.trim())) {
        setError("Please add at least one ticket type with a name");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", eventData.name);
      formData.append("description", eventData.description);
      formData.append("eventDate", eventData.eventDate);
      formData.append("flyerUrl", eventData.flyerUrl);

      formData.append(
        "ticketTypes",
        JSON.stringify(
          ticketTypes
            .filter((t) => t.name.trim())
            .map((t) => ({
              name: t.name,
              description: t.description,
              price: Number.parseInt(t.price) || 0,
              quantity: Number.parseInt(t.quantity) || 1,
            }))
        )
      );

      const res = await fetch("/api/tickets/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create ticket");
        return;
      }

      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ">
      <div className="bg-background border max-h-[90dvh] overflow-scroll border-border rounded-lg max-w-2xl w-full p-6 my-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Create New Event
        </h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Event Details</h3>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Event Name
              </label>
              <input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleEventChange}
                placeholder="e.g., Music Festival 2024"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleEventChange}
                placeholder="e.g., A great night of music and fun"
                className="w-full px-3 py-2 border h-12 min-h-12 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Event Date
              </label>
              <input
                type="datetime-local"
                name="eventDate"
                value={eventData.eventDate}
                onChange={handleEventChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Flyer URL
              </label>
              <input
                type="url"
                name="flyerUrl"
                value={eventData.flyerUrl}
                onChange={handleEventChange}
                placeholder="https://example.com/flyer.jpg"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-foreground">Ticket Types</h3>
              <Button
                type="button"
                onClick={addTicketType}
                variant="outline"
                size="sm"
              >
                + Add Ticket Type
              </Button>
            </div>

            <div className="space-y-3">
              {ticketTypes.map((type, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="e.g., VIP"
                      value={type.name}
                      onChange={(e) =>
                        handleTicketTypeChange(index, "name", e.target.value)
                      }
                      className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={type.description}
                      onChange={(e) =>
                        handleTicketTypeChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="px-3 py-2 border border-border h-12 min-h-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                    />
                    <input
                      type="number"
                      placeholder="Price (₦)"
                      value={type.price}
                      onChange={(e) =>
                        handleTicketTypeChange(index, "price", e.target.value)
                      }
                      className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={type.quantity}
                      onChange={(e) =>
                        handleTicketTypeChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                    />
                  </div>

                  {ticketTypes.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      variant="outline"
                      size="sm"
                      className="mt-3 text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicketModal;
