/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { Navigate, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { SubroutePage } from "../pages/SubroutePage";
import { AuthContext } from "./AuthProvider";
import { createTypedBrowserRouter } from "./typedRouter";
import {
  BuildUrl,
  GetInferedRoutes,
  GetQueryParamsFromHash,
  RoutesHash,
  RouteType,
} from "./types";

const authenticatedRoutes = [
  {
    name: "home",
    path: "/:id",
    element: <HomePage />,
    queryParams: ["query1"],
    children: [
      {
        name: "nestedRoute",
        path: "",
        element: <div>Hello nested route</div>,
      },
      {
        name: "subRoute",
        path: "subroute/:category",
        element: <SubroutePage />,
        queryParams: ["query2"],
      },
    ],
  },
  {
    name: "authenticatedPassthrough",
    path: "/",
    element: <Navigate to="/7bd3a823-e6dd-4ea2-9612-f6defe315cff" />,
  },
  {
    name: "homeWithoutQueryParam",
    path: "/:id",
    element: <HomePage />,
  },
] as const satisfies ReadonlyArray<RouteType>;

const test123 = authenticatedRoutes[0].children[1].queryParams;

export const authenticatedRouter =
  createTypedBrowserRouter(authenticatedRoutes);

type test1 = GetInferedRoutes<typeof authenticatedRoutes[number]>;
type test2 = RoutesHash<typeof authenticatedRoutes>;
type test3 = GetQueryParamsFromHash<typeof test123>;
type test4 = BuildUrl<test2>;
const test = authenticatedRouter.buildUrl;
const builder = authenticatedRouter.buildUrl("homeWithoutQueryParam", {
  params: {
    id: "1",
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

anonymousRouter.buildUrl("login");

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
