// Vercel Serverless Function: GET /api/leaderboard
// Token & User ID live in Vercel Environment Variables, never in index.html.

const UPSTREAM = 'https://roobetconnect.com/affiliate/v2/stats'; // verify with your affiliate docs

export default async function handler(req, res) {
  try {
    // Monthly period (UTC): 1st of this month -> 1st of next month
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

    const url = new URL(UPSTREAM);
    url.searchParams.set('userId', process.env.ROOBET_USER_ID);
    url.searchParams.set('startDate', start.toISOString());
    url.searchParams.set('endDate', end.toISOString());

    const upstream = await fetch(url, {
      headers: { Authorization: 'Bearer ' + process.env.ROOBET_API_TOKEN },
    });
    if (!upstream.ok) {
      return res.status(502).json({ error: 'upstream ' + upstream.status });
    }

    const data = await upstream.json();
    const period = start.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ period, data });
  } catch (err) {
    return res.status(500).json({ error: 'server error' });
  }
}
