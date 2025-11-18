export async function sendWhatsAppMessage(phone: string, message: string) {
  const token = process.env.WHATSAPP_API_TOKEN

  if (!token) {
    console.log("WhatsApp API token not configured, skipping message sending")
    return { success: false, method: "manual" }
  }

  try {
    const response = await fetch("https://graph.instagram.com/v18.0/YOUR_PHONE_NUMBER_ID/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone.replace(/\D/g, ""),
        type: "text",
        text: {
          body: message,
        },
      }),
    })

    if (!response.ok) {
      console.error("WhatsApp API error:", await response.text())
      return { success: false, method: "manual" }
    }

    return { success: true, method: "api" }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error)
    return { success: false, method: "manual" }
  }
}

export function generateWhatsAppLink(phone: string, message: string) {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encoded}`
}

export async function sendTicketWhatsApp(
  phoneNumber: string,
  buyerName: string,
  ticketName: string,
  ticketUID: string,
) {
  try {
    const message = `Hello ${buyerName},\n\nYour ticket for ${ticketName} is ready!\n\nTicket ID: ${ticketUID}\n\nView your ticket: ${process.env.NEXT_PUBLIC_BASE_URL}/ticket/${ticketUID}`

    // Try API first, fallback to wa.me link
    const apiResult = await sendWhatsAppMessage(phoneNumber, message)

    if (apiResult.success) {
      return { success: true, method: "api" }
    }

    // Fallback to wa.me link
    const waLink = generateWhatsAppLink(phoneNumber, message)
    console.log(`WhatsApp link (fallback): ${waLink}`)
    return { success: true, method: "manual", url: waLink }
  } catch (error) {
    console.error("Error sending ticket WhatsApp:", error)
    return { success: false, error }
  }
}

export async function sendWithdrawalNotification(phoneNumber: string, amount: number, reference: string) {
  try {
    const message = `Your withdrawal request of ₦${amount.toLocaleString()} has been initiated. Reference: ${reference}`

    const apiResult = await sendWhatsAppMessage(phoneNumber, message)

    if (apiResult.success) {
      return { success: true, method: "api" }
    }

    const waLink = generateWhatsAppLink(phoneNumber, message)
    console.log(`Withdrawal notification link (fallback): ${waLink}`)
    return { success: true, method: "manual", url: waLink }
  } catch (error) {
    console.error("Error sending withdrawal WhatsApp:", error)
    return { success: false, error }
  }
}
