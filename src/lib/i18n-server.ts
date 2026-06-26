import { cookies } from "next/headers";
import {
  getDir,
  getMessages,
  isLocale,
  LOCALE_COOKIE,
  translate,
  type Locale,
} from "@/lib/i18n-core";

export { getDir };

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(saved) ? saved : "ar";
}

export async function getServerT() {
  const locale = await getLocale();
  return {
    locale,
    dir: getDir(locale),
    t: (key: string) => translate(locale, key),
    messages: getMessages(locale),
  };
}
