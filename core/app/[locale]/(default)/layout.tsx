import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';
import { DeliveryWindow } from '~/components/custom-components/layout/delivery-window';
import { TopWarning } from '~/components/custom-components/layout/top-warning';

import { Footer } from '~/components/footer';
import { Header } from '~/components/header';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function DefaultLayout({ params, children }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <>
      <TopWarning />
      <DeliveryWindow />
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  );
}
