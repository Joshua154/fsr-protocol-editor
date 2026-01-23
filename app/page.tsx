import { ProtocolEditor } from "@/components/ProtocolEditor";
import { getFSRMembers, getAssociatedMembers } from "@/common/utils";

export const dynamic = "force-dynamic";

export default function Page() {
  const fsrMembers = getFSRMembers();
  const assocMembers = getAssociatedMembers();

  return (
    <ProtocolEditor
      availableFsrMembers={fsrMembers}
      availableAssocMembers={assocMembers}
    />
  );
}
