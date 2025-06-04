// src/app/contact-us/page.tsx
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react'; // Unbenutzte Importe entfernt
import type { Metadata } from "next";
import Image from 'next/image'; // Import Image component

export const metadata: Metadata = {
  title: "Contact Us | TradeSpotter",
  description: "Get in touch with TradeSpotter. Ask questions, send feedback, or inquire about partnerships. We're here to help!",
};

export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Section 1: Any Questions? (Layout based on image 1) */}
        <section className="bg-gray-100 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
              {/* Left Side: Text */}
              <div className="md:w-1/2 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Any questions? <br /> Simply ask us.
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  We're here to help you navigate the world of online trading.<br /> Get in touch for direct contact.
                </p>
              </div>

              {/* Right Side: Image Grid */}
              <div className="md:w-1/2 grid grid-cols-2 gap-4">
                {/* Large image (left) */}
                <div className="col-span-1 row-span-2 rounded-lg relative overflow-hidden h-[400px]">
                  <Image
                    src="/images/Brokerbild-1.jpg"
                    alt="Trading charts on multiple screens"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* Small image 1 (top-right) */}
                <div className="col-span-1 rounded-lg relative overflow-hidden h-48">
                   <Image
                    src="/images/Brokerbild-2.jpg"
                    alt="Broker office environment"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 50vw, 25vw"
                   />
                </div>
                {/* Small image 2 (bottom-right) */}
                <div className="col-span-1 rounded-lg relative overflow-hidden h-48">
                   <Image
                    src="/images/Brokerbild-3.jpg"
                    alt="Close-up of trading data on screen"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 50vw, 25vw"
                   />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Contact Form & Info */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
              {/* Left: Contact Info */}
              <div className="md:w-1/3">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  We’d love to hear from you.
                </h3>
                <p className="text-gray-600 mb-6">
                  Got questions about brokers, trading platforms <br />or our comparisons? Reach out anytime.
                </p>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start">
                    {/* <Phone className="h-5 w-5 mr-3 mt-1 text-[#145588]" /> */} {/* Entfernt, da unbenutzt */}
                    <span>+881 750 6606 00</span>
                  </div>
                  <div className="flex items-start">
                    {/* <Mail className="h-5 w-5 mr-3 mt-1 text-[#145588]" /> */} {/* Entfernt, da unbenutzt */}
                    <span>info@tradespotter.xyz</span> {/* Updated Email */}
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 mt-1 text-[#145588]" />
                    <span> {/* Updated Address */}
                      Balboa Avenue Business Center<br />
                      Tower Financial Park, 5th Floor, Suite 502<br />
                      Balboa Avenue No. 35<br />
                      Panama City, Republic of Panama
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Contact Form */}
              <div className="md:w-2/3">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Let’s get you one step closer to the right broker
                </h2>
                <p className="text-gray-600 max-w-xl mb-12">
                  Ask us anything – we’ll get back to you shortly.
                </p>

                <form action="#" method="POST" className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</Label>
                      <Input type="text" name="name" id="name" required className="w-full" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</Label>
                      <Input type="email" name="email" id="email" required className="w-full" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</Label>
                      <Input type="tel" name="phone" id="phone" className="w-full" />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject *</Label>
                      <Input type="text" name="subject" id="subject" required className="w-full" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</Label>
                    <Textarea name="message" id="message" rows={4} required className="w-full" />
                  </div>
                  <div>
                    <Button type="submit" className="bg-[#703d98] hover:bg-[#5a317d] text-white px-6 py-3">
                      Send Messages
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}