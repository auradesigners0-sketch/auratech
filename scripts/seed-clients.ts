/**
 * Seed a few client logos directly into the DB so we can verify the
 * public "Trusted By" strip renders real logos.
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const db = new PrismaClient();

// Read the test logo and convert to base64 data URL
const logoBuffer = fs.readFileSync("/tmp/test-logo.png");
const logoBase64 = logoBuffer.toString("base64");
const logoDataUrl = `data:image/png;base64,${logoBase64}`;

async function main() {
  const existing = await db.client.count();
  console.log(`Current clients: ${existing}`);

  if (existing > 0) {
    console.log("Clients already exist, skipping seed.");
    return;
  }

  // Create 4 clients — all using the same test logo for now
  // (in real use, each would have its own logo uploaded via admin)
  const clients = [
    { name: "ABC Global Church", order: 1 },
    { name: "Optimus Kingdom", order: 2 },
    { name: "Pizza Hub", order: 3 },
    { name: "Verdant Polyclinic", order: 4 },
  ];

  for (const c of clients) {
    await db.client.create({
      data: {
        name: c.name,
        logoData: logoDataUrl,
        order: c.order,
        published: true,
      },
    });
    console.log(`✅ Created: ${c.name}`);
  }

  const total = await db.client.count();
  console.log(`\nTotal clients now: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
