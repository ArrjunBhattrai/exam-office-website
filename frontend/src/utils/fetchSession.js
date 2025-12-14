import { BACKEND_URL } from "../../config";

export const fetchLatestSession = async (token) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/session/latest`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok || !data.session) {
      throw new Error("No current session found");
    }

    return data.session;
  } catch (err) {
    console.error("Session fetch failed", err);
    throw err;
  }
};
