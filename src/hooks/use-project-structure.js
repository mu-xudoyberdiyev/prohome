/**
 * DATA layer: single project structure (TJM details).
 */

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export function useProjectStructure(id) {
  const [structure, setStructure] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const get = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const res = await apiRequest(`/api/v1/projects/${id}/structure`);
      if (res.ok) {
        const data = await res.json();
        setStructure(data);
      } else if (res.status === 404 || res.status === 400) {
        setNotFound(true);
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!");
      }
    } catch {
      setError("Tizimda nosozlik!");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    get();
  }, [get]);

  return { structure, notFound, error, loading, get };
}
