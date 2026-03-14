export const onRequestPost: PagesFunction = async () => {
  // Leaderboard requires Durable Objects (separate Worker) — not yet deployed
  return Response.json({ rank: 0 });
};
