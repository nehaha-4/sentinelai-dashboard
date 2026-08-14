// /api/verify-admin.js
// Vercel serverless function. Checks the admin password server-side so it
// never appears in your frontend JavaScript bundle (where anyone could
// read it via browser DevTools -> Sources, or "View Page Source").
//
// SETUP:
// 1. Vercel dashboard -> Settings -> Environment Variables
//    Add ADMIN_PASSWORD = <a password only you know>
// 2. Redeploy after adding it.
// 3. Frontend calls fetch('/api/verify-admin', { method: 'POST', body: { pin } })
//    and trusts the { success: true/false } response instead of comparing
//    the typed value to a hardcoded string.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const correctPassword = process.env.ADMIN_PASSWORD;
  if (!correctPassword) {
    return res.status(500).json({ error: "Server missing ADMIN_PASSWORD env var" });
  }

  const { pin } = req.body || {};

  if (pin === correctPassword) {
    return res.status(200).json({ success: true });
  }

  // Deliberately vague failure message + no distinction between "wrong
  // password" and "no password sent" — don't give attackers extra signal.
  return res.status(401).json({ success: false, error: "Invalid Security Key. Unauthorized Access Logged." });
}
