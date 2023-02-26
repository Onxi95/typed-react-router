import { compile } from "path-to-regexp";
import {
  createBrowserRouter,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { stringify } from "qs";
import { BuildUrl, ExtractPathParams, RoutesHash, RouteType } from "./types";

export function createTypedBrowserRouter<
  RouterConfig extends ReadonlyArray<RouteType>
>(routerConfig: RouterConfig) {
  const parseNestedRoutes = (
    routerConfig: ReadonlyArray<RouteType>,
    parentPath = "",
    parentQueryParams: ReadonlyArray<string> = [],
  ) => {
    return routerConfig.reduce((acc, current) => {
      type RouteName = keyof RoutesHash<RouterConfig>;

      const routeName = current.name as RouteName;
      const rootPath = parentPath ? `${parentPath}/` : "";
      acc[routeName] = {
        path: `${rootPath}${current.path}` as RoutesHash<RouterConfig>[RouteName]["path"],
        // TODO: remove any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryParams: [...parentQueryParams, ...(current.queryParams ? current.queryParams : [])] as any,
      };
      if (current.children) {
        acc = { ...acc, ...parseNestedRoutes(current.children, current.path, current.queryParams) };
      }
      return acc;
    }, {} as RoutesHash<RouterConfig>);
  };

  const flattenedRoutes = parseNestedRoutes(routerConfig);

  const buildUrl: BuildUrl<RoutesHash<RouterConfig>> = (
    ...[routeName, urlConfig]
  ) => {
    const compiledPath = compile(flattenedRoutes[routeName]["path"], { encode: encodeURIComponent })(
      urlConfig?.params
    );

    return `${compiledPath}${urlConfig.query ? `?${stringify(urlConfig.query, { arrayFormat: "comma" })}` : ""}`;
  };

  const useRouteParams = <RouteName extends keyof RoutesHash<RouterConfig>>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: RouteName
  ) => {
    type Params = ExtractPathParams<RoutesHash<RouterConfig>[RouteName]["path"]> extends Record<string, string>
      ? ExtractPathParams<RoutesHash<RouterConfig>[RouteName]["path"]>
      : Record<string, string>
    return useParams<Params>();
  };

  const useQueryParams = <
    RouteName extends keyof RoutesHash<RouterConfig>,
  >(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _: RouteName
    ) => {
    type URLSearchParams = {
      get(
        paramName: RoutesHash<RouterConfig>[RouteName]["queryParams"] extends ReadonlyArray<string>
          ? RoutesHash<RouterConfig>[RouteName]["queryParams"][number]
          : null
      ): string;
    };

    return useSearchParams() as [
      URLSearchParams,
      ReturnType<typeof useSearchParams>[1]
    ];
  };

  return {
    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router: createBrowserRouter(routerConfig as any),
    buildUrl,
    useRouteParams,
    useQueryParams,
  };
}
