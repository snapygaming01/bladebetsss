export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, startDate, endDate } = req.query;

  if (!userId || !startDate || !endDate) {
    return res.status(400).json({
      error: "Missing userId, startDate or endDate"
    });
  }

  const token = process.env.ROOBET_API_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: "ROOBET_API_TOKEN is not configured"
    });
  }

  try {
    const url = new URL(
      "https://roobetconnect.com/affiliate/v2/stats"
    );

    url.searchParams.set("userId", userId);
    url.searchParams.set("startDate", startDate);
    url.searchParams.set("endDate", endDate);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    const data = await response.text();

    res.setHeader("Cache-Control", "no-store");
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/json"
    );

    return res.status(response.status).send(data);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch Roobet leaderboard data",
      details: error.message
    });
  }
}
