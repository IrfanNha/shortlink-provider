export const VISITOR_STORAGE_KEY = "iwsl_visitor_id";

let fpPromise: Promise<import("@fingerprintjs/fingerprintjs").Agent> | null =
  null;

async function loadFingerprint(): Promise<
  import("@fingerprintjs/fingerprintjs").Agent
> {
  if (typeof window === "undefined") {
    throw new Error("FingerprintJS can only be used in the browser.");
  }

  if (!fpPromise) {
    fpPromise = import("@fingerprintjs/fingerprintjs").then((module) =>
      module.load({
        token: process.env.NEXT_PUBLIC_FINGERPRINT_KEY,
      }),
    );
  }

  return fpPromise;
}

export async function getVisitorId(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("FingerprintJS can only be used in the browser.");
  }

  const cached = readStorage();
  if (cached) {
    return cached;
  }

  const agent = await loadFingerprint();
  const result = await agent.get();
  writeStorage(result.visitorId);
  return result.visitorId;
}

function readStorage(): string | null {
  try {
    return window.localStorage.getItem(VISITOR_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStorage(value: string) {
  try {
    window.localStorage.setItem(VISITOR_STORAGE_KEY, value);
  } catch {
    // ignore write failures (private browsing / disabled storage)
  }
}

