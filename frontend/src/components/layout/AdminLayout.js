import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import Logo from '../common/Logo';
import {
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  ServerIcon,
  SignalIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <ChartBarIcon className="h-6 w-6" /> },
    { name: 'Users', path: '/admin/users', icon: <UsersIcon className="h-6 w-6" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBagIcon className="h-6 w-6" /> },
    { name: 'Services', path: '/admin/services', icon: <ServerIcon className="h-6 w-6" /> },
    { name: 'API Keys', path: '/admin/api-keys', icon: <ServerIcon className="h-6 w-6" /> },
    { name: 'API Logs', path: '/admin/api-logs', icon: <SignalIcon className="h-6 w-6" /> },
  ];

  // Check if the current path is active
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden min-h-screen w-64 flex-col bg-gray-800 shadow-md lg:flex">
        <div className="flex h-16 items-center justify-center border-b border-gray-700">          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Logo variant="light" />
              <span className="ml-2 text-white font-medium">Admin</span>
            </div>
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
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3 text-gray-400">{link.icon}</span>
                {link.name}
              </Link>
            ))}
            
            {/* User Panel Link */}
            <Link
              to="/dashboard"
              className="flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <HomeIcon className="mr-3 h-6 w-6 text-gray-400" />
              User Dashboard
            </Link>
          </nav>
          <div className="px-4">
            <button
              onClick={logout}
              className="flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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
        <div className="fixed inset-y-0 left-0 w-64 transform bg-gray-800 p-4 transition duration-300 ease-in-out"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Logo variant="light" />
              <span className="ml-2 text-white font-medium">Admin</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-5 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActivePath(link.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3 text-gray-400">{link.icon}</span>
                {link.name}
              </Link>
            ))}
            
            {/* User Panel Link */}
            <Link
              to="/dashboard"
              className="flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HomeIcon className="mr-3 h-6 w-6 text-gray-400" />
              User Dashboard
            </Link>
          </nav>
          <div className="absolute bottom-0 left-0 mb-4 w-full px-4">
            <button
              onClick={logout}
              className="flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-gray-800 px-4 shadow lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <Logo variant="light" />
            <span className="ml-2 text-white font-medium">Admin</span>
          </div>
          <div className="w-6"></div> {/* Empty div for spacing */}
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
