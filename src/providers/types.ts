import { NonIndexRouteObject } from "react-router-dom";

export type RouteType = Omit<NonIndexRouteObject, "children"> & {
    name: string;
    path: string;
    element: JSX.Element;
    queryParams?: readonly string[];
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

export type GetInferedRoutes<T, Path extends string = ""> = T extends RouteType
    ? {
        name: T["name"],
        path: NormalizeStringSlashes<`${Path}/${InferPath<T>}`>
    } | GetInferedRoutes<
        T["children"] extends ReadonlyArray<infer Children>
        ? Children
        : never, InferPath<T>
    >
    : never


export type GetInferedQueryParams<T, ParentQueryParams extends readonly string[] = []> = T extends RouteType
    ? {
        name: T["name"],
        queryParams: T["queryParams"] extends readonly string[] ? [...T["queryParams"], ...ParentQueryParams] : []
    } | GetInferedQueryParams<
        T["children"] extends ReadonlyArray<infer Children>
        ? Children
        : []
        , T["queryParams"] extends readonly string[] ? T["queryParams"] : []>
    : never


    
export type ExtractPathParams<Path extends string> = string extends Path
    ? void
    : Path extends `/${infer _}:${infer Param}/${infer Rest}`
    ? {
        [K in Param]: string;
    } & ExtractPathParams<`/${Rest}`>
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

type ExtractQueryParams = null;

export type InferQuery<T> = null;

export type BuildUrl<RouteHash> = <
    RouteName extends keyof RouteHash,
    Params extends InferParams<RouteHash[RouteName]>,
    Query extends InferQuery<RouteHash[RouteName]>
>(
    ...params: Query | Params extends null
        ? [RouteName]
        : Query extends null
        ? [RouteName, { params: Params }]
        : Params extends null
        ? [RouteName, { query: Query }]
        : [
            RouteName,
            {
                query: Query;
                params: Params;
            }
        ]
) => string;

export type RoutesHash<T extends ReadonlyArray<RouteType>> = {
    [K in GetInferedRoutes<T[number]>["name"]]: {
        path: Extract<GetInferedRoutes<T[number]>, { name: K }>["path"]
        queryParams: Extract<GetInferedQueryParams<T[number]>, { name: K }>
    }
}