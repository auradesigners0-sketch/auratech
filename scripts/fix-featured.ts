/**
 * Quick fix-up: unfeature all but the first 3 projects so the homepage
 * shows exactly 3 cards as intended.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const featured = await db.project.findMany({
    where: { featured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  console.log(`Currently featured: ${featured.length}`);
  featured.forEach((p, i) => console.log(`  ${i + 1}. ${p.title} (order: ${p.order})`));

  // Keep only the first 3, unfeature the rest
  const toUnfeature = featured.slice(3);
  for (const p of toUnfeature) {
    await db.project.update({ where: { id: p.id }, data: { featured: false } });
    console.log(`\nUnfeatured: ${p.title}`);
  }

  const remaining = await db.project.findMany({
    where: { featured: true },
    orderBy: [{ order: "asc" }],
  });
  console.log(`\nNow featured: ${remaining.length}`);
  remaining.forEach((p, i) => console.log(`  ${i + 1}. ${p.title}`));
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
