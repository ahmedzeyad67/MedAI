import { useNavigate } from "react-router-dom";

export const logout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  if (navigate) {
    navigate("/login", { replace: true });
  } else {
    window.location.href = "/login";
  }
};

export const useLogout = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout(navigate);
  };

  return logoutHandler;
};
