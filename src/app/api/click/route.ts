import { NextResponse } from "next/server";

import { getLinkByCode, updateLink } from "@/lib/mockapi";

type RequestBody = {
  code?: string;
};

export async function PATCH(request: Request) {
  try {
    const { code } = (await request.json()) as RequestBody;

    if (!code) {
      return NextResponse.json({ error: "Missing code." }, { status: 400 });
    }

    const link = await getLinkByCode(code);
    if (!link) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const updated = await updateLink(link.id, {
      clickCount: link.clickCount + 1,
      lastClickedAt: new Date().toISOString(),
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("/api/click error", error);
    return NextResponse.json(
      { error: "Failed to update click count." },
      { status: 500 },
    );
  }
}

