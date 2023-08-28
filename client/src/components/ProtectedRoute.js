import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const accessToken = JSON.parse(
      localStorage.getItem("mern-record-user")
    )?.accessToken;
    const refreshToken = JSON.parse(
      localStorage.getItem("mern-record-user")
    )?.refreshToken;
    if (accessToken && refreshToken) setIsAuthenticated(true);
    else {
      console.log("empty localStorage, redirecting to login");
      navigate("/login");
    }
  }, []);

  if (isAuthenticated) return <>{children}</>;
};

export default ProtectedRoute;
