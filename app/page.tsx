import Features from '@/components/features'
import Testimonials from '@/components/testimonials'
import StudentVideos from '@/components/student-videos'
import Guarantee from '@/components/guarantee'
import RegistrationModal from '@/components/registration-modal'
import Footer from '@/components/footer'
import Hero from '@/components/hero'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://mindera.uz/#organization',
      name: 'Mindera',
      legalName: 'MINDERA MChJ',
      url: 'https://mindera.uz/',
      logo: 'https://mindera.uz/logo.png',
      description:
        'O‘zbek tilida onlayn ingliz tili va speaking kurslarini taklif qiluvchi ta’lim markazi.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Toshkent',
        addressRegion: 'Yashnobod tumani',
        streetAddress: 'Olmos mahallasi, Dilnur 4-berk ko‘chasi, 58-D',
        addressCountry: 'UZ',
      },
      sameAs: ['https://t.me/mindera_admin'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://mindera.uz/#website',
      url: 'https://mindera.uz/',
      name: 'Mindera',
      alternateName: ['Mindera Uz', 'Mindera.uz'],
      inLanguage: 'uz-UZ',
      publisher: { '@id': 'https://mindera.uz/#organization' },
    },
  ],
}

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Hero />
      <Features />
      <Testimonials />
      <StudentVideos />
      <Guarantee />
      <Footer />
      <RegistrationModal />
    </main>
  )
}
