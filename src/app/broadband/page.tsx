// app/broadband/page.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiCheck, FiTv, FiFilm, FiStar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SpeedTestWidget from '@/components/speed_test_widget';
import FeatureWidget from '@/components/FeatureWidget';

// Interface for an individual plan within a category
interface IndividualPlanJson {
  plan_name?: string;
  fmc?: string;
  marketing_text?: string;
  download_speed?: string;
  first_month_offer?: string;
  monthly_discount_after_1st_month?: string;
  free_calling?: string;
  free_ott?: string;
  bandwidth?: string;
  bandwidth_for_wifi_customers?: string;
  bandwidth_for_bsnl_pdo_usage?: string;
  free_calls?: string;
  features?: string[];
  remark?: string;
  validity?: string;
  [key: string]: string | string[] | undefined;
}

// Interface for each plan category
interface BSNLPlanCategoryJson {
  plan_type: string;
  applicability?: string;
  validity_period?: string;
  note?: string;
  note_offer?: string;
  plans?: IndividualPlanJson[];
  [key: string]: string | string[] | IndividualPlanJson[] | undefined;
}

// Import the raw JSON data
import bsnlPlansDataRaw from './bsnl_plans.json';

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

// Interface for processed plans used in the component
interface Plan {
  id: number;
  name: string;
  speed: string;
  data: string;
  price: number;
  popular: boolean;
  features: string[];
  ott: boolean;
  tv: boolean;
  marketingText?: string;
  category: string;
  isComplete: boolean;
}

