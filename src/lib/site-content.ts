import {
  Smartphone,
  Globe,
  Server,
  Cloud,
  ShieldCheck,
  Brain,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const services: Service[] = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "We craft responsive, high-performance websites and online portals for businesses across real estate, eCommerce, banking, logistics, hospitality and beyond — built to convert and scale.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Native and cross-platform Android & iOS applications using React Native, Flutter, Kotlin and Swift — engineered for speed, reliability and a delightful user experience.",
  },
  {
    icon: Server,
    title: "Custom Systems Development",
    description:
      "Bespoke systems tailored to specific business workflows: financial management, accounting, CRM, ERP, inventory and operations — built to fit how your team actually works.",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions & DevOps",
    description:
      "Cloud migration, infrastructure-as-code, CI/CD pipelines and managed deployments on AWS, Azure and Google Cloud — designed for resilience, security and cost efficiency.",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity & Audits",
    description:
      "Proactive security assessments, penetration testing, compliance reviews and 24/7 monitoring to protect your applications, data and customers from evolving threats.",
  },
  {
    icon: Brain,
    title: "AI & Data Solutions",
    description:
      "Intelligent automation, machine learning models, chatbots and analytics dashboards that turn raw data into decisions — and decisions into measurable business growth.",
  },
];

// === Engagement process — shown on the Services page ===
export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We immerse in your business, audit your existing systems, interview your team, and define clear success metrics before a single line of code is written.",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "We craft a technical roadmap aligned with your commercial goals — architecture, tech stack, milestones, budget, and a launch plan that de-risks every step.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "We design the user experience, information architecture, and key user flows. You see clickable prototypes before we commit to engineering.",
  },
  {
    number: "04",
    title: "Build",
    description:
      "We engineer the product in tight, transparent two-week iterations — daily commits, weekly demos, and a shared board so you always know where things stand.",
  },
  {
    number: "05",
    title: "Launch & Support",
    description:
      "We deploy to production, train your team, and stay on for SLA-backed monitoring, optimisation, and continuous improvement long after launch day.",
  },
];

// === Portfolio / Case studies ===
export type PortfolioItem = {
  slug: string;
  title: string;
  category: string;
  description: string; // short teaser shown on the card
  tag: string;
  accent: string;
  // Case-study detail fields
  brief: string;
  challenges: string;
  solution: string;
  results: string;
};

export const portfolioItems: PortfolioItem[] = [
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
  },
];

// === Testimonials ===
export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Auratech delivered an outstanding hospital management system that completely transformed how our clinics operate. Their attention to detail, responsiveness and technical depth were exactly what we needed to scale.",
    author: "Dr. Amani Mushi",
    role: "Medical Director",
    company: "Verdant Polyclinic Group",
  },
  {
    quote:
      "From discovery to deployment, Auratech felt like an extension of our own team. They rebuilt our payment platform with zero downtime and a 40% performance gain — true engineering craftsmanship.",
    author: "Joseph Mwakasege",
    role: "CTO",
    company: "PayFlow Africa",
  },
  {
    quote:
      "Their AI analytics dashboard gave our executives visibility we never had before. Decisions that used to take weeks now happen in a single afternoon. Worth every shilling.",
    author: "Sarah Kimathi",
    role: "Head of Operations",
    company: "AgriTrack Cooperative",
  },
];

// === Clients ===
export type Client = {
  name: string;
};

export const clients: Client[] = [
  { name: "ABC Global Church" },
  { name: "Optimus Kingdom" },
  { name: "Pizza Hub" },
  { name: "Verdant Polyclinic" },
  { name: "PayFlow Africa" },
  { name: "AgriTrack Coop" },
];

