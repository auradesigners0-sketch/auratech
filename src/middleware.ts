import { withAuth } from "next-auth/middleware";

/**
 * Protects every /admin/* route EXCEPT the login page itself.
 * Unauthenticated visitors to /admin/projects (or similar) get
 * redirected to /admin/login. Once authenticated, they pass through.
 *
 * /admin/login is intentionally public so the user can sign in.
 */
export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: ["/admin/((?!login).*)"],
};