const BroadbandPlansPage = () => {
  // Filter states
  const [speedRange, setSpeedRange] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [dataType, setDataType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const planContainerRef = useRef<HTMLDivElement>(null);

  // Process JSON data into component-compatible format
  useEffect(() => {
    const processPlans = () => {
      const processedPlans: Plan[] = [];
      let idCounter = 1;

      const hasOtt = (plan: IndividualPlanJson): boolean => {
        const ottContent = plan.free_ott;
        if (!ottContent) return false;
        
        if (typeof ottContent === 'string') {
          return ottContent.toLowerCase().includes("hotstar") || 
                 ottContent.toLowerCase().includes("sony liv") || 
                 ottContent.toLowerCase().includes("zee5") ||
                 ottContent.toLowerCase().includes("ott");
        }
        return false;
      };

      const hasTv = (plan: IndividualPlanJson): boolean => {
        const ottContent = plan.free_ott;
        if (!ottContent) return false;
        
        if (typeof ottContent === 'string') {
          return ottContent.toLowerCase().includes("live tv") || 
                 ottContent.toLowerCase().includes("yupptv");
        }
        return false;
      };

      const extractSpeed = (speedStr?: string): string => {
        if (!speedStr) return "N/A";
        const match = speedStr.match(/Up to (\d+ Mbps)/i);
        return match ? match[1] : speedStr.split(' ')[0] + " Mbps";
      };

      const extractData = (dataStr?: string): string => {
        if (!dataStr) return "Unlimited";
        if (dataStr.includes("beyond")) return dataStr;
        if (dataStr.includes("GB")) return dataStr.split(' ')[0] + " GB";
        return dataStr;
      };

      const extractPrice = (priceStr?: string): number => {
        if (!priceStr) return 0;
        const match = priceStr.match(/Rs?\.?\s*(\d+)/i);
        return match ? parseInt(match[1]) : 0;
      };

      (bsnlPlansDataRaw as BSNLPlanCategoryJson[]).forEach((category) => {
        if (!category.plans) return;

        category.plans.forEach((plan) => {
          // Skip incomplete plans
          if (!plan.plan_name || !plan.fmc || !plan.download_speed) {
            return;
          }

          const features: string[] = [];
          
          // Add calling features
          if (plan.free_calling || plan.free_calls) {
            features.push("Unlimited Local/STD Calls");
          }

          // Add first month offer if available
          if (plan.first_month_offer?.includes("Free service")) {
            features.push("1st Month FREE");
          }

          // Add other features from the plan
          if (plan.features) {
            features.push(...plan.features.filter(f => !f.includes("Unlimited Calls")));
          }

          // Add installation info
          if (category.plan_type.includes("Fibre") || category.plan_type.includes("Air Fibre")) {
            features.push("Free Installation");
          }

          // Special handling for Fibre Entry Quarterly and Half Yearly plans
          if (plan.plan_name === "Fibre Entry Quarterly") {
            features.push("Only for Rural New Customers");
          } else if (plan.plan_name === "Fibre Entry Half Yearly") {
            features.push("Only for Individual Rural Customers");
          }

          // Determine if popular (simple heuristic)
          const isPopular = plan.plan_name?.includes("Basic") || 
                           plan.plan_name?.includes("Premium") || 
                           plan.plan_name?.includes("Plus");

          const speed = extractSpeed(plan.download_speed || plan.bandwidth);
          const data = extractData(plan.download_speed?.split(' till ')[1] || plan.bandwidth);
          const price = extractPrice(plan.fmc);

          // Check if the plan is complete
          const isComplete = !!plan.plan_name && !!plan.fmc && !!plan.download_speed && 
                            speed !== "N/A" && data !== "Unlimited" && price > 0;

          if (isComplete) {
            processedPlans.push({
              id: idCounter++,
              name: plan.plan_name,
              speed,
              data,
              price,
              popular: isPopular || false,
              features,
              ott: hasOtt(plan),
              tv: hasTv(plan),
              marketingText: plan.marketing_text,
              category: category.plan_type,
              isComplete
            });
          }
        });
      });

      setPlans(processedPlans);
    };

    processPlans();
  }, []);

  const scrollPlans = (direction: 'left' | 'right') => {
    if (planContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      planContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filtered plans - only show complete plans
  const filteredPlans = plans
    .filter(plan => plan.isComplete)
    .filter(plan => {
      const getNumericSpeed = (speedStr: string): number => {
        const match = speedStr.match(/(\d+)\s*Mbps/i);
        return match ? parseInt(match[1]) : 0;
      };

      const planSpeed = getNumericSpeed(plan.speed);
      const isUnlimitedData = plan.data.toLowerCase().includes("unlimited") || 
                            plan.data.toLowerCase().includes("beyond");

      const speedMatch = speedRange === 'all' ||
        (speedRange === 'low' && planSpeed <= 100) ||
        (speedRange === 'medium' && planSpeed > 100 && planSpeed <= 300) ||
        (speedRange === 'high' && planSpeed > 300);

      const priceMatch = priceRange === 'all' ||
        (priceRange === 'low' && plan.price <= 500) ||
        (priceRange === 'medium' && plan.price > 500 && plan.price <= 1000) ||
        (priceRange === 'high' && plan.price > 1000);

      const dataMatch = dataType === 'all' ||
        (dataType === 'unlimited' && isUnlimitedData) ||
        (dataType === 'limited' && !isUnlimitedData);

      return speedMatch && priceMatch && dataMatch;
    });

  // FAQ data
  const faqs = [
    {
      question: "How to upgrade my existing BSNL broadband plan?",
      answer: "You can upgrade your plan through the BSNL self-care portal, by visiting your nearest BSNL office, or by calling our customer care at 1500."
    },
    {
      question: "What is the installation process for new connections?",
      answer: "After plan selection, our technician will visit your premises within 48 hours to install the connection. Installation is currently free for most plans."
    },
    {
      question: "Can I change my billing cycle to annual payment?",
      answer: "Yes, annual payment options are available with discounts. For example, pay for 12 months and get 13 months of service."
    },
    {
      question: "What is WiFi Roaming feature?",
      answer: "WiFi Roaming allows you to access BSNL WiFi hotspots across India using your broadband credentials."
    },
    {
      question: "How can I check my current usage?",
      answer: "You can check your data usage through the BSNL self-care portal or mobile app."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">BSNL Fiber Broadband Plans</h1>
          <p className="text-xl mb-8">Superfast internet with unlimited data and premium features</p>
          
          <section id="speed-tester-section" className="scroll-mt-20">
            <SpeedTestWidget />
          </section>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Filter Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-900">Find Your Perfect Plan</h2>
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
                <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Speed Range</label>
                    <select
                      value={speedRange}
                      onChange={(e) => setSpeedRange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Speeds</option>
                      <option value="low">Up to 100 Mbps</option>
                      <option value="medium">101-300 Mbps</option>
                      <option value="high">301+ Mbps</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Prices</option>
                      <option value="low">Up to ₹500</option>
                      <option value="medium">₹501-₹1000</option>
                      <option value="high">₹1001+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
                    <select
                      value={dataType}
                      onChange={(e) => setDataType(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Data Types</option>
                      <option value="unlimited">Unlimited</option>
                      <option value="limited">Limited</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Plan Cards */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Featured Plans</h2>
          <div className="relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => scrollPlans('left')}
                className="bg-white p-2 rounded-full shadow-md text-blue-900 hover:bg-blue-50"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
            </div>
            
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
                      <div className="flex items-center mb-6">
                        <span className="text-3xl font-bold text-blue-900">
                          {plan.name === "Fibre Entry Quarterly" ? "₹999/3mo" : 
                           plan.name === "Fibre Entry Half Yearly" ? "₹1999/6mo" : 
                           `₹${plan.price}`}
                        </span>
                        <span className="text-gray-500 ml-1">
                          {plan.name === "Fibre Entry Quarterly" || plan.name === "Fibre Entry Half Yearly" ? "" : "/month"}
                        </span>
                      </div>
                      <div className="mb-6">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Speed</span>
                          <span className="font-medium">{plan.speed}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Data&nbsp;&nbsp;</span>
                          <span className="font-medium">{plan.data}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Billing Options</span>
                          <span className="font-medium">
                            {(plan.name === "Fibre Entry Quarterly" || plan.name === "Fibre Entry Half Yearly") 
                              ? "Quarterly/Half Yearly Only" 
                              : "Monthly/Yearly"}
                          </span>
                        </div>
                      </div>
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Features</h4>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <FiCheck className="text-green-500 mr-2" />
                              <span className="text-gray-600">{feature}</span>
                            </li>
                          ))}
                          {plan.ott && (
                            <li className="flex items-center">
                              <FiFilm className="text-blue-500 mr-2" />
                              <span className="text-gray-600">OTT Subscription</span>
                            </li>
                          )}
                          {plan.tv && (
                            <li className="flex items-center">
                              <FiTv className="text-blue-500 mr-2" />
                              <span className="text-gray-600">Live TV Channels</span>
                            </li>
                          )}
                        </ul>
                      </div>
                      <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors shadow-md">
                        Select Plan
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => scrollPlans('right')}
                className="bg-white p-2 rounded-full shadow-md text-blue-900 hover:bg-blue-50"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Plan Comparison</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Plan Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Speed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Features</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{plan.speed}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{plan.data}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {plan.name === "Fibre Entry Quarterly" ? "₹999/3mo" : 
                         plan.name === "Fibre Entry Half Yearly" ? "₹1999/6mo" : 
                         `₹${plan.price}/mo`}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {plan.features.includes("Free Installation") && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Installation</span>
                          )}
                          {(plan.features.includes("Unlimited Local/STD Calls") || plan.features.includes("24hr Unlimited Calls")) && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Voice</span>
                          )}
                          {plan.ott && (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">OTT</span>
                          )}
                          {plan.tv && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Live TV</span>
                          )}
                          {plan.features.includes("Only for Rural New Customers") && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Rural Only</span>
                          )}
                          {plan.features.includes("Only for Individual Rural Customers") && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Rural Only</span>
                          )}
                        </div>
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
        
        <FeatureWidget className="my-8" />
        
        {/* Or use the compact version */}
        <FeatureWidget variant="compact" className="my-8" />

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
      </div>
    </div>
  );
};

export default BroadbandPlansPage;