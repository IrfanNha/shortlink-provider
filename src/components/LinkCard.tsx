'use client';

import { useMemo, useState } from "react";

import { BASE_URL } from "@/constants/api";
import type { ShortlinkRecord } from "@/lib/mockapi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type LinkCardProps = {
  link: ShortlinkRecord;
};

export function LinkCard({ link }: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const shortUrl = useMemo(
    () => `${BASE_URL}/${link.code}`,
    [link.code],
  );

  async function handleCopy() {
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        throw new Error();
      }
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Card className="border border-[#E5E5E5] bg-white shadow-sm">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="truncate text-lg font-semibold text-[#1A1A1A]">
          {link.originalUrl}
        </CardTitle>
        <Badge className="w-fit rounded-[6px] bg-[#F2F2F2] px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-[#666]">
          {new Intl.DateTimeFormat("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(link.createdAt))}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <code className="flex-1 truncate text-sm font-semibold text-[#007AFF]">
            {shortUrl}
          </code>
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="h-9 rounded-[6px] border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white"
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="text-sm text-[#666]">
          Total clicks:{" "}
          <span className="font-semibold text-[#1A1A1A]">
            {link.clickCount}
          </span>
        </p>
        {link.lastClickedAt && (
          <p className="text-xs uppercase tracking-[0.3em] text-[#7ED957]">
            Last clicked:{" "}
            {new Intl.DateTimeFormat("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(link.lastClickedAt))}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          className="text-sm font-medium text-[#FF6F00] hover:bg-[#FF6F00]/10"
          onClick={() => window.open(link.originalUrl, "_blank", "noopener")}
        >
          Visit original
        </Button>
      </CardFooter>
    </Card>
  );
}

