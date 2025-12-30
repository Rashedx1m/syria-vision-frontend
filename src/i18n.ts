import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "ar", "fr", "tr"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locale ?? defaultLocale;

  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`)).default,
  };
});
