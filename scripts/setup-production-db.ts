/**
 * Production database setup script.
 *
 * Run this ONCE after creating your Supabase project to:
 *   1. Push the Prisma schema (creates all tables)
 *   2. Seed the admin user + initial projects + blog posts + clients
 *
 * Usage:
 *   DATABASE_URL="your-supabase-connection-string" bun run scripts/setup-production-db.ts
 *
 * Or set DATABASE_URL in your .env first, then:
 *   bun run scripts/setup-production-db.ts
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

// Use a fresh PrismaClient (not the cached one) so it picks up the
// production DATABASE_URL from env
const db = new PrismaClient();

async function main() {
  console.log("🚀 Auratech Production Database Setup\n");
  console.log(`Database URL: ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":****@")}\n`);

  // === 1. Push schema ===
  console.log("📋 Step 1: Schema is pushed via `bun run db:push`.");
  console.log("   Make sure you've run: bun run db:push");
  console.log("   (This script assumes tables already exist.)\n");

  // === 2. Create admin user ===
  const email = "admin@auratech.com";
  const password = "auratech2026";

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`ℹ️  Admin user already exists: ${email}`);
  } else {
    const hash = await bcrypt.hash(password, 10);
    await db.user.create({
      data: {
        email,
        name: "Auratech Admin",
        password: hash,
        role: "ADMIN",
      },
    });
    console.log(`✅ Created admin user: ${email} / ${password}`);
    console.log("⚠️  CHANGE THIS PASSWORD after first login!");
  }

  // === 3. Seed portfolio projects ===
  const projectCount = await db.project.count();
  if (projectCount === 0) {
    await db.project.createMany({
      data: [
        {
          slug: "abc-global-church",
          title: "ABC Global Church",
          category: "Church & Community Platform",
          description:
            "A modern web platform for a global church — live streaming, sermon library, small group management, online giving, and member directories across multiple campuses.",
          tag: "Web",
          accent: "from-[#1B4332] to-[#143A2B]",
          brief: "A unified web platform for a global church with 5 campuses.",
          challenges: "5 campuses with disjointed tools — Facebook Live, separate giving portal, Google Sheets for small groups.",
          solution: "Unified Next.js platform with role-based access, live streaming, sermon archives, small group management, and integrated giving.",
          results: "Online giving up 64%. Small group participation up 38%. 4,200+ active members across 5 campuses.",
          featured: true,
          order: 1,
        },
        {
          slug: "optimus-kingdom",
          title: "Optimus Kingdom",
          category: "Brand & Business Platform",
          description:
            "A bold brand platform for a business consultancy — services showcase, thought-leadership blog, client portal, and integrated lead-capture flowing into a custom CRM.",
          tag: "Web",
          accent: "from-[#7ED957] to-[#1B4332]",
          brief: "A brand and lead-generation platform for a business consultancy.",
          challenges: "Losing leads due to slow email responses. Case studies in PDFs. Site hadn't been refreshed in 3 years.",
          solution: "Services showcase, CMS-powered blog, multi-step lead capture form, custom CRM integration.",
          results: "Lead-to-deal conversion up 2.3x. Response time dropped from 3 days to 4 hours. Blog traffic grew 180%.",
          featured: true,
          order: 2,
        },
        {
          slug: "pizza-hub",
          title: "Pizza Hub",
          category: "Food Ordering & Delivery",
          description:
            "An online ordering and delivery platform for a pizza chain — live menu, customiser, real-time order tracking, integrated payments, and a rider dispatch dashboard.",
          tag: "Web",
          accent: "from-[#1B4332] to-[#0F2D20]",
          brief: "An online ordering and delivery platform for a pizza chain.",
          challenges: "Losing orders to aggregator apps taking 25% commission. Phone ordering was slow and error-prone.",
          solution: "Customer-facing ordering web app with visual pizza customiser, live order tracking, integrated mobile money + card payments, rider dispatch dashboard.",
          results: "Aggregator dependency dropped from 80% to 35%. Average order value up 22%. Delivery time down from 38 to 24 minutes.",
          featured: true,
          order: 3,
        },
      ],
    });
    console.log("✅ Seeded 3 portfolio projects");
  } else {
    console.log(`ℹ️  Projects already exist (${projectCount}) — skipping seed`);
  }

  // === 4. Seed blog posts ===
  const blogCount = await db.blogPost.count();
  if (blogCount === 0) {
    await db.blogPost.createMany({
      data: [
        {
          slug: "why-we-build-with-next-js",
          title: "Why we build with Next.js",
          excerpt: "After shipping 40+ production apps, here's why Next.js has become our default for web work.",
          content: "# Why we build with Next.js\n\nAfter shipping 40+ production apps, we've learned what works at scale.\n\n## The case for Next.js\n\n**Server rendering by default.** SEO and first-contentful-paint matter.\n\n**File-based routing.** App Router's nested layouts let us compose pages from shared UI.\n\n**API routes co-located.** No separate backend service to deploy.\n\n## When we don't reach for it\n\nStatic marketing sites? Astro is lighter. Heavy real-time apps? Separate Node service. But for everything in between — SaaS, dashboards, e-commerce — Next.js is our default.",
          category: "Engineering",
          date: "Aug 2026",
          readTime: "5 min read",
        },
        {
          slug: "software-in-east-africa",
          title: "The state of software development in East Africa",
          excerpt: "A field report from the ground — what's changed, what hasn't, and where the opportunities are.",
          content: "# The state of software development in East Africa\n\n## What's changed\n\nInternet penetration crossed 40% in 2025. Mobile money is the default. Cloud regions in Cape Town and Nairobi dropped latency from 300ms to 60ms.\n\n## What hasn't\n\nPayment integration is still painful. Stripe isn't here. Local gateways have inconsistent APIs.\n\n## Where the opportunities are\n\nAgriTech, FinTech for the underbanked, logistics tech for the last mile.",
          category: "Insights",
          date: "Jul 2026",
          readTime: "8 min read",
        },
      ],
    });
    console.log("✅ Seeded 2 blog posts");
  } else {
    console.log(`ℹ️  Blog posts already exist (${blogCount}) — skipping seed`);
  }

  console.log("\n✅ Production database setup complete!");
  console.log("\n📋 Next steps:");
  console.log("  1. Deploy to Netlify (see download/SUPABASE-NETLIFY-DEPLOY.md)");
  console.log("  2. Set NEXTAUTH_URL in Netlify env vars to your Netlify URL");
  console.log("  3. Sign in at /admin/login with admin@auratech.com / auratech2026");
  console.log("  4. CHANGE THE ADMIN PASSWORD immediately");
}

main()
  .catch((e) => {
    console.error("\n❌ Setup failed:", e);
    console.error("\nMake sure:");
    console.error("  1. You've run `bun run db:push` first to create tables");
    console.error("  2. DATABASE_URL is set to your Supabase connection string");
    console.error("  3. Your IP is allowed in Supabase (Settings → Database → Network restrictions)");
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
