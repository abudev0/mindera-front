import Features from '@/components/features'
import Testimonials from '@/components/testimonials'
import StudentVideos from '@/components/student-videos'
import Guarantee from '@/components/guarantee'
import RegistrationModal from '@/components/registration-modal'
import Footer from '@/components/footer'
import Hero from '@/components/hero'

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
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
