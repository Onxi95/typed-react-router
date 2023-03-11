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
type test4 = GetInferedQueryParams<
  typeof authenticatedRoutes["1"]
>["queryParams"];

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
    category: "abc",
  },
});

const passthroughBuilder = authenticatedRouter.buildUrl(
  "authenticatedPassthrough"
);

type test5 = ExtractPathParams<typeof authenticatedRoutes["1"]["path"]>;
type test6 = ExtractPathParams<
  typeof authenticatedRoutes["0"]["children"]["0"]["path"]
>;
type test7 = InferQuery<typeof authenticatedRoutes["1"]>;
type test8 = InferParams<typeof authenticatedRoutes["1"]>;
type test9 = InferParams<typeof authenticatedRoutes["0"]>;
type test10 = InferQuery<typeof authenticatedRoutes["0"]>;
type test11 = test9 | test10;
type test12 = null extends test11 ? true : false;
type test13 = RoutesHash<typeof authenticatedRoutes>;
type test14 = InferParams<test13["subRoute"]>;

type InferQueryTest<T> = T extends { queryParams?: infer QueryParams }
  ? QueryParams extends readonly string[]
    ? { [K in QueryParams[number]]: string }
    : null
  : null;

type test15 = InferQueryTest<test13["home"]>;

type BuildUrlTest<
  RouteHash extends Record<
    string,
    { path: string; queryParams: readonly string[] }
  >
> = <
  RouteName extends keyof RouteHash,
  Params extends RouteHash[RouteName]["path"],
  Query extends RouteHash[RouteName]["queryParams"]
>(
  ...params: Query | Params extends null
    ? [RouteName]
    : Query extends null
    ? [RouteName, { params: Params }]
    : Params extends null
    ? [RouteName, { query: Query }]
    : [
        RouteName,
        {
          query: Query;
          params: Params;
        }
      ]
) => string;

type test16 = BuildUrlTest<test13>;
const test17: test16 = (...route) => "hi";
const test18 = test17("home", {
  params: "/:id/subroute/:category",
  query: [],
});

type InferQueriesTest<T> = T extends { queryParams?: infer QueryParams }
  ? QueryParams extends readonly string[]
    ? QueryParams["length"] extends 0
      ? null
      : { [K in QueryParams[number]]?: string }
    : null
  : null;

type BuildUrlTest2<
  RouteHash extends Record<
    string,
    { path: string; queryParams?: ReadonlyArray<string> }
  >
> = <RouteName extends keyof RouteHash, Route extends RouteHash[RouteName]>(
  ...params: InferParams<Route> | InferQueriesTest<Route> extends null
    ? [RouteName]
    : InferQueriesTest<Route> extends null
    ? [RouteName, { params: InferParams<Route> }]
    : InferQueriesTest<Route> extends null
    ? [RouteName, { query: InferQueriesTest<Route> }]
    : [
        RouteName,
        {
          query: InferQueriesTest<Route>;
          params: InferParams<Route>;
        }
      ]
) => string;

type test19 = BuildUrlTest2<test13>;
const test20: test19 = (...route) => "hello";
const test21 = test20("home", {
  params: {
    id: "1",
  },
  query: {
    hello: "hi"
  }
});
const test22 = test20("subRoute", {
  params: {
    id: "1",
    category: "category",
  },
});

const test23 = test20("subRoute", {
  params :{
    id: "123",
    category: "cat1",
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
