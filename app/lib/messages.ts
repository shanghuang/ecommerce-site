export async function getMessages(locale: string) {
    return (await import(`../locales/${locale}.json`)).default;
  }