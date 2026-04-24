import { getLocale, getTranslations } from 'next-intl/server';

// English fallbacks for when next-intl locale context is unavailable
// (paths that fall completely outside the [locale] proxy routing)
const FALLBACK_TITLE = "We couldn't find that page!";
const FALLBACK_SUBTITLE = 'Try searching for something else or go back to the home page.';
const FALLBACK_CTA = 'Go to homepage';

export default async function RootNotFound() {
  let title = FALLBACK_TITLE;
  let subtitle = FALLBACK_SUBTITLE;

  try {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: 'NotFound' });

    title = t('title');
    subtitle = t('subtitle');
  } catch {
    // Silently fall back to English — this renders outside the
    // next-intl request context when a completely invalid path is hit.
  }

  return (
    <main className="flex flex-1 items-center justify-center font-[family-name:var(--not-found-font-family,var(--font-family-body))]">
      <div className="mx-auto w-full max-w-screen-2xl px-3 py-10 @container @xl:px-6 @4xl:px-20">
        <header className="text-center">
          <h1 className="mb-3 font-[family-name:var(--not-found-title-font-family,var(--font-family-heading))] text-3xl font-medium leading-none text-[var(--not-found-title,hsl(var(--foreground)))] @xl:text-4xl @4xl:text-5xl">
            {title}
          </h1>
          <p className="mb-4 text-lg text-[var(--not-found-subtitle,hsl(var(--contrast-500)))]">
            {subtitle}
          </p>
          <a
            className="relative z-0 inline-flex min-h-14 select-none items-center justify-center gap-x-3 overflow-hidden rounded-full border border-[var(--button-primary-border,hsl(var(--primary)))] bg-[var(--button-primary-background,hsl(var(--primary)))] px-6 py-4 text-center font-[family-name:var(--button-font-family)] text-base font-semibold leading-normal text-[var(--button-primary-text)] after:absolute after:inset-0 after:-z-10 after:-translate-x-[105%] after:rounded-full after:bg-[var(--button-primary-background-hover,color-mix(in_oklab,hsl(var(--primary)),white_75%))] after:transition-[opacity,transform] after:duration-300 after:[animation-timing-function:cubic-bezier(0,0.25,0,1)] hover:after:translate-x-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--button-focus,hsl(var(--primary)))] focus-visible:ring-offset-2"
            href="/"
          >
            <span>{FALLBACK_CTA}</span>
          </a>
        </header>
      </div>
    </main>
  );
}
