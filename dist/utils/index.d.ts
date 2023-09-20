export declare const createDeleteUpdateFields: (currentData: any, initialData: any) => {
    create: any[];
    update: {
        data: any;
        where: {
            id: number;
        };
    }[];
    delete: any;
    connect?: undefined;
} | {
    connect: {
        id: number;
    };
    create?: undefined;
    update?: undefined;
    delete?: undefined;
} | {
    create?: undefined;
    update?: undefined;
    delete?: undefined;
    connect?: undefined;
};
export declare const updateNestedInput: (nestedFields: any, initialVariables?: any) => {};
export declare const includeJustPropsFromObj: (obj: any, propList: any) => {};
export declare const excludePropsFomObj: (obj: any, propList: any) => {};
export declare const createNestedInput: (nestedFields: any) => {};
export declare const generateSort: (sorters?: any) => any;
export declare const generateWherePropFromFilters: (filters?: any, nestedFieldsNames?: any[], nestedListFieldsNames?: any[]) => any;
//# sourceMappingURL=index.d.ts.map