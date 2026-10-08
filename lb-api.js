// Vercel Serverless Function.
// Set ROOBET_API_TOKEN in Vercel Project Settings -> Environment Variables.
// Never put the token in index.html.

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.ROOBET_API_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'ROOBET_API_TOKEN is not configured on the server.' });
  }

  const { userId, startDate, endDate } = req.query || {};
  if (!userId || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing userId, startDate or endDate.' });
  }

  const upstream = new URL('https://roobetconnect.com/affiliate/v2/stats');
  upstream.searchParams.set('userId', userId);
  upstream.searchParams.set('startDate', startDate);
  upstream.searchParams.set('endDate', endDate);

  try {
    const response = await fetch(upstream, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });

    const body = await response.text();

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    return res.status(response.status).send(body);
  } catch (error) {
    return res.status(502).json({ error: 'Could not reach Roobet affiliate statistics API.' });
  }
}
