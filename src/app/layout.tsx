// src/app/layout.tsx
import { Metadata } from 'next';
import { inter } from '@/fonts'; // Import the font config
import '@/styles/globals.css'; // Import global styles (includes Tailwind)
import Header from '@/components/Header';
import Footer from '@/components/Footer';


// --- Metadata (Update with your actual details) ---
export const metadata: Metadata = {
  title: 'Tele Dhamaka - Your BSNL Service Hub', // Replace Sancharika if you chose another name
  description: 'Check BSNL plans, test your internet speed, read the latest news, and get support. Your one-stop BSNL companion.',
  metadataBase: new URL('https://teledhamaka.com'), // Add this
  icons: {
    icon: '/favicon.ico',
  },  
  // Add more metadata as needed: icons, open graph, etc.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        
        {/* <Navbar /> */}
        
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          {children} {/* Page content will be rendered here */}
        </main>
        <Footer />
      </body>
    </html>
  );
}