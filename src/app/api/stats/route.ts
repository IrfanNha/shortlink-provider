import { NextResponse } from "next/server";

import { getLinksByVisitor } from "@/lib/mockapi";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get("visitorId");

    if (!visitorId) {
      return NextResponse.json(
        { error: "Missing visitorId." },
        { status: 400 },
      );
    }

    const data = await getLinksByVisitor(visitorId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("/api/stats error", error);
    const message =
      error instanceof Error ? error.message : "Failed to load stats.";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

