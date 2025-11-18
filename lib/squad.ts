import crypto from "crypto";

const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY || "";
const SQUAD_PUBLIC_KEY = process.env.SQUAD_PUBLIC_KEY || "";

export function verifySquadWebhook(signature: string, body: string) {
  const hash = crypto
    .createHmac("sha256", SQUAD_SECRET_KEY)
    .update(body)
    .digest("hex");
  return hash === signature;
}

export async function createSquadPaymentLink(
  amount: number,
  email: string,
  reference: string,
  callbackUrl: string
) {
  const response = await fetch(
    "https://api-d.squadco.com/transaction/initiate",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SQUAD_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100,
        // key: SQUAD_PUBLIC_KEY,
        email,
        currency: "NGN",
        initiate_type: "inline",
        customer_name: email.split("@")[0],
        transaction_ref: reference,
        callback_url: callbackUrl,
      }),
    }
  );

  const data = await response.json();

  console.log("Squad Payment Link Response:", data);
  return data;
}

export async function verifySquadPayment(transactionRef: string) {
  const response = await fetch(
    `https://api-d.squadco.com/transaction/verify/${transactionRef}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${SQUAD_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return data;
}

export async function initializeSquadPayout(
  amount: number,
  accountNumber: string,
  bankCode: string,
  narration: string,
  reference: string
) {
  const response = await fetch("https://api.squadco.com/v1/payout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SQUAD_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: SQUAD_PUBLIC_KEY,
      amount,
      account_number: accountNumber,
      bank_code: bankCode,
      narration,
      currency: "NGN",
      reference,
    }),
  });

  const data = await response.json();
  return data;
}

export async function getSquadBanks() {
  const response = await fetch("https://api.squadco.com/v1/bank/list", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${SQUAD_SECRET_KEY}`,
    },
  });

  const data = await response.json();
  return data;
}

export async function verifySquadAccountNumber(
  accountNumber: string,
  bankCode: string
) {
  const response = await fetch(
    `https://api-d.squadco.com/payout/account/lookup`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SQUAD_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bank_code: bankCode,
        account_number: accountNumber,
      }),
    }
  );

  const data = await response.json();

  console.log("Account Verification Response:", data);
  return data;
}
