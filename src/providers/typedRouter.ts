import { createBrowserRouter } from "react-router-dom";
import { GetInferedRoutes, RouteType } from "./types";

export function createTypedBrowserRouter<T extends ReadonlyArray<RouteType>>(
  routerConfig: T
) {
  const parseNestedRoutes = <U extends GetInferedRoutes<T[number]>>(
    routerConfig: ReadonlyArray<RouteType>,
    parentPath = ""
  ) => {
    return routerConfig.reduce((acc, current) => {
      const routeName = current.name as U["name"];
      const rootPath = parentPath ? `${parentPath}/` : "";
      acc[routeName] = `${rootPath}${current.path}` as U["path"];
      if (current.children) {
        acc = { ...acc, ...parseNestedRoutes(current.children, current.path) };
      }
      return acc;
    }, {} as Record<U["name"], U["path"]>);
  };

  const flattenedRoutes = parseNestedRoutes(routerConfig);

  console.log(flattenedRoutes, "flattenedRoutes");


  const buildUrl = <U extends GetInferedRoutes<T[number]>>(urlName: U["name"]): U["path"] => {
    return flattenedRoutes[urlName];
  };

  return {
    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router: createBrowserRouter(routerConfig as any),
    buildUrl,
  };
}