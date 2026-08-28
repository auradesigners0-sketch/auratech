import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clients as staticClients } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export type PublicClient = {
  id: string;
  name: string;
  logoData: string | null; // base64 data URL, or null if using initials fallback
};

/**
 * GET /api/clients
 * Returns published clients ordered by `order` asc.
 * Falls back to static `clients` array from site-content.ts if DB is empty.
 */
export async function GET() {
  const rows = await db.client.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  if (rows.length === 0) {
    const fallback: PublicClient[] = staticClients.map((c, i) => ({
      id: `static-${i}`,
      name: c.name,
      logoData: null, // null = component will render initials
    }));
    return NextResponse.json({ clients: fallback });
  }

  const clients: PublicClient[] = rows.map((c) => ({
    id: c.id,
    name: c.name,
    logoData: c.logoData,
  }));

  return NextResponse.json({ clients });
}
