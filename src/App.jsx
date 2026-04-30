import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Homepage from "./pages/homepage";
import SignupPage from "./pages/signup-page";
import LoginPage from "./pages/login-page";
import BrowseDoctorsPage from "./pages/browse-doctors-page";
import EditProfilePage from "./pages/edit-profile-page";
import RoleBasedRoutes from "./routes/roleBasedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute element={<Homepage />} />} />
        <Route
          path="/signup"
          element={<PublicRoute element={<SignupPage />} />}
        />
        <Route
          path="/login"
          element={<PublicRoute element={<LoginPage />} />}
        />

        <Route path="/doctors" element={<BrowseDoctorsPage />} />

        <Route
          path="/profile"
          element={<ProtectedRoute element={<EditProfilePage />} />}
        />

        <Route
          path="/*"
          element={<ProtectedRoute element={<RoleBasedRoutes />} />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
