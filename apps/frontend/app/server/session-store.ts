import { createCookieSessionStorage } from "react-router";
import type { Session } from "react-router";
// In-memory store for sessions (in production, use Redis or similar)
const sessionStore = new Map<string, string>(); // Just store the access token

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "session_id",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "default-secret"],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  const session = await sessionStorage.getSession(cookie);
  const sessionId = session.get("sessionId");
  
  if (sessionId) {
    const accessToken = sessionStore.get(sessionId);
    if (accessToken) {
      session.set("auth_tokens", { AccessToken: accessToken });
    }
  }
  
  return session;
}

export async function commitSession(session: Session) {
  const sessionId = session.get("sessionId") || crypto.randomUUID();
  session.set("sessionId", sessionId);
  
  // Store only the access token
  const accessToken = session.get("auth_tokens")?.AccessToken;
  if (accessToken) {
    sessionStore.set(sessionId, accessToken);
  }
  
  return sessionStorage.commitSession(session);
}

export async function destroySession(session: Session) {
  const sessionId = session.get("sessionId");
  if (sessionId) {
    sessionStore.delete(sessionId);
  }
  return sessionStorage.destroySession(session);
}