import { useCallback } from "react";
import { translations } from "../i18n/translations";
import { useAppSettings } from "../contexts/AppSettingsContext";

type Language = keyof typeof translations;
type TranslationsType = typeof translations.zh_TW;

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DotNestedKeys<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
      }[Exclude<keyof T, symbol>]
    : ""
) extends infer D
  ? Extract<D, string>
  : never;

type TranslationKey = DotNestedKeys<TranslationsType>;

export function useTranslation() {
  const { language } = useAppSettings();

  const t = useCallback(
    (key: TranslationKey): string => {
      const keys = key.split(".");
      let value: any = translations[language];

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          console.warn(`Translation not found for key: ${key}`);
          return key;
        }
      }

      return value;
    },
    [language]
  );

  return { t };
}
