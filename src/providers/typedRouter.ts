import { compile } from "path-to-regexp";
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
    parentPath = ""
  ) => {
    return routerConfig.reduce((acc, current) => {
      type RouteName = keyof RoutesHash<RouterConfig>;

      const routeName = current.name as RouteName;
      const rootPath = parentPath ? `${parentPath}/` : "";
      acc[routeName] = { path: `${rootPath}${current.path}` as RoutesHash<RouterConfig>[RouteName]["path"] };
      if (current.children) {
        acc = { ...acc, ...parseNestedRoutes(current.children, current.path) };
      }
      return acc;
    }, {} as RoutesHash<RouterConfig>);
  };

  const flattenedRoutes = parseNestedRoutes(routerConfig);

  const buildUrl: BuildUrl<RoutesHash<RouterConfig>> = (
    ...[routeName, { params }]
  ) => {
    return compile(flattenedRoutes[routeName]["path"], { encode: encodeURIComponent })(
      params
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const useRouteParams = <RouteName extends keyof RoutesHash<RouterConfig>>(
    _: RouteName
  ) => {
    return useParams<ExtractPathParams<RoutesHash<RouterConfig>[RouteName]["path"]>>();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const useQueryParams = <
    RouteName extends keyof RoutesHash<RouterConfig>,
    SearchParams extends RouteNameToSearchParams<RouteName>
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
