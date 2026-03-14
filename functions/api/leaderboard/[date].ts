export const onRequestGet: PagesFunction = async () => {
  // Leaderboard requires Durable Objects (separate Worker) — not yet deployed
  return Response.json({
    entries: [],
    playerRank: 0,
    totalPlayers: 0,
  });
};
