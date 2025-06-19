// app/mobile/page.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiPhone, FiMessageSquare, FiGlobe, FiStar, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Import the mobile plans data
import mobilePlansData from './mobile_plans.json';

// Missing icons from react-icons/fi
const FiChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const FiChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Interface for mobile plans
interface MobilePlan {
  id: number;
  name: string;
  price: string;
  validity: string;
  category: 'prepaid' | 'postpaid' | 'stv';
  popular: boolean;
  highlights: string;
  benefits: {
    voice?: string;
    sms?: string;
    data: string;
    activation?: string;
    vas?: string;
    additional?: string;
    family?: string;
    countries?: string;    
  };
  call_rates?: {
    local: string;
    std: string;
    roaming: string;
  };
}

// Utility function to calculate cost per day
const calculateCostPerDay = (price: string, validity: string, category: 'prepaid' | 'postpaid' | 'stv', name: string): string => {
  const priceNum = parseFloat(price.replace(/[^0-9.]/g, ''));

   // Special handling for specific postpaid plans
  if (category === 'postpaid') {
    // Custom duration for specific plans
    if (name.includes('525')) return `₹${(priceNum/60).toFixed(2)}/day`;
    if (name.includes('798')) return `₹${(priceNum/90).toFixed(2)}/day`;
    if (name.includes('999')) return `₹${(priceNum/120).toFixed(2)}/day`;
    
    // Default postpaid calculation (monthly/30)
    return `₹${(priceNum/30).toFixed(2)}/day`;
  }


  let validityDays = 0;
  
  if (validity.includes('day')) {
    validityDays = parseInt(validity.split(' ')[0]);
  } else if (validity.includes('month')) {
    const months = parseInt(validity.split(' ')[0]);
    validityDays = months * 30;
  } else if (validity.includes('year')) {
    validityDays = 365;
  } else if (validity === 'Monthly') {
    validityDays = 30;
  }

  if (priceNum > 0 && validityDays > 0) {
    const costPerDay = priceNum / validityDays;
    return `₹${costPerDay.toFixed(2)}/day`;
  }
  
  return 'N/A';
};

