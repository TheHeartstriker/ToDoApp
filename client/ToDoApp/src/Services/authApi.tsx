import { errorChecker } from "../utils/errorApi";

// Handle user login
export async function handleLogin(username: string, password: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
    credentials: "include",
    signal: controller.signal,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/login`,
      options
    );
    clearTimeout(timeoutId);
    return await errorChecker(response);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Error:", error);
    throw error;
  }
}
// Input registration data
export async function handleSignup(username: string, password: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
    credentials: "include",
    signal: controller.signal,
  };
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/register`,
      options
    );
    clearTimeout(timeoutId);
    return await errorChecker(response);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Error:", error);
    throw error;
  }
}
