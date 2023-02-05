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

type RouteType = {
  name: string;
  path?: string;
  element: JSX.Element;
  children?: ReadonlyArray<RouteType>;
};

type GetChildrenNames<T> = T extends { children?: infer ChildrenType }
  ? ChildrenType extends ReadonlyArray<RouteType>
    ? // wip: add support to recursively nested instances:
      // ? ChildrenType[number]["name"] | GetChildrenNames<T>
      // TS Error: Type instantiation is excessively deep and possibly infinite.ts(2589)
      ChildrenType[number]["name"]
    : never
  : never;

type GetRouteNames<T> = T extends RouteType
  ? T["name"] | GetChildrenNames<T>
  : never;

function createTypedBrowserRouter<T extends ReadonlyArray<RouteType>>(
  routerConfig: T
) {
  const buildUrl = (urlName: GetRouteNames<T[number]>) => {
    return urlName;
  };

  return {
    router: createBrowserRouter(routerConfig as any),
    buildUrl,
  };
}

const authenticatedRouter = createTypedBrowserRouter([
  {
    name: "home",
    path: "/:id",
    element: <HomePage />,
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
      },
    ],
  },
  {
    name: "authenticatedPassthrough",
    path: "/",
    element: <Navigate to="/7bd3a823-e6dd-4ea2-9612-f6defe315cff" />,
  },
] as const);

authenticatedRouter.buildUrl("authenticatedPassthrough");

const anonymousRouter = createTypedBrowserRouter([
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
