import { KeyholeIntroPage } from '@/components/keyhole-intro-page'

export const metadata = { title: 'The Inner Arc — Tarot for the questions that matter' }

export default function IntroPage() {
  return <KeyholeIntroPage image="/images/hero-cards-candles.jpg" enterHref="/home" />
}
