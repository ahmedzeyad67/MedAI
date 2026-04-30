import { jwtDecode } from "jwt-decode";

export function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const role = decoded.roles?.[0];
    return role ? role.toLowerCase() : null;
  } catch (err) {
    console.log("Error decoding token:", err);
    return null;
  }
}
