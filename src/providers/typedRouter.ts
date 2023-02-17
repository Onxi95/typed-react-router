import { createBrowserRouter } from "react-router-dom";
import { GetRouteNames, RouteType } from "./types";

export function createTypedBrowserRouter<T extends ReadonlyArray<RouteType>>(
  routerConfig: T
) {
  const parseNestedRoutes = (
    routerConfig: ReadonlyArray<RouteType>,
    parentPath = ""
  ) => {
    return routerConfig.reduce((acc, current) => {
      const routeName = current.name as GetRouteNames<T[number]>;
      const rootPath = parentPath ? `${parentPath}/` : "";
      acc[routeName] = `${rootPath}${current.path}`;
      if (current.children) {
        acc = { ...acc, ...parseNestedRoutes(current.children, current.path) };
      }
      return acc;
    }, {} as Record<GetRouteNames<T[number]>, string>);
  };

  const flattenedRoutes = parseNestedRoutes(routerConfig);

  const buildUrl = (urlName: GetRouteNames<T[number]>) => {
    return flattenedRoutes[urlName];
  };

  return {
    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router: createBrowserRouter(routerConfig as any),
    buildUrl,
  };
}