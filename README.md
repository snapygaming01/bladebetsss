# BladeBets Live Leaderboard

Deploy this folder/project on Vercel.

1. Add an Environment Variable named `ROOBET_API_TOKEN`.
2. Put your Roobet affiliate API token in that variable.
3. Redeploy.
4. Open the site and click Leaderboard.

The browser calls `/api/lb-api`; the serverless function calls Roobet with the secret token, so the credential is not exposed in the public HTML.

IMPORTANT: the token was pasted into chat and was present in the old HTML. Rotate/revoke that token and create a replacement before deploying.

The page refreshes every 5 minutes, while Roobet says affiliate statistics are updated hourly.
