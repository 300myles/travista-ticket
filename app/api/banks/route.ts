import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https:/api-d.squadco.com/v1/banks", {
      headers: {
        Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch banks" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Banks fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