const MobilePlansPage = () => {
  // State for filters and UI
  const [activeTab, setActiveTab] = useState<'prepaid' | 'postpaid' | 'stv'>('prepaid');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [validityRange, setValidityRange] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const planContainerRef = useRef<HTMLDivElement>(null);

  // Process the JSON data into component state
  const [plans, setPlans] = useState<MobilePlan[]>([]);

  useEffect(() => {
    const processPlans = () => {
      const processedPlans: MobilePlan[] = [];
      let idCounter = 1;

      // Process prepaid plans
      mobilePlansData.prepaid_plans.forEach((plan) => {
        processedPlans.push({
          id: idCounter++,
          name: plan.plan_name,
          price: plan.price,
          validity: plan.validity,
          category: 'prepaid',
          popular: plan.plan_name.includes('1999') || plan.plan_name.includes('997'),
          highlights: plan.highlights,
          benefits: plan.benefits,
          call_rates: plan.call_rates
        });
      });

      // Process postpaid plans
      mobilePlansData.postpaid_plans.forEach((plan) => {
        processedPlans.push({
          id: idCounter++,
          name: plan.plan_name,
          price: `${plan.price}/month`,
          validity: 'Monthly',
          category: 'postpaid',
          popular: plan.plan_name.includes('999') || plan.plan_name.includes('399'),
          highlights: plan.highlights,
          benefits: plan.benefits
        });
      });

      // Process STVs
      mobilePlansData.special_tariff_vouchers.forEach((stv) => {
        processedPlans.push({
          id: idCounter++,
          name: stv.stv_name,
          price: stv.price,
          validity: stv.validity,
          category: 'stv',
          popular: stv.stv_name.includes('299') || stv.stv_name.includes('251'),
          highlights: stv.highlights,
          benefits: {
            voice: stv.benefits.voice || 'Not included',
            sms: stv.benefits.sms || 'Not included',
            data: stv.benefits.data || 'Not included',
            activation: stv.benefits.activation || 'Not included',
            vas: stv.benefits.vas || 'Not included',
            countries: stv.benefits.countries || 'Not included'            
          }
        });
      });

      setPlans(processedPlans);
    };

    processPlans();
  }, []);

  // Filter plans based on active tab and filters
  const filteredPlans = plans.filter(plan => {
    if (plan.category !== activeTab) return false;

    const priceNum = parseInt(plan.price.replace(/[^0-9]/g, ''));
    let validityNum = 0;
    
    if (plan.validity.includes('day')) {
      validityNum = parseInt(plan.validity.split(' ')[0]);
    } else if (plan.validity === 'Monthly') {
      validityNum = 30;
    } else if (plan.validity.includes('month')) {
      validityNum = parseInt(plan.validity.split(' ')[0]) * 30;
    } else if (plan.validity.includes('year')) {
      validityNum = 365;
    }

    const priceMatch = priceRange === 'all' ||
      (priceRange === 'low' && priceNum <= 300) ||
      (priceRange === 'medium' && priceNum > 300 && priceNum <= 1000) ||
      (priceRange === 'high' && priceNum > 1000);

    const validityMatch = validityRange === 'all' ||
      (validityRange === 'short' && validityNum <= 30) ||
      (validityRange === 'medium' && validityNum > 30 && validityNum <= 90) ||
      (validityRange === 'long' && validityNum > 90);

    return priceMatch && validityMatch;
  });

  // Scroll functionality for plan cards
  const scrollPlans = (direction: 'left' | 'right') => {
    if (planContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      planContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // FAQ data
  const faqs = [
    {
      question: "How do I activate a BSNL prepaid plan?",
      answer: "You can activate any prepaid plan by recharging with the plan amount through the BSNL self-care portal, mobile app, or authorized retailers."
    },
    {
      question: "Can I carry forward unused data?",
      answer: "For postpaid plans, unused data can be rolled over up to the specified limit (e.g., 75GB for Plan-199). Prepaid plans don't support data rollover."
    },
    {
      question: "What happens after my daily data limit is exhausted?",
      answer: "You'll continue to get unlimited data at reduced speed of 40kbps for the remainder of your plan validity."
    },
    {
      question: "How do I add family members to my postpaid plan?",
      answer: "Visit your nearest BSNL customer care center with ID proofs of all members to add family connections to your postpaid plan."
    },
    {
      question: "Are international calls included in unlimited benefits?",
      answer: "No, unlimited voice benefits don't include international calls. Standard ISD rates will apply for such calls."
    }
  ];

  // Features highlights
  const features = [
    {
      icon: <FiPhone className="w-8 h-8 text-blue-600" />,
      title: "Unlimited Calls",
      description: "Make unlimited calls to any network in India including while roaming"
    },
    {
      icon: <FiGlobe className="w-8 h-8 text-blue-600" />,
      title: "Massive Data",
      description: "Plans with up to 600GB high-speed data for heavy users"
    },
    {
      icon: <FiMessageSquare className="w-8 h-8 text-blue-600" />,
      title: "Daily SMS",
      description: "100 free SMS per day with most plans"
    },
    {
      icon: <FiClock className="w-8 h-8 text-blue-600" />,
      title: "Long Validity",
      description: "Annual plans with 365 days validity available"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">BSNL Mobile Plans</h1>
          <p className="text-xl mb-8">Unlimited calls, massive data, and nationwide coverage at unbeatable prices</p>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setActiveTab('prepaid')}
              className={`px-6 py-3 rounded-full font-medium ${activeTab === 'prepaid' ? 'bg-white text-blue-900' : 'bg-blue-800 text-white'}`}
            >
              Prepaid
            </button>
            <button 
              onClick={() => setActiveTab('postpaid')}
              className={`px-6 py-3 rounded-full font-medium ${activeTab === 'postpaid' ? 'bg-white text-blue-900' : 'bg-blue-800 text-white'}`}
            >
              Postpaid
            </button>
            <button 
              onClick={() => setActiveTab('stv')}
              className={`px-6 py-3 rounded-full font-medium ${activeTab === 'stv' ? 'bg-white text-blue-900' : 'bg-blue-800 text-white'}`}
            >
              Special Vouchers
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md text-center"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-900">
              {activeTab === 'prepaid' && 'Prepaid Plans'}
              {activeTab === 'postpaid' && 'Postpaid Plans'}
              {activeTab === 'stv' && 'Special Tariff Vouchers'}
            </h2>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-blue-900 font-medium"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'} 
              {showFilters ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
            </button>
          </div>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Prices</option>
                      <option value="low">Up to ₹300</option>
                      <option value="medium">₹301-₹1000</option>
                      <option value="high">₹1001+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Validity</label>
                    <select
                      value={validityRange}
                      onChange={(e) => setValidityRange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Durations</option>
                      <option value="short">Up to 30 days</option>
                      <option value="medium">31-90 days</option>
                      <option value="long">91+ days</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Plan Cards */}
        <div className="mb-16">
          <div className="relative">
            {filteredPlans.length > 3 && (
              <>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
                  <button 
                    onClick={() => scrollPlans('left')}
                    className="bg-white p-2 rounded-full shadow-md text-blue-900 hover:bg-blue-50"
                  >
                    <FiChevronLeft className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
                  <button 
                    onClick={() => scrollPlans('right')}
                    className="bg-white p-2 rounded-full shadow-md text-blue-900 hover:bg-blue-50"
                  >
                    <FiChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </>
            )}
            
            <div 
              ref={planContainerRef}
              className="flex overflow-x-auto scrollbar-hide space-x-6 py-4 px-2"
              style={{ scrollbarWidth: 'none' }}
            >
              {filteredPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -5 }}
                  className="flex-shrink-0 w-80"
                >
                  <div className={`bg-white rounded-xl shadow-md overflow-hidden h-full ${plan.popular ? 'border-2 border-orange-500' : 'border border-gray-200'}`}>
                    {plan.popular && (
                      <div className="bg-orange-500 text-white text-sm font-bold py-1 px-4 text-center">
                        MOST POPULAR
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-blue-900">{plan.name}</h3>
                        {plan.popular && <FiStar className="text-yellow-400 w-5 h-5" />}
                      </div>
                      
                      {/* Updated Price and Validity Section */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-3xl font-bold text-blue-900">{plan.price}</span>
                          {plan.category !== 'postpaid' && (
                            <span className="text-gray-500 ml-1">/{plan.validity.toLowerCase().includes('day') ? 'validity' : ''}</span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-1">
                            {plan.validity}
                            {plan.category === 'postpaid' && (
                              <span className="ml-1 text-xs">
                                {plan.name.includes('525')}
                                {plan.name.includes('798')}
                                {plan.name.includes('999')}
                                {!['525','798','999'].some(n => plan.name.includes(n))}
                                </span>
                              )}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {calculateCostPerDay(plan.price, plan.validity, plan.category, plan.name)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-blue-600 font-medium italic mb-4">&quot;{plan.highlights}&quot;</p>
                      </div>
                      
                      <div className="mb-6">
                        {/* Validity as first feature */}
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Validity</span>
                          <span className="font-medium">{plan.validity}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Cost Per Day</span>
                          <span className="font-medium">
                            {calculateCostPerDay(plan.price, plan.validity, plan.category, plan.name)}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Voice</span>
                          <span className="font-medium text-right max-w-[180px]">{plan.benefits.voice}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">SMS</span>
                          <span className="font-medium">{plan.benefits.sms}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Data</span>
                          <span className="font-medium">{plan.benefits.data}</span>
                        </div>
                        {plan.benefits.additional && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Additional&nbsp;&nbsp;</span>
                            <span className="font-medium text-sm">{plan.benefits.additional}</span>
                          </div>
                        )}
                        {plan.benefits.family && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Family&nbsp;&nbsp;</span>
                            <span className="font-medium text-sm">{plan.benefits.family}</span>
                          </div>
                        )}
                        {plan.benefits.countries && (
                          <div className="flex justify-between py-2">
                            <span className="text-gray-600">Countries</span>
                            <span className="font-medium text-sm">{plan.benefits.countries}</span>
                          </div>
                        )}
                      </div>
                      
                      <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors shadow-md">
                        {activeTab === 'postpaid' ? 'Subscribe Now' : 'Recharge Now'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        {filteredPlans.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Plan Comparison</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-900 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Plan Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Validity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cost/Day</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Voice</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="font-medium text-blue-900">{plan.name}</span>
                            {plan.popular && (
                              <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">Popular</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{plan.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{plan.validity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {calculateCostPerDay(plan.price, plan.validity, plan.category, plan.name)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 max-w-xs">
                          <div className="text-sm">{plan.benefits.voice}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          <div className="text-sm">{plan.benefits.data}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-orange-600 hover:text-orange-800 font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span className="font-medium text-blue-900">{faq.question}</span>
                  {activeFaq === index ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-gray-50 text-gray-700">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="mt-12 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Important Notes</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            {mobilePlansData.disclaimers.map((disclaimer, index) => (
              <li key={index}>{disclaimer}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobilePlansPage;