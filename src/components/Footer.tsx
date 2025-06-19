// src/components/Footer.tsx
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { name: 'Facebook', url: '#', icon: <FaFacebookF /> }, // Using FaFacebookF for a solid icon
    { name: 'X', url: '#', icon: <FaXTwitter /> }, // Using FaXTwitter for the new X logo
    { name: 'Instagram', url: '#', icon: <FaInstagram /> },
    { name: 'YouTube', url: '#', icon: <FaYoutube /> },
    { name: 'LinkedIn', url: '#', icon: <FaLinkedinIn /> } // Using FaLinkedinIn for a solid icon
  ];

  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4">
        {/* Social Media Links */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-6">
            {socialLinks.map((social, index) => (
              <Link 
                key={index}
                href={social.url}
                className="text-2xl hover:text-white transition-colors duration-300 transform hover:scale-110"
                aria-label={social.name}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {currentYear} Tele Dhamaka. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/privacy-policy" 
              className="text-sm hover:text-white transition-colors hover:underline"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms-of-service" 
              className="text-sm hover:text-white transition-colors hover:underline"
            >
              Terms of Service
            </Link>
            <Link 
              href="/contact" 
              className="text-sm hover:text-white transition-colors hover:underline"
            >
              Contact Us
            </Link>
            <Link 
              href="/faq" 
              className="text-sm hover:text-white transition-colors hover:underline"
            >
              FAQ
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>BSNL is a trademark of Bharat Sanchar Nigam Limited. Tele Dhamaka is an independent information portal.</p>
          <p className="mt-2">Not affiliated with BSNL or Government of India.</p>
        </div>
      </div>
    </footer>
  );
}