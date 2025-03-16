import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from './components/Nav';
import { SessionProvider } from './components/Session';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from './lib/messages';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextShop",
  description: "Your online shopping destination",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = 'tw'; // Replace with your logic to determine the locale
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider>
            <Nav />
            {children}
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}