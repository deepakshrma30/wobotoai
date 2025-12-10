import { useEffect, useState } from "react";
import type { DATA } from "../types/types";

export function useSampleData() {
  const [data, setData] = useState<DATA[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "https://api-app-staging.wobot.ai/app/v1/fetch/cameras",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer 4ApVMIn5sTxeW7GQ5VWeWiy",
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch cameras");
      const json = await res.json();
      setData(json?.data ?? []);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
  };
}
