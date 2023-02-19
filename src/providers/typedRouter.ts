import { createBrowserRouter } from "react-router-dom";
import { BuildUrl, GetInferedRoutes, RouteType } from "./types";


export function createTypedBrowserRouter<T extends ReadonlyArray<RouteType>>(
  routerConfig: T
) {
  type ParsedNestedHash = {
    [K in GetInferedRoutes<T[number]>["name"]]: Extract<GetInferedRoutes<T[number]>, { name: K }>["path"]
  }


  const parseNestedRoutes = (
    routerConfig: ReadonlyArray<RouteType>,
    parentPath = ""
  ) => {
    return routerConfig.reduce((acc, current) => {
      const routeName = current.name as keyof ParsedNestedHash;
      const rootPath = parentPath ? `${parentPath}/` : "";
      acc[routeName] = `${rootPath}${current.path}` as ParsedNestedHash[keyof ParsedNestedHash];
      if (current.children) {
        acc = { ...acc, ...parseNestedRoutes(current.children, current.path) };
      }
      return acc;
    }, {} as ParsedNestedHash);
  };

  const flattenedRoutes = parseNestedRoutes(routerConfig);
  console.log(flattenedRoutes, "flattenedRoutes");

  const buildUrl: BuildUrl<ParsedNestedHash> = (...[urlName, ...params]) => {
    console.log(`"${urlName}" params: `, params);
    return flattenedRoutes[urlName];
  };

  return {
    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router: createBrowserRouter(routerConfig as any),
    buildUrl,
  };
}