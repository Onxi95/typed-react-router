import { compile } from "path-to-regexp";
import { stringify } from "qs";
import {
  createBrowserRouter,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { BuildUrl, ExtractPathParams, RoutesHash, RouteType } from "./types";

export function createTypedBrowserRouter<
  RouterConfig extends ReadonlyArray<RouteType>
>(routerConfig: RouterConfig) {
  const parseNestedRoutes = (
    routerConfig: ReadonlyArray<RouteType>,
    parentPath = "",
    parentQueryParams: readonly string[] = [],
  ) => {
    return routerConfig.reduce((acc, current) => {
      type RouteName = keyof RoutesHash<RouterConfig>;

      const routeName = current.name as RouteName;
      const rootPath = parentPath ? `${parentPath}/` : "";
      acc[routeName] = {
        name: routeName,
        path: `${rootPath}${current.path}`,
        queryParams: [...parentQueryParams, ...(current.queryParams ? current.queryParams : [])]
      } as RoutesHash<RouterConfig>[RouteName];
      if (current.children) {
        acc = { ...acc, ...parseNestedRoutes(current.children, current.path, current.queryParams) };
      }
      return acc;
    }, {} as RoutesHash<RouterConfig>);
  };

  const flattenedRoutes = parseNestedRoutes(routerConfig);
  console.log(flattenedRoutes);

  const buildUrl: BuildUrl<RoutesHash<RouterConfig>> = (
    ...[routeName, config]
  ) => {

    const routeParams = (config && "params" in config) ? config.params || {} : {};
    const queryParams = (config && "query" in config) && config.query;

    const pathWithRouteParams = compile(flattenedRoutes[routeName].path, { encode: encodeURIComponent })(
      routeParams
    );

    const pathWithFullParams = `${pathWithRouteParams}${queryParams ? `?${stringify(queryParams, { arrayFormat: "comma" })}` : ""}`;

    return pathWithFullParams;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const useRouteParams = <RouteName extends keyof RoutesHash<RouterConfig>>(
    _: RouteName
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return useParams<ExtractPathParams<RoutesHash<RouterConfig>[RouteName]["path"]>>();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const useQueryParams = <
    RouteName extends keyof RoutesHash<RouterConfig>,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
    SearchParams extends unknown
  >(
      _: RouteName
    ) => {
    type URLSearchParams<RouteName> = {
      // TODO: inject param type and return it
      get<SearchParamName extends keyof SearchParams>(
        paramName: string
      ): SearchParams[SearchParamName];
    };

    const [searchParams, setSearchParams] = useSearchParams();

    return [searchParams, setSearchParams] as [
      URLSearchParams<RouteName>,
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
