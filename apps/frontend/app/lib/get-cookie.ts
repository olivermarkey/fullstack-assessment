export function getAccessTokenFromCookie(request: Request): string | undefined {
    const cookie = request.headers.get('cookie');
    if (!cookie) return undefined;
    
    const sessionMatch = cookie.match(/session_id=([^;]+)/);
    return sessionMatch ? sessionMatch[1] : undefined;
  }