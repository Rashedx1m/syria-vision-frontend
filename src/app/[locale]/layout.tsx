import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const locales = ["en", "ar", "fr", "tr"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages({ locale });

  // Set direction for RTL languages (Arabic)
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div lang={locale} dir={dir} className="min-h-screen flex flex-col">
      <NextIntlClientProvider messages={messages}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </NextIntlClientProvider>
    </div>
  );
}
