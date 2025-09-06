import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';

// Placeholder pages
const HowItWorks = () => (
  <div className="max-w-4xl mx-auto py-20 text-center">
    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
    <p className="text-gray-600">Step-by-step guide coming soon...</p>
  </div>
);

const FAQ = () => (
  <div className="max-w-4xl mx-auto py-20 text-center">
    <h2 className="text-3xl font-bold mb-4">FAQ</h2>
    <p className="text-gray-600">Frequently asked questions will be added here.</p>
  </div>
);

const HelpCenter = () => (
  <div className="max-w-4xl mx-auto py-20 text-center">
    <h2 className="text-3xl font-bold mb-4">Help Center</h2>
    <p className="text-gray-600">Need help? Resources will be added here.</p>
  </div>
);

const Contact = () => (
  <div className="max-w-4xl mx-auto py-20 text-center">
    <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
    <p className="text-gray-600">You can reach us at support@example.com</p>
  </div>
);

const Terms = () => (
  <div className="max-w-4xl mx-auto py-20 text-center">
    <h2 className="text-3xl font-bold mb-4">Terms of Use</h2>
    <p className="text-gray-600">Our terms of use will be published here.</p>
  </div>
);

const Privacy = () => (
  <div className="max-w-4xl mx-auto py-20 text-center">
    <h2 className="text-3xl font-bold mb-4">Privacy Policy</h2>
    <p className="text-gray-600">Our privacy policy will be published here.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-2.08v5.58a3.06 3.06 0 01-6.12 0V2H5.54v5.58a4.83 4.83 0 01-3.77 4.25A4.83 4.83 0 015.54 11v5.58a4.83 4.83 0 013.77 4.25A4.83 4.83 0 0113.08 16.58V11a4.83 4.83 0 013.77-4.25A4.83 4.83 0 0119.59 6.69z"/>
                  </svg>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  TikTok Downloader
                </h1>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">Home</Link>
                <Link to="/how-it-works" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">How it Works</Link>
                <Link to="/faq" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">FAQ</Link>
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
        <footer className="bg-gray-50 border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-2.08v5.58a3.06 3.06 0 01-6.12 0V2H5.54v5.58a4.83 4.83 0 01-3.77 4.25A4.83 4.83 0 015.54 11v5.58a4.83 4.83 0 013.77 4.25A4.83 4.83 0 0113.08 16.58V11a4.83 4.83 0 013.77-4.25A4.83 4.83 0 0119.59 6.69z"/>
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">TikTok Downloader</h2>
                </div>
                <p className="text-gray-600 mb-4 max-w-md">
                  Download TikTok videos quickly and easily. Always respect content creators' rights and use downloaded content responsibly.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Important:</strong> Only download content you have permission to use. Respect copyright and creator rights.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Fast downloads</li>
                  <li>• High quality videos</li>
                  <li>• No watermark option</li>
                  <li>• Mobile friendly</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link to="/help" className="hover:text-pink-600">Help Center</Link></li>
                  <li><Link to="/contact" className="hover:text-pink-600">Contact Us</Link></li>
                  <li><Link to="/terms" className="hover:text-pink-600">Terms of Use</Link></li>
                  <li><Link to="/privacy" className="hover:text-pink-600">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
              <p>&copy; 2025 TikTok Downloader. All rights reserved. Not affiliated with TikTok.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
