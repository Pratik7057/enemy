import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import Logo from '../common/Logo';
import { 
  HomeIcon, 
  CreditCardIcon, 
  ShoppingBagIcon, 
  PlusIcon, 
  KeyIcon, 
  ClockIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <HomeIcon className="h-6 w-6" /> },
    { name: 'Add Balance', path: '/add-balance', icon: <CreditCardIcon className="h-6 w-6" /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingBagIcon className="h-6 w-6" /> },
    { name: 'Place Order', path: '/place-order', icon: <PlusIcon className="h-6 w-6" /> },
    { name: 'API Generator', path: '/api-generator', icon: <KeyIcon className="h-6 w-6" /> },
    { name: 'Transactions', path: '/transactions', icon: <ClockIcon className="h-6 w-6" /> },
  ];

  // Check if the current path is active
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden min-h-screen w-64 flex-col bg-white shadow-md lg:flex">
        <div className="flex h-16 items-center justify-center border-b">          <div className="flex items-center justify-between">
            <Logo />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-grow flex-col justify-between py-4">
          <nav className="space-y-1 px-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActivePath(link.path)
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-gray-500">{link.icon}</span>
                {link.name}
              </Link>
            ))}

            {/* Admin link if user is admin */}
            {user && user.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="flex items-center rounded-md bg-indigo-50 px-2 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
              >
                <UserCircleIcon className="mr-3 h-6 w-6 text-indigo-500" />
                Admin Panel
              </Link>
            )}
          </nav>
          <div className="px-4">
            <div className="mb-2 rounded-md bg-gray-50 px-4 py-3">
              <div className="text-sm font-medium text-gray-500">Balance</div>
              <div className="text-lg font-semibold text-primary-600">${user?.balance?.toFixed(2) || '0.00'}</div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center justify-center rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 lg:hidden" 
        style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div className="fixed inset-y-0 left-0 w-64 transform bg-white p-4 transition duration-300 ease-in-out"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">            <Logo />
            <div className="flex items-center space-x-2">              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <nav className="mt-5 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActivePath(link.path)
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3 text-gray-500">{link.icon}</span>
                {link.name}
              </Link>
            ))}

            {/* Admin link if user is admin */}
            {user && user.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="flex items-center rounded-md bg-indigo-50 px-2 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserCircleIcon className="mr-3 h-6 w-6 text-indigo-500" />
                Admin Panel
              </Link>
            )}
          </nav>
          <div className="absolute bottom-0 left-0 mb-4 w-full px-4">
            <div className="mb-2 rounded-md bg-gray-50 px-4 py-3">
              <div className="text-sm font-medium text-gray-500">Balance</div>
              <div className="text-lg font-semibold text-primary-600">${user?.balance?.toFixed(2) || '0.00'}</div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center justify-center rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-4 shadow lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <Logo />
          <div className="w-6"></div> {/* Empty div for spacing */}
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
