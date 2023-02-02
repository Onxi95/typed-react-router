import { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { AuthContext } from "./AuthProvider";

const authenticatedRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);
const anonymousRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
]);

export const AppRouterProvider = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <RouterProvider
      router={isAuthenticated ? authenticatedRouter : anonymousRouter}
    />
  );
};
