import { useContext } from "react";
import { Navigate, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { SubroutePage } from "../pages/SubroutePage";
import { AuthContext } from "./AuthProvider";
import { createTypedBrowserRouter } from "./typedRouter";
import { GetInferedRoutes } from "./types";

const authenticatedPaths = [
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
] as const;

const authenticatedRouter = createTypedBrowserRouter(authenticatedPaths);

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

const result = authenticatedRouter.buildUrl("nestedRoute", {
  params: { id: "1" },
});
console.log(result, "result");

type test1 = GetInferedRoutes<typeof authenticatedPaths[number]> & {
  name: "home";
};

const t: test1 = { name: "home", path: "/:id" };

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