// === FAQ — shown on the Contact page ===
export type FAQ = {
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  {
    question: "I already have a Facebook page — why do I need a website?",
    answer:
      "Facebook is rented land — you don't own your audience, and they can change the rules anytime. A website is yours forever, and it appears on Google when customers search for your business. Most Tanzanian customers Google before they buy. A website also lets you collect emails, run proper analytics, and look professional when applying for tenders, partnerships, or loans.",
  },
  {
    question: "Can I pay in installments?",
    answer:
      "Yes. Standard payment is split 50% deposit + 50% before launch — no surprises. For Enterprise packages (TZS 2.5M+), we can arrange a 3-installment plan: 40% on signing, 30% at design approval, 30% before launch. We accept M-Pesa, Airtel Money, Tigo Pesa, and bank transfers.",
  },
  {
    question: "Do you build websites in Swahili?",
    answer:
      "Yes — we build websites in Swahili, English, or both. Most tourism and hospitality businesses prefer bilingual sites so they can serve local customers and international visitors. We also write content in either language (or both) — just tell us your audience and we'll recommend the right approach.",
  },
  {
    question: "What if I don't have a logo or photos?",
    answer:
      "No problem. We design logos (TZS 100,000–150,000 as an add-on) and can source professional stock photos relevant to your industry. For businesses in Dar es Salaam, we can also arrange a photo shoot — pricing depends on location and scope. Many of our clients start with stock photos and upgrade to custom photography after launch.",
  },
  {
    question: "What happens after one year?",
    answer:
      "You'll receive a renewal invoice (TZS 150,000) for your domain + hosting — we send this 45 days before expiry so there are no surprise shutdowns. If you're on a maintenance plan (TZS 25,000/month or TZS 350,000/year bundled), that renews separately. You can cancel anytime with 30 days' notice. Everything you've paid for — domain, hosting, content, code — stays yours.",
  },
];

// === Blog / Insights ===
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-we-build-with-next-js",
    title: "Why we build with Next.js",
    excerpt:
      "After shipping 40+ production apps, here's why Next.js has become our default for web work — and where we still reach for something else.",
    category: "Engineering",
    date: "Aug 2026",
    readTime: "5 min read",
  },
  {
    slug: "software-in-east-africa",
    title: "The state of software development in East Africa",
    excerpt:
      "A field report from the ground — what's changed in the last 3 years, what hasn't, and where the real opportunities are for studios willing to commit.",
    category: "Insights",
    date: "Jul 2026",
    readTime: "8 min read",
  },
  {
    slug: "cutting-cloud-bill-40-percent",
    title: "How we cut a client's cloud bill by 40%",
    excerpt:
      "A walkthrough of the audit, the quick wins, and the architectural changes that took a fintech's monthly AWS spend from $11K to $6.6K without losing a feature.",
    category: "Case Notes",
    date: "Jun 2026",
    readTime: "6 min read",
  },
  {
    slug: "designing-for-low-bandwidth",
    title: "Designing for low-bandwidth markets",
    excerpt:
      "If your users are on 3G with a $40 phone, your design rules change. Here's our playbook for building experiences that load fast and feel great on any connection.",
    category: "Design",
    date: "May 2026",
    readTime: "4 min read",
  },
];

// === Navigation ===
export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Home", href: "home" },
  { label: "About", href: "about" },
  { label: "Services", href: "services" },
  { label: "Work", href: "work" },
  { label: "Insights", href: "blog" },
  { label: "Contact", href: "contact" },
];

export const contactInfo = {
  phone: "0717043283",
  phoneHref: "tel:+255717043283",
  whatsapp: "0613400250",
  whatsappHref: "https://wa.me/255613400250",
  email: "hello@auratech.com",
  emailHref: "mailto:hello@auratech.com",
  address:
    "Dar es Salaam, Tanzania. Working remotely with clients across Africa and beyond.",
  hours: "Mon – Fri: 08:00 – 17:00 · Sat: 08:00 – 14:00",
};

// === Social links ===
export const socialLinks = {
  whatsapp: "https://wa.me/255613400250",
  instagram: "https://www.instagram.com/auratechtz?igsi=a2s2OHZxMnFkN2Y4",
  linkedin: "https://www.linkedin.com",
  facebook: "https://www.facebook.com",
};
