import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Mounts NextAuth at /api/auth/[...nextauth]
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
