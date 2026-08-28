/**
 * Quick test: creates 3 more projects so we have 6 total to test the
 * homepage "show only 6" behavior. Uses the NextAuth session cookie
 * obtained by calling /api/auth/callback/credentials.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const existing = await db.project.count();
  console.log(`Current project count: ${existing}`);

  const toCreate = [
    {
      slug: "payflow-africa",
      title: "PayFlow Africa",
      category: "Fintech Platform",
      description: "A payment platform rebuilt for zero downtime and 40% performance gain.",
      tag: "Web",
      accent: "from-[#1B4332] to-[#0F2D20]",
      brief: "Payment platform for African markets.",
      challenges: "Slow legacy system, frequent downtime.",
      solution: "Re-architected with microservices and real-time fraud detection.",
      results: "Zero downtime. 40% performance gain. 1M+ daily transactions.",
      featured: true,
      order: 4,
    },
    {
      slug: "agritrack-coop",
      title: "AgriTrack Cooperative",
      category: "AgriTech Platform",
      description: "An AI analytics dashboard giving executives visibility they never had before.",
      tag: "AI",
      accent: "from-[#7ED957] to-[#1B4332]",
      brief: "Analytics platform for agricultural cooperatives.",
      challenges: "Decisions took weeks due to lack of data.",
      solution: "Built an AI analytics dashboard with real-time data from IoT sensors.",
      results: "Decisions now happen in a single afternoon. 30% yield improvement.",
      featured: true,
      order: 5,
    },
    {
      slug: "kilimanjaro-logistics",
      title: "Kilimanjaro Logistics",
      category: "Logistics Platform",
      description: "A fleet management and route optimisation system for a regional logistics company.",
      tag: "Web",
      accent: "from-[#1B4332] to-[#143A2B]",
      brief: "Logistics platform for East African shipping.",
      challenges: "Manual dispatch, no real-time tracking.",
      solution: "Built a fleet management dashboard with GPS tracking and route optimisation.",
      results: "Delivery time down 35%. Fuel cost down 22%. 500+ trucks managed.",
      featured: false,
      order: 6,
    },
  ];

  for (const p of toCreate) {
    const exists = await db.project.findUnique({ where: { slug: p.slug } });
    if (exists) {
      console.log(`ℹ️  Already exists: ${p.slug}`);
      continue;
    }
    await db.project.create({ data: p });
    console.log(`✅ Created: ${p.slug}`);
  }

  const total = await db.project.count();
  console.log(`\nTotal projects now: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
