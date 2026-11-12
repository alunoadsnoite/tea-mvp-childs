import { translate } from "@/lib/i18n";
import { useLanguageStore } from "@/stores/languageStore";

export function useTranslation() {
  const language = useLanguageStore((state) => state.language);
  return { language, t: translate[language] };
}
