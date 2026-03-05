/**
 * DATA layer: single room by id (for HomeDetails).
 */

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export function useRoom(id) {
  const [room, setRoom] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const get = useCallback(async () => {
    if (!id) {
      setRoom(null);
      setNotFound(false);
      return;
    }
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const res = await apiRequest(`/api/v1/room/by/${id}`);
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
      } else if (res.status === 404 || res.status === 400) {
        setNotFound(true);
        setRoom(null);
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

  return { room, notFound, error, loading, get };
}
