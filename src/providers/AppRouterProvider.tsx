import { useContext } from "react";
import { Navigate, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { SubroutePage } from "../pages/SubroutePage";
import { AuthContext } from "./AuthProvider";
import { createTypedBrowserRouter } from "./typedRouter";
import {
  RouteType,
} from "./types";

const authenticatedRoutes = [
  {
    name: "home",
    path: "/:id",
    element: <HomePage />,
    queryParams: ["hello"],
    children: [
      {
        name: "nestedRoute",
        path: "",
        queryParams: ["hi"],
        element: <div>Hello nested route</div>,
      },
      {
        name: "subRoute",
        path: "subroute/:category",
        element: <SubroutePage />,
      },
    ],
  },
  {
    name: "authenticatedPassthrough",
    path: "/",
    element: <Navigate to="/7bd3a823-e6dd-4ea2-9612-f6defe315cff" />,
  },
] as const satisfies ReadonlyArray<RouteType>;

export const authenticatedRouter =
  createTypedBrowserRouter(authenticatedRoutes);

authenticatedRouter.buildUrl("home", {
  params: {
    id: "1"
  },
  query: {
    hello: "hi"
  }
});

authenticatedRouter.buildUrl("subRoute", {
  params: {
    id: "1",
    category: "category"
  },
});

export const anonymousRouter = createTypedBrowserRouter([
  {
    name: "login",
    path: "/login",
    element: <LoginPage />,
  },
  {
    name: "passthroughLogin",
    path: "/*",
    element: <Navigate to="/login" />,
  },
] as const);

export const AppRouterProvider = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <RouterProvider
      router={
        isAuthenticated ? authenticatedRouter.router : anonymousRouter.router
      }
    />
  );
};
