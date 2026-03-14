import type { LeaderboardEntry } from '../../src/types';

export class DailyLeaderboard {
  state: DurableObjectState;
  entries: LeaderboardEntry[] = [];

  constructor(state: DurableObjectState) {
    this.state = state;
    this.state.blockConcurrencyWhile(async () => {
      this.entries = (await this.state.storage.get<LeaderboardEntry[]>('entries')) ?? [];
    });
  }

  async fetch(request: Request) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/submit') {
      const entry: LeaderboardEntry = await request.json();

      if (this.entries.some(e => e.playerId === entry.playerId)) {
        return new Response(JSON.stringify({ error: 'Already submitted' }), { status: 409 });
      }

      this.entries.push(entry);
      this.entries.sort((a, b) => {
        if (a.attempts !== b.attempts) return a.attempts - b.attempts;
        if (a.seasonCorrect !== b.seasonCorrect) return b.seasonCorrect ? 1 : -1;
        return a.completedAt - b.completedAt;
      });

      await this.state.storage.put('entries', this.entries);

      const rank = this.entries.findIndex(e => e.playerId === entry.playerId) + 1;
      return Response.json({ rank });
    }

    if (request.method === 'GET' && url.pathname === '/top') {
      const playerId = url.searchParams.get('playerId');
      const top100 = this.entries.slice(0, 100);
      const playerRank = playerId
        ? this.entries.findIndex(e => e.playerId === playerId) + 1
        : 0;
      return Response.json({
        entries: top100,
        playerRank,
        totalPlayers: this.entries.length,
      });
    }

    return new Response('Not found', { status: 404 });
  }
}
