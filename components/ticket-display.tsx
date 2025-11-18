"use client"

interface TicketDisplayProps {
  ticket: {
    _id: string
    name: string
    price: number
    eventDate: string
    flyerUrl: string
    description: string
  }
}

export default function TicketDisplay({ ticket }: TicketDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="relative w-full h-96 border border-border rounded-lg overflow-hidden bg-muted">
        <img src={ticket.flyerUrl || "/placeholder.svg"} alt={ticket.name} className="w-full h-full object-cover" />
      </div>

      <div>
      <div className="flex justify-between w-full items-center">
        <h1 className="text-3xl text-ellipsis overflow-hidden flex-1 text-nowrap  font-bold text-foreground mb-2">{ticket.name}</h1>
        <span className="text-xl w-fit font-bold text-foreground">₦{ticket.price.toLocaleString()}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Event Date:{" "}
          {new Date(ticket.eventDate).toLocaleDateString("en-NG", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>


      <div className="border-t border-border pt-6">
      {ticket?.description && (
        <div className="">
          <h4 className="text-muted-foreground border-b border-border">Description</h4>
          <h4 className="text-lg font-medium text-foreground">{ticket?.description}</h4>
        </div>
      )}
      </div>
    </div>
  )
}
