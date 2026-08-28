import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/contact
 * Receives a contact form submission, validates the email,
 * persists it to the SQLite database, and returns a success
 * response. Submissions can be queried later via Prisma Studio
 * (`bunx prisma studio`) or directly from the database file.
 *
 * Future: wire in an email service (Resend, SendGrid, etc.) to
 * notify the team on each new submission.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name: string | undefined = body?.name;
    const email: string | undefined = body?.email;
    const projectType: string | undefined = body?.projectType;
    const budget: string | undefined = body?.budget;
    const message: string | undefined = body?.message;
    const source: string = body?.source || "contact-form";

    // Validate email (basic)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "A valid email is required." },
        { status: 400 }
      );
    }

    // Persist to database
    const submission = await db.contactSubmission.create({
      data: {
        name: name?.trim() || null,
        email: email.trim().toLowerCase(),
        projectType: projectType?.trim() || null,
        budget: budget?.trim() || null,
        message: message?.trim() || null,
        source,
      },
    });

    // Log to server console (visible in dev.log)
    console.log(
      `📧 New contact form submission: ${submission.email}${
        submission.name ? ` (${submission.name})` : ""
      }${submission.projectType ? ` [${submission.projectType}]` : ""}${
        submission.budget ? ` [budget: ${submission.budget}]` : ""
      }${submission.message ? ` — "${submission.message.slice(0, 80)}…"` : ""}`
    );

    return NextResponse.json({
      success: true,
      message:
        "Thank you — we'll be in touch within one business day.",
      id: submission.id,
    });
  } catch (err) {
    console.error("Contact form submission failed:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong on our end. Please try again or email us directly.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
 * Returns the count of submissions (useful for a future admin view).
 */
export async function GET() {
  try {
    const count = await db.contactSubmission.count();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("Failed to fetch submission count:", err);
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 }
    );
  }
}
