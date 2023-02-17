export type RouteType = {
    name: string;
    path?: string;
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

type GetInferedChildrenRoute<T> = T extends { children?: infer ChildrenType }
    ? ChildrenType extends ReadonlyArray<RouteType>
    ? ChildrenType[number]
    : never
    : never;

export type GetInferedRoute<T> = T extends RouteType
    ? {
        name: T["name"],
        path: InferPath<T>
    } | GetInferedRoute<GetInferedChildrenRoute<T>> : never