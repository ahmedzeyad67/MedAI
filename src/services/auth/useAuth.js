import { useState, useEffect, useMemo } from "react";
import { getUserRole } from "./getUserRole";
import { getUser } from "../api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const role = useMemo(() => getUserRole(), []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !role) {
      setUser(null);
      setLoading(false);
      return;
    }

    getUser()
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [role]);

  return { user, role, loading };
}
