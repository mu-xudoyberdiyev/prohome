/**
 * DATA layer: projects list (TJM).
 */

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest("/api/v1/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!");
      }
    } catch {
      setError("Tizimda nosozlik!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  return { projects, error, loading, get };
}
