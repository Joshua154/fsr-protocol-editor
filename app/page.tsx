import { ProtocolEditor } from "@/components/ProtocolEditor";
import { getFSRMembers, getAssociatedMembers } from "@/common/utils";

export const dynamic = "force-dynamic";

export default function Page() {
  const fsrMembers = getFSRMembers();
  const assocMembers = getAssociatedMembers();
  const defaultStartTime = process.env.DEFAULT_START_TIME || "";
  const defaultLocation = process.env.DEFAULT_LOCATION || "";
  const defaultRoom = process.env.DEFAULT_ROOM || "";

  return (
    <ProtocolEditor
      availableFsrMembers={fsrMembers}
      availableAssocMembers={assocMembers}
      defaultStartTime={defaultStartTime}
      defaultLocation={defaultLocation}
      defaultRoom={defaultRoom}
    />
  );
}
