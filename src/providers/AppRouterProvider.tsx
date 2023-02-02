import { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const authenticatedRouter = createBrowserRouter([
  {
    path: "/",
    element: <div>Authenticated router</div>,
  },
]);
const anonymousRouter = createBrowserRouter([
  {
    path: "/",
    element: <div>Anonymous router</div>,
  },
]);

export const AppRouterProvider = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return <RouterProvider router={isAuthenticated ? authenticatedRouter : anonymousRouter} />;
};
