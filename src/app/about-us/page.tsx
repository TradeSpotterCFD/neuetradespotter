// src/app/about-us/page.tsx
import { Footer } from '@/components/Footer';
import type { Metadata } from "next";
import Image from 'next/image';

export const metadata: Metadata = {
  title: "About Us | TradeSpotter",
  description: "Learn more about TradeSpotter, our mission, values, and the team dedicated to helping you find the best trading brokers.",
};

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        {/* Section 1: Hero */}
        <section className="py-24 md:py-40 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              We are TradeSpotter
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted guide in the world of online trading. We compare, review, and help you find the perfect broker.
            </p>
          </div>
        </section>

        {/* Section 2: Intro Text (in container) & Full-Width Image Grid */}
        <section className="pb-16 md:pb-24">
          {/* Text part remains in container */}
          <div className="container mx-auto px-4 pt-16 md:pt-24 mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-semibold text-[#703d98] uppercase tracking-wider">01. ABOUT US</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <p className="text-gray-600 text-lg">
TradeSpotter was created to bring clarity to trading. We are committed to delivering unbiased reviews, highlighting each broker's strengths, and helping users find the right fit. Our team values independence, accuracy, and real user benefit.

                </p>
              </div>
              <div className="text-gray-600 pt-8 md:pt-0">
At TradeSpotter, our mission is to simplify the broker selection process. We guide traders through the complex world of online trading with clear, data-backed insights. Our focus is on transparency, comparison, and empowering confident decisions.

              </div>
            </div>
          </div>

          {/* Image Area: Full Width - Using Flexbox */}
          <div className="w-full">
            {/* Using Flexbox for main layout, items-stretch is default */}
            <div className="flex flex-col lg:flex-row gap-0.5"> {/* Minimal gap */}

              {/* Left Column (Large Image) */}
              {/* Takes 2/3 width on large screens, relative for Image */}
              <div className="lg:flex-[2] bg-gray-300 relative"> {/* No rounding */}

                {/* Actual Image would use fill and cover */}
                 <Image src="/images/about-us-1.jpg" alt="Main About Image" fill={true} style={{objectFit: 'cover'}} className="absolute inset-0 w-full h-full" />
              </div>

              {/* Right Column (2x2 Grid) */}
              {/* Takes 1/3 width on large screens, relative for inner grid */}
              <div className="lg:flex-[1] relative">
                {/* Inner 2x2 Grid - Takes full height of the flex item */}
                <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-full">
                  <div className="bg-gray-300 aspect-square relative overflow-hidden"> {/* No rounding */}

                     <Image src="/images/about-us-2.jpg" alt="Small Image 1" fill={true} style={{objectFit: 'cover'}} />
                  </div>
                   <div className="bg-gray-300 aspect-square relative overflow-hidden"> {/* No rounding */}

                     <Image src="/images/about-us-3.jpg" alt="Small Image 2" fill={true} style={{objectFit: 'cover'}} />
                  </div>
                   <div className="bg-gray-300 aspect-square relative overflow-hidden"> {/* No rounding */}

                     <Image src="/images/about-us-4.jpg" alt="Small Image 3" fill={true} style={{objectFit: 'cover'}} />
                  </div>
                   <div className="bg-gray-300 aspect-square relative overflow-hidden"> {/* No rounding */}

                     <Image src="/images/about-us-5.jpg" alt="Small Image 4" fill={true} style={{objectFit: 'cover'}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Image Area */}
        </section>

        {/* Section 3: Who We Are / Stats */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
             <div className="grid md:grid-cols-2 gap-12 items-center">
               <div>
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-10 border-t border-gray-300"></div>
                   <span className="text-sm font-semibold text-[#703d98] uppercase tracking-wider">02. WHO WE ARE</span>
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Data-Driven Broker Insights</h2>
                 <p className="text-gray-600 mb-8">
                   Placeholder text explaining TradeSpotter's approach. We deploy world-class analysis and comparison tools to ensure you make informed decisions.
                 </p>
                 <div className="flex gap-8">
                   <div>
                     <p className="text-4xl font-bold text-gray-900">500+</p>
                     <p className="text-gray-600">Brokers Compared</p>
                   </div>
                   <div>
                     <p className="text-4xl font-bold text-gray-900">10K+</p>
                     <p className="text-gray-600">Data Points Analyzed</p>
                   </div>
                 </div>
               </div>
               <div className="bg-gray-300 h-64 md:h-80 rounded-lg flex items-center justify-center text-gray-500 relative overflow-hidden">
                 <span>Image 3 Placeholder</span>
                 {/* <Image src="/images/about-3.jpg" alt="Data Analysis" fill objectFit="cover" /> */}
               </div>
            </div>
          </div>
        </section>

        {/* Section 3.5: Three Column Layout (Placeholder) */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1 */}
              <div className="flex flex-col gap-4">

                <div className="bg-gray-300 h-64 rounded-lg flex items-center justify-center text-gray-500 relative overflow-hidden">

                  <Image src="/images/broker-trading.jpg" alt="Placeholder 4" fill objectFit="cover" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Links/Text Area 1</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>Placeholder Link/Text 1</li>
                    <li>Placeholder Link/Text 2</li>
                    <li>Placeholder Link/Text 3</li>
                    <li>Placeholder Link/Text 4</li>
                  </ul>
                </div>
              </div>
              {/* Column 2 */}
              <div className="bg-gray-300 h-64 md:h-auto md:min-h-[400px] rounded-lg flex items-center justify-center relative overflow-hidden">


              </div>
              {/* Column 3 */}
              <div className="flex flex-col gap-4">

                <div>
                  <h3 className="font-semibold mb-2">Links/Text Area 2</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>Placeholder Link/Text 5</li>
                    <li>Placeholder Link/Text 6</li>
                    <li>Placeholder Link/Text 7</li>
                    <li>Placeholder Link/Text 8</li>
                  </ul>
                </div>
                 <div className="bg-gray-300 h-64 rounded-lg flex items-center justify-center text-gray-500 relative overflow-hidden">
                  <span>Image 6 Placeholder</span>
                  {/* <Image src="/images/about-6.jpg" alt="Placeholder 6" fill objectFit="cover" /> */}
                </div>
              </div>
            </div>
          </div>
        </section>

         {/* Section 4: Team / Values (Placeholder) */}
         <section className="py-16 md:py-24 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Team & Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">Placeholder text about the team behind TradeSpotter and the core values that drive the platform.</p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-lg shadow">Value 1: Transparency</div>
                <div className="bg-white p-8 rounded-lg shadow">Value 2: Accuracy</div>
                <div className="bg-white p-8 rounded-lg shadow">Value 3: User Empowerment</div>
             </div>
           </div>
         </section>

         {/* Section 5: Testimonial (Placeholder) */}
         <section className="py-16 md:py-24 bg-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
             <svg className="w-12 h-12 mx-auto mb-6 text-gray-500" fill="currentColor" viewBox="0 0 32 32"><path d="M10.001 16.999c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5h.999v-6h-1c3.31 0-6 2.69-6 6v10c0 3.31 2.69 6 6 6h1c2.76 0 5-2.24 5-5v-5z"></path></svg>
            <p className="text-xl md:text-2xl italic mb-6 max-w-3xl mx-auto">
              "Placeholder testimonial text highlighting how TradeSpotter helped a user find the right broker. Their comparisons are incredibly detailed and saved me a lot of time!"
            </p>
            <p className="font-semibold">- Satisfied Trader</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}