import { useState, useEffect } from "react";

export function useCsrfToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => {
        if (data?.token) setToken(data.token);
      })
      .catch(() => {
        // silently fail — the token will just be empty
      });
  }, []);

  return { token };
}