import { BaseRecord } from '@refinedev/core';
import { DataProvider } from "@refinedev/core";
import { GraphQLClient } from "graphql-request";
import * as gql from "gql-query-builder";
import pluralize from "pluralize";
import camelCase from "camelcase";
import { createNestedInput, generateSort, generateWherePropFromFilters, excludePropsFomObj, includeJustPropsFromObj, updateNestedInput } from './utils';




export const dataProvider = (client: GraphQLClient): Required<DataProvider> => {
    return {
        getList: async (props) => {
            const { resource, pagination, sorters, filters, meta } = props
            const singularResource = pluralize.singular(resource);
            const {
                current, pageSize, mode = "server",
            } = pagination ?? {};

            const orderBy = generateSort(sorters);

            const where = generateWherePropFromFilters(filters, meta?.nestedFieldsNames, meta?.nestedListFieldsNames);
            const pascalResource = camelCase(singularResource, { pascalCase: true });
            console.log('props ?????;;;;;', props)
            const pluralRessource = pluralize(pascalResource)
            const operation = `all${pluralRessource}`;
            const operation2 = `_all${pluralRessource}Meta`;
            const { query, variables } = gql.query([
                {
                    operation,
                    variables: {
                        where: { value: where, type: `${pascalResource}WhereInput` },
                        orderBy: { value: orderBy, type: `[${pascalResource}OrderByWithRelationInput!]` },
                        page: { value: Number(current || 1), required: false, type: 'Float' },
                        perPage: { value: Number(pageSize || 10), required: false, type: 'Float' }
                    },
                    fields: meta?.fields || [],
                },
                {
                    operation: operation2,
                    variables: {
                        where: { value: where, type: `${pascalResource}WhereInput` }
                    },
                    fields: ['count'],
                }
            ]);

            const response = await client.request<BaseRecord>(query, variables);
            console.log('response[operation2].count', response[operation2].count)
            return {
                data: response[operation],
                total: Number(response[operation2].count),
            };
        },

        getMany: async ({ resource, ids, meta }) => {
            const singularResource = pluralize.singular(resource);
            const pascalResource = camelCase(singularResource, { pascalCase: true });
            // const pluralRessource = pluralize(pascalResource)
            const operation = `all${pascalResource}`;


            const { query, variables } = gql.query({
                operation,
                variables: {
                    where: {
                        value: { id_in: ids },
                    },
                },
                fields: meta?.fields,
            });

            const response = await client.request<BaseRecord>(query, variables);

            return {
                data: response[operation],
            };
        },

        create: async ({ resource, variables, meta }) => {
            
            const singularResource = pluralize.singular(resource);
            const pascalResource = camelCase(singularResource, { pascalCase: true });

            const camelCreateName = camelCase(`create${pascalResource}`);

            const operation = meta?.operation ?? camelCreateName;
            // const { nestedFields } = meta as any
            const nestedFieldsNames = meta?.nestedFieldsNames || [];
            const nestedVars = includeJustPropsFromObj(variables, nestedFieldsNames);
            const nestedInput = createNestedInput(nestedVars);
            const fieldsWithoutNestedInput = excludePropsFomObj(variables, nestedFieldsNames);
            const { query, variables: gqlVariables } = gql.mutation({
                operation,
                variables: {
                    createInput: {
                        value: {
                            ...fieldsWithoutNestedInput,
                            ...nestedInput
                        },
                        type: `${pascalResource}CreateInput!`,
                    },
                },
                fields: meta?.fields,
            });
            const response = await client.request<BaseRecord>(
                query,
                gqlVariables
            );

            return {
                data: response[operation][singularResource],
            };
        },

        createMany: async ({ resource, variables, meta }) => {
            const singularResource = pluralize.singular(resource);
            const camelCreateName = camelCase(`create${singularResource}`);

            const operation = meta?.operation ?? camelCreateName;

            const response = await Promise.all(
                variables.map(async (param) => {
                    const { query, variables: gqlVariables } = gql.mutation({
                        operation,
                        variables: {
                            input: {
                                value: { data: param },
                                type: `${camelCreateName}Input`,
                            },
                        },
                        fields: meta?.fields ?? [
                            {
                                operation: singularResource,
                                fields: ["id"],
                                variables: {},
                            },
                        ],
                    });
                    const result = await client.request<BaseRecord>(
                        query,
                        gqlVariables
                    );

                    return result[operation][singularResource];
                })
            );
            return {
                data: response,
            };
        },

        update: async ({ resource, id, variables, meta }) => {
            const singularResource = pluralize.singular(resource);
            const pascalResource = camelCase(singularResource, { pascalCase: true });
            const pascalUpdateName = camelCase(`update${pascalResource}`);


            const operation = meta?.operation ?? pascalUpdateName;

            const initialVariables = {};
            const nestedFieldsNames = meta?.nestedFieldsNames || [];
            const nestedVars = includeJustPropsFromObj(variables, nestedFieldsNames);
            const nestedInput = updateNestedInput(nestedVars, initialVariables);
            const fieldsWithoutNestedInput = excludePropsFomObj(variables, nestedFieldsNames);

            const { query, variables: gqlVariables } = gql.mutation({
                operation,
                variables: {
                    id: {
                        value: Number(id),
                        type: 'Int!'
                    },
                    updateInput: {
                        value: {
                            ...fieldsWithoutNestedInput,
                            ...nestedInput
                        },
                        type: `${pascalResource}UpdateInput!`,
                    },
                },
                fields: ['id'],
            });
            const response = await client.request<BaseRecord>(
                query,
                gqlVariables
            );

            return {
                data: response[operation][singularResource],
            };
        },

        updateMany: async ({ resource, ids, variables, meta }) => {
            const singularResource = pluralize.singular(resource);

            const pascalResource = camelCase(singularResource, { pascalCase: true });
            const pascalUpdateName = camelCase(`update${pascalResource}`);


            const operation = meta?.operation ?? pascalUpdateName;

            const response = await Promise.all(
                ids.map(async (id) => {
                    const { query, variables: gqlVariables } = gql.mutation({
                        operation,
                        variables: {
                            id: {
                                value: Number(id),
                                type: 'Int!'
                            },
                            updateInput: {
                                value: {
                                    ...variables,

                                },
                                type: `${pascalResource}UpdateInput!`,
                            },
                        },
                        fields: ['id'],

                    });
                    const result = await client.request<BaseRecord>(
                        query,
                        gqlVariables
                    );

                    return result[operation][singularResource];
                })
            );
            return {
                data: response,
            };
        },

        getOne: async ({ resource, id, meta }) => {
            const singularResource = pluralize.singular(resource);
            const pascalResource = camelCase(singularResource, { pascalCase: true });

            const operation = pascalResource;

            const { query, variables } = gql.query({
                operation,
                variables: {
                    id: { value: Number(id), type: "Int!" },
                },
                fields: meta?.fields || ["id"],
            });

            const response = await client.request<BaseRecord>(query, variables);

            return {
                data: response[operation],
            };
        },

        deleteOne: async ({ resource, id, meta }) => {
            const singularResource = pluralize.singular(resource);
            const pascalResource = camelCase(singularResource, { pascalCase: true });
            const camelDeleteName = camelCase(`delete${pascalResource}`);

            const operation = meta?.operation ?? camelDeleteName;

            const { query, variables } = gql.mutation({
                operation,
                variables: {
                    id: { value: Number(id), type: "Int!" },
                },
                fields: ['id'],
            });

            const response = await client.request<BaseRecord>(query, variables);

            return {
                data: response[operation][singularResource],
            };
        },

        deleteMany: async ({ resource, ids, meta }) => {
            const singularResource = pluralize.singular(resource);
            const pascalResource = camelCase(singularResource, { pascalCase: true });
            const camelDeleteName = camelCase(`delete${pascalResource}`);

            const operation = meta?.operation ?? camelDeleteName;

            const response = await Promise.all(
                ids.map(async (id) => {
                    const { query, variables: gqlVariables } = gql.mutation({
                        operation,
                        variables: {
                            id: { value: Number(id), type: "Int!" },
                        },
                        fields: ['id'],
                    });
                    const result = await client.request<BaseRecord>(
                        query,
                        gqlVariables
                    );

                    return result[operation][singularResource];
                })
            );
            return {
                data: response,
            };
        },

        getApiUrl: () => {
            throw Error("Not implemented on refine-graphql data provider.");
        },

        custom: async ({ url, method, headers, meta }) => {
            let gqlClient = client;

            if (url) {
                gqlClient = new GraphQLClient(url, { headers });
            }

            if (meta) {
                if (meta.operation) {
                    if (method === "get") {
                        const { query, variables } = gql.query({
                            operation: meta.operation,
                            fields: meta.fields,
                            variables: meta.variables,
                        });

                        const response = await gqlClient.request<BaseRecord>(
                            query,
                            variables
                        );

                        return {
                            data: response[meta.operation],
                        };
                    } else {
                        const { query, variables } = gql.mutation({
                            operation: meta.operation,
                            fields: meta.fields,
                            variables: meta.variables,
                        });

                        const response = await gqlClient.request<BaseRecord>(
                            query,
                            variables
                        );

                        return {
                            data: response[meta.operation],
                        };
                    }
                } else {
                    throw Error("GraphQL operation name required.");
                }
            } else {
                throw Error(
                    "GraphQL need to operation, fields and variables values in meta object."
                );
            }
        },
    };
};
