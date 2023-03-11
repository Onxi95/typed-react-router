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


export type BuildUrl<RouteHash extends Record<string, string>> = <
    RouteName extends keyof RouteHash,
    Params extends ExtractPathParams<RouteHash[RouteName]>
>
    (...params: Params extends null
        ? [RouteName]
        : [RouteName, { params: Params }])
    => string;

export type RoutesHash<T extends ReadonlyArray<RouteType>> = {
    [K in GetInferedRoutes<T[number]>["name"]]: Extract<GetInferedRoutes<T[number]>, { name: K }>["path"]
}