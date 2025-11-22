import { ensureServerSide } from "./proxy";

export type ShortlinkRecord = {
  id: string;
  code: string;
  originalUrl: string;
  visitorId: string;
  clickCount: number;
  createdAt: string;
  lastClickedAt: string;
};

export type ShortlinkCreatePayload = Omit<
  ShortlinkRecord,
  "id" | "clickCount" | "createdAt" | "lastClickedAt"
> & {
  clickCount?: number;
  createdAt?: string;
  lastClickedAt?: string;
};

export type ShortlinkUpdatePayload = Partial<
  Pick<ShortlinkRecord, "originalUrl" | "clickCount" | "lastClickedAt">
>;


function getMockApiBase(): string {
  const base = process.env.MOCKAPI_URL;
  if (!base) {
    throw new Error(
      "Environment variable MOCKAPI_URL is not set. Please add it to .env.local"
    );
  }
  return base;
}

function buildUrl(endpoint: string): string {
  const base = getMockApiBase().endsWith("/")
    ? getMockApiBase().slice(0, -1)
    : getMockApiBase();
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

async function safeReadErrorMessage(
  response: Response
): Promise<string | null> {
  try {
    const body = (await response.json()) as {
      message?: string;
      error?: string;
    };
    return body.message ?? body.error ?? null;
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, init?: RequestInit): Promise<T> {
  // Ensure this function is only called server-side
  ensureServerSide('mockapi.request');

  const url = buildUrl(endpoint);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    ...init,
  });

  if (!response.ok) {
    const message = await safeReadErrorMessage(response);
    throw new Error(
      `MockAPI request failed (${response.status}) for ${url}: ${message ?? response.statusText
      }`
    );
  }

  return response.json() as Promise<T>;
}

export async function createShortlink(
  data: ShortlinkCreatePayload
): Promise<ShortlinkRecord> {
  return request<ShortlinkRecord>("links", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getLinkByCode(
  code: string
): Promise<ShortlinkRecord | undefined> {
  const searchParams = new URLSearchParams({ code });
  const url = buildUrl(`links?${searchParams.toString()}`);
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (response.status === 404) return undefined;
  if (!response.ok) {
    const message = await safeReadErrorMessage(response);
    throw new Error(
      `MockAPI request failed (${response.status}) for ${url}: ${message ?? response.statusText
      }`
    );
  }

  const records = (await response.json()) as ShortlinkRecord[];
  return records.at(0);
}

export async function updateLink(
  id: string,
  updates: ShortlinkUpdatePayload
): Promise<ShortlinkRecord> {
  return request<ShortlinkRecord>(`links/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function getLinksByVisitor(
  visitorId: string
): Promise<ShortlinkRecord[]> {
  const searchParams = new URLSearchParams({ visitorId });
  const url = buildUrl(`links?${searchParams.toString()}`);
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (response.status === 404) return [];
  if (!response.ok) {
    const message = await safeReadErrorMessage(response);
    throw new Error(
      `MockAPI request failed (${response.status}) for ${url}: ${message ?? response.statusText
      }`
    );
  }

  return response.json() as Promise<ShortlinkRecord[]>;
}
