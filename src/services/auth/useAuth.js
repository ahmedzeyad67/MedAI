import { useState, useEffect, useRef } from "react";
import { getUserRole } from "./getUserRole";
import { getDoctorProfile, getUser, refreshTokens } from "../api";

export function useAuth() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );
  const [loading, setLoading] = useState(!user);
  const refreshAttemptedRef = useRef(false);

  const role = getUserRole();

  useEffect(() => {
    if (role) {
      document.documentElement.setAttribute("data-theme", role);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [role]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token) {
      setUser(null);
      localStorage.removeItem("user");
      setLoading(false);
      return;
    }

    if (!role) {
      if (refreshToken && !refreshAttemptedRef.current) {
        refreshAttemptedRef.current = true;
        refreshTokens()
          .then(() => {
            refreshAttemptedRef.current = false;
            refreshUser();
          })
          .catch((err) => {
            const status = err?.response?.status;
            if (status === 400 || status === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
            }
            setUser(null);
            localStorage.removeItem("user");
            setLoading(false);
          });
        return;
      }

      setUser(null);
      localStorage.removeItem("user");
      setLoading(false);
      return;
    }

    refreshAttemptedRef.current = false;

    refreshUser();
  }, [role]);

  const refreshUser = async () => {
    setLoading(true);

    try {
      const request =
        getUserRole() === "doctor" ? getDoctorProfile() : getUser();

      const data = await request;

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));

      return data;
    } catch (err) {
      if (err.response?.status === 401) {
        setUser(null);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, role, loading, refreshUser };
}
