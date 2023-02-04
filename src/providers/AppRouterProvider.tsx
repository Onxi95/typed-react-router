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
      },
    ],
  },
  {
    name: "loginPassThrough" as const,
    path: "/login",
    element: <Navigate to="/7bd3a823-e6dd-4ea2-9612-f6defe315cff" />,
  },
];

type Test1 = typeof test[number] extends { children?: infer ChildrenType }
  ? ChildrenType extends RouteType[]
    ? ChildrenType[number]["name"]
    : never
  : never;
type InferNames<T extends ReadonlyArray<RouteType>> = T;
// type Test2 = InferNames<typeof test>;
// const test2: ReadonlyArray<RouteType> = [
//   {
//     name: "home" as const,
//     path: "/:id",
//     element: <HomePage />,
//     children: [
//       {
//         name: "nestedRoute" as const,
//         index: true,
//         element: <div>Hello nested route</div>,
//       },
//       {
//         name: "subRoute" as const,
//         path: "subroute/:category",
//         element: <SubroutePage />,
//       },
//     ],
//   },
//   {
//     name: "loginPassThrough" as const,
//     path: "/login",
//     element: <Navigate to="/7bd3a823-e6dd-4ea2-9612-f6defe315cff" />,
//   },
// ] as const;

// type Test3 = typeof test;

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
