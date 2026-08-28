/**
 * Seed script — creates the default admin user + seeds the existing
 * static portfolio/blog content into the database.
 *
 * Run with: bun run scripts/seed-admin.ts
 *
 * Default credentials:
 *   Email:    admin@auratech.com
 *   Password: auratech2026
 *
 * CHANGE THE PASSWORD IMMEDIATELY after first login.
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // === 1. Create admin user if missing ===
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
    console.log("⚠️  Change this password immediately after first login!");
  }

  // === 2. Seed portfolio projects if none exist ===
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
          brief:
            "A unified web platform for a global church with 5 campuses, enabling live streaming, sermon archives, small group management, online giving, and member directories — all under one roof.",
          challenges:
            "The church was running 5 campuses with disjointed tools — a Facebook Live stream, a separate giving portal, a Google Sheet for small groups, and a WordPress site that hadn't been updated in 4 years. Members had no single place to engage, and staff were drowning in admin.",
          solution:
            "We built a unified Next.js platform with role-based access for pastors, group leaders, and members. Live streaming is embedded directly, sermons auto-archive with transcripts, small group leaders manage their rosters in-app, and giving flows through a local payment gateway with automatic receipts and tax statements.",
          results:
            "Online giving up 64% in the first quarter. Small group participation up 38%. Sermon replay views tripled. The platform now serves 4,200+ active members across 5 campuses.",
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
          brief:
            "A brand and lead-generation platform for a business consultancy — showcasing services, publishing thought leadership, qualifying leads, and routing them into a custom CRM.",
          challenges:
            "The consultancy was losing leads because their contact form just sent an email that nobody answered for days. Their case studies lived in PDFs. The site hadn't been refreshed in 3 years and didn't reflect their current positioning.",
          solution:
            "We rebuilt the platform with a services showcase, a CMS-powered blog, a multi-step lead capture form that qualifies prospects, and a custom CRM integration that auto-creates a deal pipeline entry with the lead's score and source.",
          results:
            "Lead-to-deal conversion up 2.3x. Average response time dropped from 3 days to 4 hours. Blog traffic grew 180% in 6 months. The consultancy now closes 3 of every 10 inbound leads.",
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
          brief:
            "An online ordering and delivery platform for a pizza chain — live menu, visual pizza customiser, real-time order tracking, integrated payments, and a rider dispatch dashboard.",
          challenges:
            "The chain was losing orders to aggregator apps that took 25% commission. Their in-house phone ordering was slow and error-prone. They had no real-time order tracking and customers kept calling to ask 'where's my pizza?'.",
          solution:
            "We built a customer-facing ordering web app (mobile + desktop) with a visual pizza customiser, live order tracking, and integrated mobile money + card payments. On the operations side, a dispatch dashboard auto-assigns orders to riders based on location and load.",
          results:
            "Aggregator dependency dropped from 80% to 35% of orders in 8 months. Average order value up 22% (customiser upsells). Delivery time down from 38 to 24 minutes. The platform now handles 1,200+ orders/day across 6 branches.",
          featured: true,
          order: 3,
        },
      ],
    });
    console.log("✅ Seeded 3 portfolio projects");
  } else {
    console.log(`ℹ️  Projects already exist (${projectCount}) — skipping seed`);
  }

  // === 3. Seed blog posts if none exist ===
  const blogCount = await db.blogPost.count();
  if (blogCount === 0) {
    await db.blogPost.createMany({
      data: [
        {
          slug: "why-we-build-with-next-js",
          title: "Why we build with Next.js",
          excerpt:
            "After shipping 40+ production apps, here's why Next.js has become our default for web work — and where we still reach for something else.",
          content:
            "# Why we build with Next.js\n\nAfter shipping 40+ production apps, we've learned what works at scale. Next.js has become our default for web work — here's why.\n\n## The case for Next.js\n\n**Server rendering by default.** SEO and first-contentful-paint matter. Next.js gives us both without the complexity of a separate SSR service.\n\n**File-based routing.** App Router's nested layouts let us compose pages from shared UI without prop drilling.\n\n**API routes co-located.** No separate backend service to deploy — server logic lives next to the UI that uses it.\n\n## When we don't reach for it\n\nStatic marketing sites with no interactivity? Astro is lighter. Heavy real-time apps? We'll still reach for a separate Node service. But for everything in between — SaaS, dashboards, e-commerce, marketing sites with a CMS — Next.js is our default.",
          category: "Engineering",
          date: "Aug 2026",
          readTime: "5 min read",
        },
        {
          slug: "software-in-east-africa",
          title: "The state of software development in East Africa",
          excerpt:
            "A field report from the ground — what's changed in the last 3 years, what hasn't, and where the real opportunities are for studios willing to commit.",
          content:
            "# The state of software development in East Africa\n\nA field report from the ground.\n\n## What's changed\n\nInternet penetration crossed 40% in 2025. Mobile money is the default — cards are an afterthought. Cloud regions in Cape Town and Nairobi dropped latency from 300ms to 60ms for end users.\n\n## What hasn't\n\nPayment integration is still painful. Stripe isn't here. Local gateways have inconsistent APIs. We still write our own abstractions.\n\n## Where the opportunities are\n\nAgriTech, FinTech for the underbanked, logistics tech for the last mile. Anyone willing to commit to the market for 5+ years will find a deep moat.",
          category: "Insights",
          date: "Jul 2026",
          readTime: "8 min read",
        },
        {
          slug: "cutting-cloud-bill-40-percent",
          title: "How we cut a client's cloud bill by 40%",
          excerpt:
            "A walkthrough of the audit, the quick wins, and the architectural changes that took a fintech's monthly AWS spend from $11K to $6.6K without losing a feature.",
          content:
            "# How we cut a client's cloud bill by 40%\n\nA walkthrough of the audit, quick wins, and architectural changes.\n\n## The starting point\n\nA fintech running on AWS, $11K/month spend. EC2 instances over-provisioned. RDS with no read replicas. CloudFront in front of an S3 bucket that was already fronted by an ALB.\n\n## Quick wins (saved $2K/month)\n\n- Right-sized EC2 instances (most were 2x what they needed)\n- Moved static assets off EC2 to S3 + CloudFront\n- Switched RDS to Graviton instances\n\n## Architectural changes (saved $2.4K/month)\n\n- Moved background jobs to Lambda + SQS\n- Replaced self-managed Redis to ElastiCache Serverless\n- Implemented CDN caching for API responses where safe",
          category: "Case Notes",
          date: "Jun 2026",
          readTime: "6 min read",
        },
        {
          slug: "designing-for-low-bandwidth",
          title: "Designing for low-bandwidth markets",
          excerpt:
            "If your users are on 3G with a $40 phone, your design rules change. Here's our playbook for building experiences that load fast and feel great on any connection.",
          content:
            "# Designing for low-bandwidth markets\n\nIf your users are on 3G with a $40 phone, your design rules change.\n\n## The principles\n\n**Ship less.** Every image is a tax. Every animation is a tax. We measure LCP religiously and target < 2.5s on a 1.5 Mbps connection.\n\n**Use SVG over raster.** Smaller, scales perfectly, themable. We replaced hero PNGs with hand-built SVG illustrations.\n\n**Defer everything below the fold.** Lazy-load images, defer non-critical JS, code-split aggressively.\n\n## Our playbook\n\n1. Audit with WebPageTest on a 3G profile\n2. Replace images with SVG where possible\n3. Code-split routes and components\n4. Inline critical CSS\n5. Defer all third-party scripts",
          category: "Design",
          date: "May 2026",
          readTime: "4 min read",
        },
      ],
    });
    console.log("✅ Seeded 4 blog posts");
  } else {
    console.log(`ℹ️  Blog posts already exist (${blogCount}) — skipping seed`);
  }

  console.log("\n✅ Seed complete.");
  console.log("\nAdmin login:");
  console.log(`  URL:      /admin/login`);
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
