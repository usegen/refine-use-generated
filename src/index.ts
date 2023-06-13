import dataProvider from "./data-provider";
export default dataProvider;

export * from "./data-provider";


export {
    GraphQLClient,
    batchRequests,
    gql,
    rawRequest,
    request,
    resolveRequestDocument,
} from "graphql-request";

export type {
    BatchRequestDocument,
    BatchRequestsExtendedOptions,
    BatchRequestsOptions,
    ClientError,
    RawRequestExtendedOptions,
    RawRequestOptions,
    RequestDocument,
    RequestExtendedOptions,
    RequestOptions,
    Variables,
} from "graphql-request";

export * as qqlQueryBuilder from "gql-query-builder";


export * from "./utils";
