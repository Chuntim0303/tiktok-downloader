import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';

// Placeholder pages
const HowItWorks = () => (
  <div className="max-w-4xl mx-auto py-20 text-center">
    <h2 className="text-3xl font-bold mb-4 text-white">How It Works</h2>
    <p className="text-gray-400">Step-by-step guide coming soon...</p>
  </div>
);

const FAQ = () => (
  <div className="max-w-4xl mx-auto py-20 text-center">
    <h2 className="text-3xl font-bold mb-4 text-white">FAQ</h2>
    <p className="text-gray-400">Frequently asked questions will be added here.</p>
  </div>
);

const HelpCenter = () => (
  <div className="max-w-4xl mx-auto py-20 text-center">
    <h2 className="text-3xl font-bold mb-4 text-white">Help Center</h2>
    <p className="text-gray-400">Need help? Resources will be added here.</p>
  </div>
);

const Contact = () => (
  <div className="max-w-4xl mx-auto py-20 text-center">
    <h2 className="text-3xl font-bold mb-4 text-white">Contact Us</h2>
    <p className="text-gray-400">You can reach us at support@downloadanywhere.site</p>
  </div>
);

const Terms = () => (
  <div className="max-w-4xl mx-auto py-20 text-center">
    <h2 className="text-3xl font-bold mb-4 text-white">Terms of Use</h2>
    <p className="text-gray-400">Our terms of use will be published here.</p>
  </div>
);

const Privacy = () => (
  <div className="max-w-4xl mx-auto py-20 text-center">
    <h2 className="text-3xl font-bold mb-4 text-white">Privacy Policy</h2>
    <p className="text-gray-400">Our privacy policy will be published here.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Header */}
        <header className="bg-gray-900/90 backdrop-blur-md shadow-2xl border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                {/* Logo Image - Replace gradient div with actual logo */}
                <img 
                  src="/logo.png" 
                  alt="Download Anywhere Logo" 
                  className="h-10 w-auto rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback gradient icon (hidden by default, shown if logo.png fails to load) */}
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg items-center justify-center hidden">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4V10.5L15.5 9L17 10.5L12 15.5L7 10.5L8.5 9L10 10.5V4C10 2.9 10.9 2 12 2ZM6 20C4.9 20 4 19.1 4 18V14C4 12.9 4.9 12 6 12H8V14H6V18H18V14H16V12H18C19.1 12 20 12.9 20 14V18C20 19.1 19.1 20 18 20H6Z"/>
                  </svg>
                </div>
                
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Download Anywhere
                  </h1>
                  <span className="text-xs text-gray-400 font-medium">
                    TikTok Downloader
                  </span>
                </div>
              </Link>
              
              <nav className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-300 hover:text-pink-400 transition-colors font-medium">Home</Link>
                <Link to="/how-it-works" className="text-gray-300 hover:text-pink-400 transition-colors font-medium">How it Works</Link>
                <Link to="/faq" className="text-gray-300 hover:text-pink-400 transition-colors font-medium">FAQ</Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900/50 backdrop-blur-md border-t border-gray-700/50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  {/* Footer Logo */}
                  <img 
                    src="/logo.png" 
                    alt="Download Anywhere Logo" 
                    className="h-8 w-auto rounded-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback gradient icon */}
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg items-center justify-center hidden">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4V10.5L15.5 9L17 10.5L12 15.5L7 10.5L8.5 9L10 10.5V4C10 2.9 10.9 2 12 2ZM6 20C4.9 20 4 19.1 4 18V14C4 12.9 4.9 12 6 12H8V14H6V18H18V14H16V12H18C19.1 12 20 12.9 20 14V18C20 19.1 19.1 20 18 20H6Z"/>
                    </svg>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-white">Download Anywhere</h2>
                    <p className="text-sm text-gray-400">TikTok Video Downloader</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-4 max-w-md">
                  Download TikTok videos quickly and easily. Always respect content creators' rights and use downloaded content responsibly.
                </p>
                <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-amber-300 text-sm">
                    <strong>Important:</strong> Only download content you have permission to use. Respect copyright and creator rights.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4">Features</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Fast downloads</li>
                  <li>• High quality videos</li>
                  <li>• No watermark option</li>
                  <li>• Mobile friendly</li>
                  <li>• No registration required</li>
                  <li>• Completely free</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/help" className="hover:text-pink-400 transition-colors">Help Center</Link></li>
                  <li><Link to="/contact" className="hover:text-pink-400 transition-colors">Contact Us</Link></li>
                  <li><Link to="/terms" className="hover:text-pink-400 transition-colors">Terms of Use</Link></li>
                  <li><Link to="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</Link></li>
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500">
                    <strong>Email:</strong> support@downloadanywhere.site
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2025 Download Anywhere. All rights reserved. Not affiliated with TikTok.</p>
              <p className="mt-1 text-xs">
                <span className="font-medium text-gray-300">downloadanywhere.site</span> - Free TikTok Video Downloader
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;