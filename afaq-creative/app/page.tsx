import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Services } from '@/components/Services';
import { Clients } from '@/components/Clients';
import { Licenses } from '@/components/Licenses';
import { Team } from '@/components/Team';
import { Testimonials } from '@/components/Testimonials';
import { Portfolio } from '@/components/Portfolio';
import { Blog } from '@/components/Blog';
import { TalentHub } from '@/components/TalentHub';
import { TalentSuccessStories } from '@/components/TalentSuccessStories';
import { FAQ } from '@/components/FAQ';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { CookieBanner } from '@/components/CookieBanner';
import { ScrollProgress } from '@/components/ScrollProgress';
import { GoogleMap } from '@/components/GoogleMap';

export default function Home() {
  return (
    <main className="bg-afaq-bg min-h-screen">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <TalentHub />
      <Clients />
      <Licenses />
      <Team />
      <Testimonials />
      <Portfolio />
      <Blog />
      <FAQ />
      <GoogleMap />
      <ContactForm />
      <TalentSuccessStories />
      <Footer />
      <FloatingWhatsApp />
      <CookieBanner />
    </main>
  );
}
