/**
 * Google OAuth Authentication Service for PooKar
 * Direct Google Identity Services (GIS) integration with forced account selection.
 */

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "831578144886-tqhsq24hn0lmcqlqdmdga5103uj5tjir.apps.googleusercontent.com";

export interface GoogleUserProfile {
  email: string;
  name: string;
  picture?: string;
  token?: string;
}

/**
 * Ensures Google Identity Services script is loaded in the DOM
 */
export function ensureGoogleScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).google?.accounts) {
      resolve();
      return;
    }

    const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      // Polling fallback
      const interval = setInterval(() => {
        if ((window as any).google?.accounts) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

/**
 * Triggers interactive Google OAuth Popup with account selection picker.
 * Allows the citizen to pick any of their Google accounts.
 */
export async function promptGoogleAccountPicker(): Promise<GoogleUserProfile> {
  await ensureGoogleScript();

  const google = (window as any).google;
  if (!google?.accounts?.oauth2) {
    throw new Error("Google Authentication SDK is not ready yet. Please refresh and try again.");
  }

  return new Promise((resolve, reject) => {
    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
        prompt: "select_account",
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error_description || tokenResponse.error || "Google login was cancelled."));
            return;
          }

          if (!tokenResponse.access_token) {
            reject(new Error("No access token received from Google."));
            return;
          }

          try {
            // Retrieve authentic user profile from Google's userinfo endpoint
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!res.ok) {
              throw new Error("Unable to fetch user profile from Google.");
            }

            const data = await res.json();
            resolve({
              email: data.email,
              name: data.name || data.given_name || "Citizen Contributor",
              picture: data.picture,
              token: tokenResponse.access_token,
            });
          } catch (fetchErr: any) {
            reject(fetchErr);
          }
        },
      });

      // Force account selection prompt dialog
      client.requestAccessToken({ prompt: "select_account" });
    } catch (err) {
      reject(err);
    }
  });
}
