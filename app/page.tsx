import { ProtocolEditor } from "@/components/ProtocolEditor";

export const dynamic = "force-dynamic";

export default function Page() {
  const fsrMembers = (
    process.env.FSR_MEMBERS ||
    process.env.NEXT_PUBLIC_FSR_MEMBERS ||
    ""
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const assocMembers = (
    process.env.ASSOCIATED_MEMBERS ||
    process.env.NEXT_PUBLIC_ASSOCIATED_MEMBERS ||
    ""
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <ProtocolEditor
      availableFsrMembers={fsrMembers}
      availableAssocMembers={assocMembers}
    />
  );
}
