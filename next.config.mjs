/** @type {import('next').NextConfig} */

// After deploying VisualLearn to Vercel, replace this with the actual
// internal deployment URL (e.g. https://visuallearn-abc123.vercel.app)
// Never assign a public custom domain to the VisualLearn Vercel project.
const VISUALLEARN_URL = process.env.VISUALLEARN_URL || 'https://visuallearn-app.vercel.app'

const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      // ── Auth ──────────────────────────────────────────────────────────────
      { source: '/login',                       destination: `${VISUALLEARN_URL}/login` },
      { source: '/signup',                      destination: `${VISUALLEARN_URL}/signup` },
      { source: '/onboarding',                  destination: `${VISUALLEARN_URL}/onboarding` },

      // ── Core app ──────────────────────────────────────────────────────────
      { source: '/dashboard',                   destination: `${VISUALLEARN_URL}/dashboard` },
      { source: '/dashboard/:path*',            destination: `${VISUALLEARN_URL}/dashboard/:path*` },
      { source: '/explore',                     destination: `${VISUALLEARN_URL}/explore` },
      { source: '/explore/:slug*',              destination: `${VISUALLEARN_URL}/explore/:slug*` },
      { source: '/lesson/:lessonId',            destination: `${VISUALLEARN_URL}/lesson/:lessonId` },
      { source: '/subject/:id',                 destination: `${VISUALLEARN_URL}/subject/:id` },
      { source: '/library',                     destination: `${VISUALLEARN_URL}/library` },
      { source: '/profile',                     destination: `${VISUALLEARN_URL}/profile` },
      { source: '/challenge',                   destination: `${VISUALLEARN_URL}/challenge` },
      { source: '/demo',                        destination: `${VISUALLEARN_URL}/demo` },

      // ── Educator ──────────────────────────────────────────────────────────
      { source: '/teacher',                     destination: `${VISUALLEARN_URL}/teacher` },
      { source: '/teacher/:path*',              destination: `${VISUALLEARN_URL}/teacher/:path*` },
    ]
  },
}

export default nextConfig
