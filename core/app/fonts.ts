import { Be_Vietnam_Pro, DM_Serif_Text, Inter, Roboto_Mono, Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-family-heading',
})

const spaceGroteskLabel = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-family-label',
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-family-body',
})

export const fonts = [spaceGrotesk, beVietnamPro, spaceGroteskLabel];
