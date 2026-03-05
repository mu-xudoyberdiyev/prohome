/**
 * DATA layer: dashboard cashflow.
 */

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

export function useCashflow(projectId = 1) {
  const [cashflow, setCashflow] = useState(null);
  const [loading, setLoading] = useState(false);

  const get = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest(
        `/api/v1/dashboard/cashflow?projectId=${projectId}`
      );
      if (res.ok) {
        const data = await res.json();
        setCashflow(data);
      } else {
        toast.error("Xatolik yuz berdi qayta urunib ko'ring!");
      }
    } catch {
      toast.error("Tizimda nosozlik!");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    get();
  }, [get]);

  return { cashflow, loading };
}
