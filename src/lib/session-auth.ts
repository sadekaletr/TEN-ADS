import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getCreatorSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "creator") return null;
  return session;
}

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") return null;
  return session;
}

export async function getSponsorSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "sponsor") return null;
  return session;
}

export async function getAgencySession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "agency_admin") return null;
  return session;
}
