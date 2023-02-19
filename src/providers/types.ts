export type RouteType = {
    name: string;
    path: string;
    element: JSX.Element;
    children?: ReadonlyArray<RouteType>;
};

type GetChildrenNames<T> = T extends { children?: infer ChildrenType }
    ? ChildrenType extends ReadonlyArray<RouteType>
    ? ChildrenType[number]["name"] | GetChildrenNames<[number]>
    : never
    : never;

export type GetRouteNames<T> = T extends RouteType
    ? T["name"] | GetChildrenNames<T>
    : never;

type GetChildrenPaths<T> = T extends { children?: infer ChildrenType }
    ? ChildrenType extends ReadonlyArray<RouteType>
    ? ChildrenType[number]["path"] | GetChildrenPaths<[number]>
    : never
    : "";

export type InferPath<T> = T extends RouteType
    ? `${T["path"]}${GetChildrenPaths<T["children"]>}`
    : never


// Walkaround: remove double // from the string - should be enough for now
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

type ExtractPathParams<Path extends string> = string extends Path
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


type InferParams<T> = T extends { path: string }
    ? void extends ExtractPathParams<T["path"]>
    ? null
    : ExtractPathParams<T["path"]>
    : undefined;


export type BuildUrl<RouteHash> = <
    RouteName extends keyof RouteHash,
    Params extends InferParams<RouteHash[RouteName]>
>
    (...params: Params extends null
        ? [RouteName]
        : [RouteName, { params: Params }])
    => string;