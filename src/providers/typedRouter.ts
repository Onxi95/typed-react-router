import { compile } from "path-to-regexp";
import { createBrowserRouter, useParams } from "react-router-dom";
import { BuildUrl, ExtractPathParams, RoutesHash, RouteType } from "./types";


export function createTypedBrowserRouter<T extends ReadonlyArray<RouteType>>(
  routerConfig: T
) {

  const parseNestedRoutes = (
    routerConfig: ReadonlyArray<RouteType>,
    parentPath = ""
  ) => {
    return routerConfig.reduce((acc, current) => {
      const routeName = current.name as keyof RoutesHash<T>;
      const rootPath = parentPath ? `${parentPath}/` : "";
      acc[routeName] = `${rootPath}${current.path}` as RoutesHash<T>[keyof RoutesHash<T>];
      if (current.children) {
        acc = { ...acc, ...parseNestedRoutes(current.children, current.path) };
      }
      return acc;
    }, {} as RoutesHash<T>);
  };

  const flattenedRoutes = parseNestedRoutes(routerConfig);

  const buildUrl: BuildUrl<RoutesHash<T>> = (...[routeName, { params }]) => {
    return compile(flattenedRoutes[routeName], { encode: encodeURIComponent })(params);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const useRouteParams = <U extends keyof RoutesHash<T>>(_: U) => {
    return useParams<ExtractPathParams<RoutesHash<T>[U]>>();
  };

  return {
    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router: createBrowserRouter(routerConfig as any),
    buildUrl,
    useRouteParams,
  };
}