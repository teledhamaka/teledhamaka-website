import React from 'react';
import { FiWifi, FiCalendar, FiDollarSign, FiTv, FiFilm, FiStar, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface FeatureWidgetProps {
  variant?: 'default' | 'compact';
  className?: string;
}

const FeatureWidget: React.FC<FeatureWidgetProps> = ({ variant = 'default', className = '' }) => {
  // Payment duration features from the doc
  const paymentFeatures = [
    {
      title: "6 Months FMC",
      description: "180 Days + 19 days = 199 Days",
      icon: <FiCalendar className="text-blue-600" />
    },
    {
      title: "12 Months FMC",
      description: "13 Months Service",
      icon: <FiCalendar className="text-blue-600" />
    },
    {
      title: "24 Months FMC",
      description: "27 Months Service",
      icon: <FiCalendar className="text-blue-600" />
    },
    {
      title: "36 Months FMC",
      description: "40 Months Service",
      icon: <FiCalendar className="text-blue-600" />
    }
  ];

  // OTT features from the doc
  const ottFeatures = [
    {
      title: "Rs.49/- p.m.",
      content: ["Hungama Combo", "Lionsgate", "ShemarooMe", "EPIC ON"],
      icon: <FiFilm className="text-purple-600" />
    },
    {
      title: "Rs.199/- p.m.",
      content: ["Disney+Hotstar Super Plan", "Sony LIV Premium", "Zee5 Premium", "Yupp TV Live"],
      icon: <FiTv className="text-red-600" />
    },
    {
      title: "Rs.249/- p.m.",
      content: ["Disney+Hotstar Super Plan", "Hungama Music & Play SVDO", "Lions Gate", "Sony LIV Premium", "Zee5 Premium"],
      icon: <FiStar className="text-yellow-600" />
    }
  ];

  // General features
  const generalFeatures = [
    "199 days service @ charges of 180 days",
    "Local + STD Free calling on all networks",
    "Available across PAN India",
    "Works with Copper/FTTH/AirFibre",
    "Free installation for most plans",
    "GST extra"
  ];

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg ${className}`}>
        <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
          <FiWifi className="mr-2" /> BSNL Broadband Key Features
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Payment Benefits</h4>
            <ul className="space-y-2">
              {paymentFeatures.slice(0, 2).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 mt-1">{feature.icon}</span>
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Included Features</h4>
            <ul className="space-y-2">
              {generalFeatures.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <FiCheck className="text-green-500 mr-2 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center">
          <FiWifi className="mr-3" /> BSNL Broadband Premium Features
        </h2>
        <p className="mt-2 text-blue-100">Get more value with every plan</p>
      </div>
      
      <div className="p-6">
        {/* Payment Duration Benefits */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <FiDollarSign className="mr-2" /> Advance Payment Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-blue-50 rounded-lg p-4 border border-blue-100"
              >
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-blue-800">{feature.title}</h4>
                </div>
                <p className="text-gray-700 pl-11">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* OTT Packages */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <FiTv className="mr-2" /> BSNL Cinema Plus OTT Add-ons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ottFeatures.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`rounded-lg p-5 shadow-md ${
                  index === 0 ? 'bg-purple-50 border border-purple-100' :
                  index === 1 ? 'bg-red-50 border border-red-100' :
                  'bg-yellow-50 border border-yellow-100'
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-full mr-3 ${
                    index === 0 ? 'bg-purple-100' :
                    index === 1 ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-lg">
                    {feature.title} <span className="text-sm font-normal">(excl. GST)</span>
                  </h4>
                </div>
                <ul className="space-y-2">
                  {feature.content.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <FiCheck className={`mt-1 mr-2 ${
                        index === 0 ? 'text-purple-600' :
                        index === 1 ? 'text-red-600' :
                        'text-yellow-600'
                      }`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Note: Advance payment option is not available in Super Star Premium Plus (Rs.999) Bharat Fibre Plan
          </p>
        </div>
        
        {/* General Features */}
        <div>
          <h3 className="text-xl font-bold text-blue-900 mb-4">All Plans Include</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 5 }}
                className="flex items-start p-3 bg-gray-50 rounded-lg"
              >
                <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer CTA */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-3 md:mb-0">
            <p className="font-medium text-gray-700">Ready to experience premium broadband?</p>
            <p className="text-sm text-gray-500">For online booking visit: bookmyFibre.bsnl.co.in</p>
          </div>
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-md">
            Browse Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureWidget;