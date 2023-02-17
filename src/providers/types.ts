export type RouteType = {
    name: string;
    path?: string;
    element: JSX.Element;
    children?: ReadonlyArray<RouteType>;
};

export type GetChildrenNames<T> = T extends { children?: infer ChildrenType }
    ? ChildrenType extends ReadonlyArray<RouteType>
    ? ChildrenType[number]["name"] | GetChildrenNames<[number]>
    : never
    : never;

export type GetRouteNames<T> = T extends RouteType
    ? T["name"] | GetChildrenNames<T>
    : never;
