"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Admin layout — wraps every /admin/* route in the SessionProvider
 * so client components can use useSession() and signIn()/signOut().
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
