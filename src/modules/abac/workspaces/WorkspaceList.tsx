import { screens } from "@/apps/academy/screens";
import { useDatatableFiltering } from "@/hooks/useDatatableFiltering";
import { useT } from "@/hooks/useT";

import { useGetWorkspaces } from "src/sdk/fireback/modules/workspaces/useGetWorkspaces";

import { CommonListManager } from "@/components/entity-manager/CommonListManager";
import { WorkspaceNavigationTools } from "src/sdk/fireback/modules/workspaces/workspace-navigation-tools";
import { columns } from "./WorkspaceColumns";
import { CommonRowDetail } from "@/components/detail-table/DetailTable";
import { useGetCteWorkspaces } from "@/sdk/fireback/modules/workspaces/useGetCteWorkspaces";

export const WorkspaceList = () => {
  const t = useT();
  const uniqueIdHrefHandler = (uniqueId: string) =>
    WorkspaceNavigationTools.single(uniqueId);

  return (
    <>
      <CommonListManager
        columns={columns(t)}
        queryHook={useGetCteWorkspaces}
        onRecordsDeleted={({ queryClient }) => {
          queryClient.invalidateQueries("*workspaces.UserRoleWorkspace");
          queryClient.invalidateQueries("*workspaces.WorkspaceEntity");
        }}
        RowDetail={(props: any) => (
          <CommonRowDetail
            {...props}
            columns={columns}
            uniqueIdHref
            Handler={uniqueIdHrefHandler}
          />
        )}
        uniqueIdHrefHandler={uniqueIdHrefHandler}
      ></CommonListManager>
    </>
  );
};
