import { notFound } from "next/navigation";
import { PitchDeckLive } from "@/components/pitch/PitchDeckLive";
import {
  getCreatorPitchData,
  RESERVED_HANDLES,
} from "@/lib/pitch/get-creator-pitch-data";

export default async function CreatorPitchPage({
  params,
}: {
  params: { handle: string };
}) {
  const handle = decodeURIComponent(params.handle).replace(/^@/, "").toLowerCase();
  if (RESERVED_HANDLES.has(handle)) notFound();

  const data = await getCreatorPitchData(handle);
  if (!data) notFound();

  return <PitchDeckLive data={data} />;
}
