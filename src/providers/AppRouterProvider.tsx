import { useContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { SubroutePage } from "../pages/SubroutePage";
import { AuthContext } from "./AuthProvider";

const test = [
  {
    name: "home" as const,
    path: "/:id" as const,
    element: <HomePage />,
    children: [
      {
        name: "nestedRoute" as const,
        index: true,
        element: <div>Hello nested route</div>,
      },
      {
        name: "subRoute" as const,
        path: "subroute/:category",
        element: <SubroutePage />,
      },
    ],
  },
  {
    name: "loginPassThrough" as const,
    path: "/login" as const,
    element: <Navigate to="/7bd3a823-e6dd-4ea2-9612-f6defe315cff" />,
  },
] as const;

type Test = typeof test[number]["name"];

const authenticatedRouter = createBrowserRouter([
  {
    path: "/:id",
    element: <HomePage />,
    children: [
      {
        index: true,
        element: <div>Hello nested route</div>,
      },
      {
        path: "subroute/:category",
        element: <SubroutePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Navigate to="/7bd3a823-e6dd-4ea2-9612-f6defe315cff" />,
  },
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
