import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  variant?: 'dashboard' | 'public';
  propertyId?: string;
}

const Navbar: React.FC<NavbarProps> = ({ variant = 'dashboard', propertyId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = variant === 'dashboard';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏠</span>
              <span className="text-xl font-bold text-gray-900">the flex.</span>
            </div>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 ml-8">
              {isDashboard ? (
                <>
                  <button
                    onClick={() => navigate('/')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </button>
                </>
              ) : (
                <>
                  <div className="relative group">
                    <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center">
                      Landlords <span className="ml-1">▼</span>
                    </button>
                  </div>
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    About Us
                  </button>
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    Careers
                  </button>
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    Contact
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {isDashboard ? (
              <>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">English</span>
                  <span className="text-sm">🇬🇧</span>
                </div>
                <div className="text-sm text-gray-600">£ GBP</div>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Admin Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 