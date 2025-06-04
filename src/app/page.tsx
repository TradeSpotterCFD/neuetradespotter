// src/app/page.tsx
import { Hero } from '@/components/Hero';
import { BrokerSearchFilter } from '@/components/BrokerSearchFilter';
import { TopBrokersSection } from '@/components/TopBrokersSection';
import { BrowseByCategory } from '@/components/BrowseByCategory';
import { FeaturedBrokers } from '@/components/FeaturedBrokers';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <BrokerSearchFilter />
      <TopBrokersSection />
      <BrowseByCategory />
      <FeaturedBrokers />
      <WhyChooseUs />
      <Footer />
    </main>
  );
}