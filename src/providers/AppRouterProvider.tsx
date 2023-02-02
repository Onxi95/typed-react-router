import { useContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { AuthContext } from "./AuthProvider";

const authenticatedRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        index: true,
        element: <div>Hello nested route</div>,
      },
      {
        path: "/subroute",
        element: <div>this is a subroute</div>,
      },
    ],
  },
  { path: "/login", element: <Navigate to="/" /> },
]);
const anonymousRouter = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  { path: "/", element: <Navigate to="/login" /> },
]);

export const AppRouterProvider = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <RouterProvider
      router={isAuthenticated ? authenticatedRouter : anonymousRouter}
    />
  );
};
