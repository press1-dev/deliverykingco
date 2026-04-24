import { clsx } from 'clsx';
import { getLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import '../globals.css';

import { fonts } from '~/app/fonts';

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();

  return (
    <html className={clsx(fonts.map((f) => f.variable))} lang={locale}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
