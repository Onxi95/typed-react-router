import { useContext } from "react";
import { Navigate, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { SubroutePage } from "../pages/SubroutePage";
import { AuthContext } from "./AuthProvider";
import { createTypedBrowserRouter } from "./typedRouter";
import {
  ExtractPathParams,
  GetInferedQueryParams,
  GetInferedRoutes,
  InferParams,
  InferQuery,
  RoutesHash,
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

type test1 = GetInferedRoutes<typeof authenticatedRoutes[number]>;
type test2 = ExtractPathParams<
  RoutesHash<typeof authenticatedRoutes>["subRoute"]["path"]
>;
type test3 = GetInferedQueryParams<typeof authenticatedRoutes[number]>;
type test4 = GetInferedQueryParams<typeof authenticatedRoutes["1"]>["queryParams"]

const homeBuilder = authenticatedRouter.buildUrl("home", {
  params: {
    id: "1",
  },
});

const nestedRouteBuilder = authenticatedRouter.buildUrl("nestedRoute", {
  params: {
    id: "1",
  },
});
const subRouteBuilder = authenticatedRouter.buildUrl("subRoute", {
  params: {
    id: "1",
    category: "abc"
  },
});

const passthroughBuilder = authenticatedRouter.buildUrl("authenticatedPassthrough");

type test5 = ExtractPathParams<typeof authenticatedRoutes["1"]["path"]>
type test6 = ExtractPathParams<typeof authenticatedRoutes["0"]["children"]["0"]["path"]>
type test7 = InferQuery<typeof authenticatedRoutes["1"]>
type test8 = InferParams<typeof authenticatedRoutes["1"]>
type test9 = InferParams<typeof authenticatedRoutes["0"]>
type test10 = InferQuery<typeof authenticatedRoutes["0"]>
type test11 = test9 | test10;
type test12 = null extends test11 ? true : false
type test13 = RoutesHash<typeof authenticatedRoutes>
type test14 = InferParams<test13["subRoute"]>
type test15 = test13;

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
