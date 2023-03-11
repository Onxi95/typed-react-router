import { NonIndexRouteObject } from "react-router-dom";

export type RouteType = Omit<NonIndexRouteObject, "children"> & {
    name: string;
    path: string;
    element: JSX.Element;
    queryParams?: ReadonlyArray<string>;
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

export type GetInferedRoutes<T, Path extends string = "", ParentQueryParams extends readonly string[] = []> = T extends RouteType
    ? {
        name: T["name"],
        path: NormalizeStringSlashes<`${Path}/${InferPath<T>}`>
        queryParams: T["queryParams"] extends readonly string[] ? [...T["queryParams"], ...ParentQueryParams] : []
    } | GetInferedRoutes<
        T["children"] extends ReadonlyArray<infer Children>
        ? Children
        : never, InferPath<T>, T["queryParams"] extends readonly string[] ? T["queryParams"] : []
    >
    : never


export type ExtractPathParams<Path extends string> = string extends Path
    ? void
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    : Path extends `/${infer _}:${infer Param}/${infer Rest}`
    ? {
        [K in Param]: string;
    } & ExtractPathParams<`/${Rest}`>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    : Path extends `/${infer _}:${infer Param}`
    ? {
        [K in Param]: string;
    }
    : void;

export type InferParams<T> = T extends { path: string }
    ? void extends ExtractPathParams<T["path"]>
    ? null
    : ExtractPathParams<T["path"]>
    : null;

export type InferQueries<T> = T extends { queryParams?: infer QueryParams }
    ? QueryParams extends readonly string[]
    ? QueryParams["length"] extends 0
    ? null
    : { [K in QueryParams[number]]?: string }
    : null
    : null;

export type BuildUrl<RouteHash extends Record<
    string,
    { path: string; queryParams?: ReadonlyArray<string> }
>
> = <RouteName extends keyof RouteHash, Route extends RouteHash[RouteName]>(
    ...params: InferParams<Route> | InferQueries<Route> extends null
        ? [RouteName]
        : InferQueries<Route> extends null
        ? [RouteName, { params: InferParams<Route> }]
        : InferQueries<Route> extends null
        ? [RouteName, { query: InferQueries<Route> }]
        : [
            RouteName,
            {
                query: InferQueries<Route>;
                params: InferParams<Route>;
            }
        ]
) => string;

export type RoutesHash<T extends ReadonlyArray<RouteType>> = {
    [K in GetInferedRoutes<T[number]>["name"]]: Extract<GetInferedRoutes<T[number]>, { name: K }>
}
