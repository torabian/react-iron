// @ts-nocheck
import { FormikHelpers } from "formik";
import React, { useCallback, useContext } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClient,
  UseQueryOptions,
} from "react-query";
import { WorkspaceTypeActions } from "./workspace-type-actions";
import * as workspaces from "./index";
import {
  execApiFn,
  RemoteRequestOption,
  IDeleteResponse,
  core,
  IResponse,
  ExecApi,
  mutationErrorsToFormik,
  IResponseList,
} from "../../core/http-tools";
import { RemoteQueryContext } from "../../core/react-tools";

interface Query {
  withPreloads?: string;
  itemsPerPage?: number;
  deep?: boolean;
  startIndex?: number;
  query?: string;
  jsonQuery?: any;
  uniqueId?: string;
}

export function useGetWorkspaceTypes({
  queryOptions,
  query,
  queryClient,
  execFnOverride,
  unauthorized,
}: {
  query?: Query;
  queryClient: QueryClient;
  execFnOverride?: any;
  queryOptions?: UseQueryOptions<any>;
  unauthorized?: boolean;
}) {
  const { options, execFn } = useContext(RemoteQueryContext);

  const fnx = execFnOverride
    ? WorkspaceTypeActions.fnExec(execFnOverride(options))
    : execFn
    ? WorkspaceTypeActions.fnExec(execFn(options))
    : WorkspaceTypeActions.fn(options);
  const Q = () =>
    fnx
      .startIndex(query?.startIndex)
      .deep(query?.deep)
      .withPreloads(query?.withPreloads)
      .itemsPerPage(query?.itemsPerPage)
      .query(query?.query)
      .jsonQuery(query?.jsonQuery);

  const fn = () => Q().getWorkspaceTypes();

  const auth = options?.headers?.authorization;
  const hasKey =
    auth != "undefined" &&
    auth != undefined &&
    auth != null &&
    auth != "null" &&
    !!auth;
  const query$ = useQuery(
    ["*workspaces.WorkspaceTypeEntity", options, query],
    fn,
    {
      cacheTime: 1000,
      retry: false,
      keepPreviousData: true,
      enabled: hasKey || unauthorized || false,
      ...(queryOptions || {}),
    } as any
  );

  // const items: workspaces.WorkspaceTypeEntity[] = query$.data?.data?.items;
  const items = [];

  return { query: query$, items };
}

useGetWorkspaceTypes.UKEY = "*workspaces.WorkspaceTypeEntity";
