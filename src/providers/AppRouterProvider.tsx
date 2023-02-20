import { useContext } from "react";
import { Navigate, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { SubroutePage } from "../pages/SubroutePage";
import { AuthContext } from "./AuthProvider";
import { createTypedBrowserRouter } from "./typedRouter";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(() => {
    return resolve("hello");
  }, ms));
}

export const authenticatedRouter = createTypedBrowserRouter([
  {
    name: "home",
    path: "/:id",
    element: <HomePage />,
    loader: async () => {
      return sleep(3000);
    },
    fallbackElement: <div>Loading...</div>,
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
