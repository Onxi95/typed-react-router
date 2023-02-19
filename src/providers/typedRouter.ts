import { compile } from "path-to-regexp";
import { createBrowserRouter, useParams } from "react-router-dom";
import { BuildUrl, ExtractPathParams, GetInferedRoutes, RouteType } from "./types";


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

  const buildUrl: BuildUrl<ParsedNestedHash> = (...[routeName, { params }]) => {
    return compile(flattenedRoutes[routeName], { encode: encodeURIComponent })(params);
  };

  const useRouteParams = <U extends keyof ParsedNestedHash>(_: U) => {
    return useParams<ExtractPathParams<ParsedNestedHash[U]>>();
  };

  return {
    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router: createBrowserRouter(routerConfig as any),
    buildUrl,
    useRouteParams,
  };
}