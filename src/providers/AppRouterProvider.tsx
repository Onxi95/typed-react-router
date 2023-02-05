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
  index?: boolean;
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
        index: true,
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

type Test1 = GetChildrenNames<typeof test[number]>;
type InferNames<T extends ReadonlyArray<RouteType>> = T;

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
    path: "/",
    element: <Navigate to="/7bd3a823-e6dd-4ea2-9612-f6defe315cff" />,
  },
]);
const anonymousRouter = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/*",
    element: <Navigate to="/login" />,
  },
]);

type test = Uncapitalize<"HelloWorld">;

export const AppRouterProvider = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <RouterProvider
      router={isAuthenticated ? authenticatedRouter : anonymousRouter}
    />
  );
};
