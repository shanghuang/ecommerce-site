import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Define supported locales
export const locales = ['en', 'es', 'fr']; // Add more as needed

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

//export const locales;// = ['en', 'es', 'fr']; // Export for use in other files
export const defaultLocale = 'en';
