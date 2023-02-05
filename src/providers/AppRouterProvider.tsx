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
  children?: RouteType[];
};

const test = [
  {
    name: "home" as const,
    path: "/:id",
    element: <HomePage />,
    children: [
      {
        name: "nestedRoute" as const,
        path: "",
        element: <div>Hello nested route</div>,
      },
      {
        name: "subRoute" as const,
        path: "subroute/:category",
        element: <SubroutePage />,
        children: [
          {
            name: "doubleNestedRoute" as const,
            path: "/doubleNestedRoute",
            element: <div>Double nested route</div>,
          },
        ],
      },
    ],
  },
  {
    name: "loginPassThrough" as const,
    path: "/login",
    element: <Navigate to="/7bd3a823-e6dd-4ea2-9612-f6defe315cff" />,
  },
] satisfies RouteType[];

type GetChildrenNames<T> = T extends { children?: infer ChildrenType }
  ? ChildrenType extends RouteType[]
    ? ChildrenType[number]["name"] | GetChildrenNames<ChildrenType[number]>
    : never
  : never;

type GetRouteNames<T> = T extends RouteType
  ? T["name"] | GetChildrenNames<T>
  : never;

type Test1 = GetRouteNames<typeof test[number]>;

function createTypedBrowserRouter(routerConfig: RouteType[]) {
  return {
    router: createBrowserRouter(routerConfig),
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
]);
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
]);

type test = Uncapitalize<"HelloWorld">;

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
