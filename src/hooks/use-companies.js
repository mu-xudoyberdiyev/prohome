/**
 * DATA layer: companies list.
 */

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest("/api/v1/company/all");
      if (res.ok) {
        const { data } = await res.json();
        setCompanies(data ?? []);
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

  return { companies, error, loading, get };
}
