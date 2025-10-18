import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/check_session`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.logged_in && res.data.role === "admin") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsAuthorized(false);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthorized) return <Navigate to="/login" replace />;

  return children;
}
