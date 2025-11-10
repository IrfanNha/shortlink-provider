import { NextResponse } from "next/server";

import { BASE_URL } from "@/constants/api";
import {
  createShortlink,
  getLinkByCode,
  type ShortlinkRecord,
} from "@/lib/mockapi";

type RequestBody = {
  url?: string;
  visitorId?: string;
};

function generateCode() {
  return Math.random().toString(36).slice(2, 8);
}

async function resolveUniqueCode(): Promise<string> {
  let code = generateCode();
  let attempts = 0;

  // Try a few times to avoid collisions.
  while (attempts < 5) {
    // eslint-disable-next-line no-await-in-loop -- sequential check is required
    const existing = await getLinkByCode(code);
    if (!existing) {
      return code;
    }
    code = generateCode();
    attempts += 1;
  }

  throw new Error("Unable to generate unique shortlink code.");
}

export async function POST(request: Request) {
  try {
    const { url, visitorId } = (await request.json()) as RequestBody;

    if (!url) {
      return NextResponse.json(
        { error: "Missing URL in request body." },
        { status: 400 },
      );
    }

    if (!visitorId) {
      return NextResponse.json(
        { error: "Missing visitorId in request body." },
        { status: 400 },
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format." },
        { status: 400 },
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "URL must start with http or https." },
        { status: 400 },
      );
    }

    const code = await resolveUniqueCode();
    const created = await createShortlink({
      code,
      originalUrl: parsedUrl.toString(),
      visitorId,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      lastClickedAt: "",
    });

    const payload: { shortUrl: string; link: ShortlinkRecord } = {
      shortUrl: `${BASE_URL}/${created.code}`,
      link: created,
    };

    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    console.error("/api/shorten error", error);
    const message =
      error instanceof Error ? error.message : "Failed to create shortlink.";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

