// src/app/page.tsx
"use client";
import Image from 'next/image';
import Link from 'next/link';
import SpeedTestWidget from '@/components/speed_test_widget';
import mobilePlans from '@/data/mobile_plans.json';
import broadbandPlans from '@/data/bsnl_plans.json';

// Define types for the plan data
type BroadbandPlan = {
  plan_name: string;
  fmc?: string;
  half_yearly_charges?: string;
  marketing_text: string;
  download_speed?: string;
  free_calling?: string;
  free_ott?: string;
  bandwidth?: string;
};

type MobilePlan = {
  plan_name: string;
  price?: string;
  monthly_charge?: string;
  validity?: string;
  highlights: string;
  benefits: {
    voice?: string;
    data?: string;
    sms?: string;
    additional?: string;
    activation?: string;
    vas?: string;
  };
};

export default function HomePage() {
  // Safely get featured plans with optional chaining
  const featuredBroadbandPlans = broadbandPlans[0]?.plans?.slice(0, 2) || [];
  const featuredMobilePlans = [
    ...(mobilePlans.prepaid_plans?.slice(0, 2) || []),
    ...(mobilePlans.postpaid_plans?.slice(0, 1) || [])
  ] as MobilePlan[];

  const testimonials = [
    { text: "BSNL's broadband saved my remote work!", author: "Ramesh, Mumbai" },
    { text: "Best network coverage in our rural area", author: "Priya, Kerala" },
    { text: "Affordable plans with reliable speed", author: "Arjun, Delhi" }
  ];

  // Helper function to get plan price
  const getPlanPrice = (plan: MobilePlan) => {
    if ('price' in plan) return plan.price;
    if ('monthly_charge' in plan) return plan.monthly_charge;
    return 'N/A';
  };

  return (
    < div className="space-y-8 md:space-y-6">
    {/* Hero Section */}
      <section className="relative text-center rounded-lg overflow-hidden shadow-xl min-h-[40vh] md:min-h-[50vh] flex items-center justify-center p-6 bg-gray-800">
         {/* Background Image using next/image - REPLACE 'placeholder-hero.webp' */}
         <Image
            src="/assets/hero-bg.webp"
            alt="Abstract network connection background"
            fill // Use fill to cover the container
            style={{ objectFit: 'cover' }} // Cover the area
            quality={80} // Adjust quality as needed
            priority // Load this image first as it's above the fold
            className="absolute inset-0 opacity-30 z-0" // Dim the image
         />
         <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)]">
               Your Guide to BSNL Services
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 [text-shadow:_0_1px_3px_rgb(0_0_0_/_30%)]">
               Find the latest plans, test your connection speed, and stay informed with Tele Dhamaka. {/* Replace with your chosen name */}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link
                  href="/broadband" // Link to your plans page
                  className="px-6 py-3 rounded-full bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors duration-300 shadow-md transform hover:scale-105"
               >
                  Explore BSNL Plans
               </Link>
                <button
                  onClick={() => document.getElementById('speed-tester-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 border border-blue-500 transition-colors duration-300 shadow-md transform hover:scale-105"
                >
                  Test Your Speed
                </button>
            </div>
         </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Feature Item */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow duration-300">
          {/* Replace with actual icons */}
          <div className="text-blue-600 text-4xl mb-3 mx-auto w-fit">🚀</div>
          <h3 className="text-xl font-semibold mb-2">Speed Tester</h3>
          <p className="text-gray-600 text-sm">Check your real-time download & upload speeds.</p>
          <Link href="#speed-tester-section" onClick={(e) => { e.preventDefault(); document.getElementById('speed-tester-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-3 inline-block">Test Now →</Link>
        </div>
        {/* Feature Item */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow duration-300">
          <div className="text-green-600 text-4xl mb-3 mx-auto w-fit">📄</div>
          <h3 className="text-xl font-semibold mb-2">Latest Plans</h3>
          <p className="text-gray-600 text-sm">Browse updated FTTH and Mobile recharge plans.</p>
          <Link href="/broadband" className="text-green-600 hover:text-green-800 text-sm font-medium mt-3 inline-block">See Plans →</Link>
        </div>
        {/* Feature Item */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow duration-300">
          <div className="text-purple-600 text-4xl mb-3 mx-auto w-fit">📰</div>
          <h3 className="text-xl font-semibold mb-2">Info Blog</h3>
          <p className="text-gray-600 text-sm">Read news, tips, and updates about BSNL services.</p>
          <Link href="/blog" className="text-purple-600 hover:text-purple-800 text-sm font-medium mt-3 inline-block">Read Blog →</Link>
        </div>
         {/* Feature Item */}
         <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow duration-300">
          <div className="text-orange-600 text-4xl mb-3 mx-auto w-fit">💬</div>
          <h3 className="text-xl font-semibold mb-2">Chat Support</h3>
          <p className="text-gray-600 text-sm">Get Distance between two locations, Data usage Calculator etc...</p>
          {/* Link to where chatbot will be, maybe opens a modal or goes to a contact page */}
          <Link href="/calculator" className="text-orange-600 hover:text-orange-800 text-sm font-medium mt-3 inline-block">Chat Now →</Link>
        </div>
      </section>
      {/* ... (keep previous sections unchanged) ... */}

      {/* Featured Plans */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Popular Plans
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Broadband Plans */}
            {featuredBroadbandPlans.map((plan: BroadbandPlan, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-blue-800">{plan.plan_name}</h3>
                <div className="mb-4">
                  <span className="text-2xl font-bold">
                    {plan.fmc || plan.half_yearly_charges || 'Contact for pricing'}
                  </span>
                  {plan.fmc && <span className="text-gray-500 ml-2">/month</span>}
                </div>
                <p className="text-gray-600 mb-4">{plan.marketing_text}</p>
                {plan.download_speed && (
                  <div className="flex items-center mb-4">
                    <span className="text-sm font-semibold">Speed:</span>
                    <span className="ml-2 text-blue-600">
                      {plan.download_speed.split(',')[0]}
                    </span>
                  </div>
                )}
                <Link href="/broadband" className="text-blue-600 font-semibold hover:text-blue-800">
                  View Details →
                </Link>
              </div>
            ))}

            {/* Mobile Plans */}
            {featuredMobilePlans.map((plan: MobilePlan, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-green-800">{plan.plan_name}</h3>
                <div className="mb-4">
                  <span className="text-2xl font-bold">{getPlanPrice(plan)}</span>
                  <span className="text-gray-500 ml-2">
                    {plan.price ? '/recharge' : plan.monthly_charge ? '/month' : ''}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{plan.highlights}</p>
                <div className="flex items-center mb-4">
                  <span className="text-sm font-semibold">Benefits:</span>
                  <span className="ml-2 text-green-600 line-clamp-2">
                    {plan.benefits?.data || plan.benefits?.voice || 'Contact for details'}
                  </span>
                </div>
                <Link href="/mobile" className="text-green-600 font-semibold hover:text-green-800">
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-yellow-400 text-blue-900 px-4 py-1 rounded-full inline-block mb-4 text-sm font-bold">
            Limited Time Offer
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Monsoon Special! 20% Off for 3 Months
          </h2>
          <p className="text-xl mb-8">On selected broadband plans - Hurry before the offer washes away!</p>
          <Link
            href="/broadband"
            className="inline-block px-8 py-3 bg-white text-blue-900 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            Claim Discount Now
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <p className="text-gray-600 mb-4 italic">&quot;{testimonial.text}&quot;</p>
              <p className="font-semibold text-blue-600">— {testimonial.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Speed Test Section */}
      <section id="speed-tester-section" className="scroll-mt-20">
        <SpeedTestWidget />
      </section>

      {/* Trust Badges */}
      {/* <div className="container mx-auto px-4 text-center py-8">
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center gap-2">
            <Image src="/assets/iso-certified.png" width={60} height={60} alt="ISO Certified" />
            <span className="text-gray-600">ISO 9001 Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-4xl">🏆</div>
            <span className="text-gray-600">Government of India Enterprise</span>
          </div>
        </div>
      </div> */}
    </div>
  );
}