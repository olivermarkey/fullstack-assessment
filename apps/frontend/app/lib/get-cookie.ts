/**
 * Gets the access token from the cookie in a server-side context
 * @param request The request object containing cookies
 * @returns The access token or undefined if not found
 */
export function getAccessTokenFromCookie(request: Request): string | undefined {
  const cookie = request.headers.get("cookie");
  console.log("[Get Access Token] Cookie:", cookie);
  if (!cookie) return undefined;

  const sessionMatch = cookie.match(/session_id=([^;]+)/);
  return sessionMatch ? sessionMatch[1] : undefined;
}

/**
 * Gets the access token from the session_id cookie in a client-side context
 * @returns The access token or undefined if not found
 */
export function getClientAccessToken(): string | undefined {
  // Log all cookies for debugging
  const allCookies = document.cookie.split(';').map(c => c.trim());
  console.log('[GetClientAccessToken] All cookies:', allCookies);

  // Try different ways to get the cookie
  const rawCookie = document.cookie;
  console.log('[GetClientAccessToken] Raw cookie string:', rawCookie);

  // Try direct regex match
  const sessionMatch = rawCookie.match(/session_id=([^;]+)/);
  console.log('[GetClientAccessToken] Direct regex match:', sessionMatch?.[1]);

  // Try finding the cookie manually
  const sessionCookie = allCookies.find(c => c.startsWith('session_id='));
  console.log('[GetClientAccessToken] Manual cookie search:', sessionCookie);

  if (!sessionCookie) {
    console.log('[GetClientAccessToken] No session_id cookie found');
    return undefined;
  }

  const [_, value] = sessionCookie.split('=');
  
  if (!value) {
    console.log('[GetClientAccessToken] Cookie found but no value');
    return undefined;
  }

  // Try to decode if it's base64
  try {
    const decodedToken = atob(value);
    console.log('[GetClientAccessToken] Successfully decoded token:', decodedToken);
    return decodedToken;
  } catch (error) {
    console.error('[GetClientAccessToken] Error decoding token:', error);
    // If decoding fails, return the raw value
    return value;
  }
}
