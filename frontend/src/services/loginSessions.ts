import type { LoggedUser } from "../types";

const LOGIN_SESSION_KEY = "cinema_logged_user";

export function getLoggedUser(): LoggedUser | null {
  const storedUser = localStorage.getItem(LOGIN_SESSION_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as LoggedUser;
  } catch {
    localStorage.removeItem(LOGIN_SESSION_KEY);
    return null;
  }
}

export function saveLoggedUser(user: LoggedUser) {
  localStorage.setItem(LOGIN_SESSION_KEY, JSON.stringify(user));
}

export function clearLoggedUser() {
  localStorage.removeItem(LOGIN_SESSION_KEY);
}