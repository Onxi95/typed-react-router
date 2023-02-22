import { compile } from "path-to-regexp";
import { createBrowserRouter, useParams } from "react-router-dom";
import { BuildUrl, ExtractPathParams, RoutesHash, RouteType } from "./types";


export function createTypedBrowserRouter<RouterConfig extends ReadonlyArray<RouteType>>(
  routerConfig: RouterConfig
) {

  const parseNestedRoutes = (
    routerConfig: ReadonlyArray<RouteType>,
    parentPath = ""
  ) => {
    return routerConfig.reduce((acc, current) => {
      type RouteName = keyof RoutesHash<RouterConfig>

      const routeName = current.name as RouteName;
      const rootPath = parentPath ? `${parentPath}/` : "";
      acc[routeName] = `${rootPath}${current.path}` as RoutesHash<RouterConfig>[RouteName];
      if (current.children) {
        acc = { ...acc, ...parseNestedRoutes(current.children, current.path) };
      }
      return acc;
    }, {} as RoutesHash<RouterConfig>);
  };

  const flattenedRoutes = parseNestedRoutes(routerConfig);

  const buildUrl: BuildUrl<RoutesHash<RouterConfig>> = (...[routeName, { params }]) => {
    return compile(flattenedRoutes[routeName], { encode: encodeURIComponent })(params);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const useRouteParams = <RouteName extends keyof RoutesHash<RouterConfig>>(_: RouteName) => {
    return useParams<ExtractPathParams<RoutesHash<RouterConfig>[RouteName]>>();
  };

  return {
    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router: createBrowserRouter(routerConfig as any),
    buildUrl,
    useRouteParams,
  };
}