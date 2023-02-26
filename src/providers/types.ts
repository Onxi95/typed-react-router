import { NonIndexRouteObject } from "react-router-dom";

export type RouteType = Omit<NonIndexRouteObject, "children"> & {
    name: string;
    path: string;
    element: JSX.Element;
    queryParams?: ReadonlyArray<string>,
    children?: ReadonlyArray<RouteType>;
};

type GetChildrenPaths<T> = T extends { children?: infer ChildrenType }
    ? ChildrenType extends ReadonlyArray<RouteType>
    ? ChildrenType[number]["path"] | GetChildrenPaths<[number]>
    : never
    : "";

export type InferPath<T> = T extends RouteType
    ? `${T["path"]}${GetChildrenPaths<T["children"]>}`
    : never

type NormalizeStringSlashes<T extends string> = T extends `${infer First}//${infer Second}`
    ? NormalizeStringSlashes<`${First}/${Second}`>
    : T

export type GetInferedRoutes<T, Path extends string = "", QueryParams extends ReadonlyArray<string> = []> = T extends RouteType
    ? {
        name: T["name"],
        path: NormalizeStringSlashes<`${Path}/${InferPath<T>}`>
        queryParams: T["queryParams"] extends ReadonlyArray<string>
        ? [...T["queryParams"], ...QueryParams]
        : undefined
    } | GetInferedRoutes<
        T["children"] extends ReadonlyArray<infer Children>
        ? Children
        : never, InferPath<T>,
        T["queryParams"] extends ReadonlyArray<string> ? T["queryParams"] : []
    >
    : never

export type ExtractPathParams<Path extends string> =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Path extends `/${infer _}:${infer Param}/${infer Rest}`
    ? {
        [K in Param]: string;
    } & ExtractPathParams<`/${Rest}`>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    : Path extends `/${infer _}:${infer Param}`
    ? {
        [K in Param]: string;
    }
    : Record<string, string>;

export type GetQueryParamsFromHash<T> = T extends ReadonlyArray<string>
    ? { [K in T[number]]: string }
    : null;

export type BuildUrl<RouteHash extends Record<string, { path: string, queryParams: ReadonlyArray<string> | undefined }>> = <
    RouteName extends keyof RouteHash,
    Params extends ExtractPathParams<RouteHash[RouteName]["path"]>,
    Query extends RouteHash[RouteName]["queryParams"]
>
    (...params:
        [
            RouteName,
            {
                // query: Query extends ReadonlyArray<string> ? { [K in Query[number]]: string } : never;
                query?: GetQueryParamsFromHash<Query>
                params: Params;
            }
        ])
    => string;

export type RoutesHash<T extends ReadonlyArray<RouteType>> = {
    [K in GetInferedRoutes<T[number]>["name"]]: {
        path: Extract<GetInferedRoutes<T[number]>, { name: K }>["path"]
        queryParams: Extract<GetInferedRoutes<T[number]>, { name: K }>["queryParams"]
    }
}
