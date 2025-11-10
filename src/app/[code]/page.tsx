import { notFound, redirect } from "next/navigation";

import { getLinkByCode, updateLink } from "@/lib/mockapi";

type PageProps = {
  params: Promise<{
    code: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function RedirectPage({ params }: PageProps) {
  const { code } = await params;

  const link = await getLinkByCode(code);

  if (!link) {
    return notFound();
  }

  void updateLink(link.id, {
    clickCount: link.clickCount + 1,
    lastClickedAt: new Date().toISOString(),
  }).catch((error) => {
    console.error("Failed to record click", error);
  });

  return redirect(link.originalUrl);
}

