export function getPlayerIdFromCookie(request: Request): string | null {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === 'player_id' && value) {
      return value;
    }
  }
  return null;
}

export function generatePlayerId(): string {
  return crypto.randomUUID();
}

export function makePlayerIdCookie(playerId: string): string {
  return [
    `player_id=${playerId}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Max-Age=31536000',
  ].join('; ');
}
