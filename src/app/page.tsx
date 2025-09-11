"use client";

import { MapPin, Home as HomeIcon, Phone, Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { AutocompleteSearch } from "@/components/autocomplete-search";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo, Navigation and Search Bar */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              <span className="hidden lg:block text-lg lg:text-2xl font-bold text-gray-800">
                RealEstate Pro
              </span>
            </div>

            {/* Flexible space that pushes search towards the right */}
            <div className="flex-1 flex justify-end items-center">
              <div className="flex items-center gap-6">
                {/* Search Bar - left-aligned in this space */}
                <div className="min-w-[500px]">
                  <AutocompleteSearch />
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex space-x-8">
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Buy
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Sell
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Rent
                  </a>
                  <a href="/storybook-static/index.html?path=/docs/tutorials-map-search-with-property-clustering-using-mapbox-and-repliers-api--docs" 
                     className="text-gray-600 hover:text-blue-600" 
                     target="_blank"
                     rel="noopener noreferrer">
                    Map Search
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Agents
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Contact
                  </a>
                </nav>
              </div>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 py-2 px-4 hover:bg-gray-50 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Buy
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 py-2 px-4 hover:bg-gray-50 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sell
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 py-2 px-4 hover:bg-gray-50 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Rent
                </a>
                <a
                  href="/storybook-static/index.html?path=/docs/tutorials-map-search-with-property-clustering-using-mapbox-and-repliers-api--docs"
                  className="text-gray-600 hover:text-blue-600 py-2 px-4 hover:bg-gray-50 rounded"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Map Search
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 py-2 px-4 hover:bg-gray-50 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Agents
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 py-2 px-4 hover:bg-gray-50 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        {/* Hero Image Background */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMCAwSDEyMDBWNjAwSDBWMFoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcikiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDE9IjAiIHkxPSIwIiB4Mj0iMTIwMCIgeTI9IjYwMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMjU2M0VCIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzFENEVEOCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=')",
          }}
        ></div>

        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6">
              Find Your Dream Home
            </h1>
            <p className="text-lg lg:text-xl xl:text-2xl mb-6 lg:mb-8 text-blue-100">
              Discover the perfect property in your ideal neighborhood
            </p>
            <div className="max-w-2xl mx-auto text-sm lg:text-lg text-blue-100 leading-relaxed">
              <p className="mb-3 lg:mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 lg:py-12">
        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 lg:gap-4 items-center">
            <select className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-sm">
              <option>Price Range</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-sm">
              <option>Property Type</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-sm">
              <option>Bedrooms</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-sm">
              <option>Bathrooms</option>
            </select>
            <button className="col-span-2 lg:col-span-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm lg:text-base">
              Search
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
            Properties for Sale
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-gray-600 text-sm">
              Showing 1-12 of 150 results
            </span>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option>Sort by: Price (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image placeholder */}
              <div className="bg-gray-200 h-48 animate-pulse relative">
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                  NEW
                </div>
              </div>

              {/* Property details */}
              <div className="p-4">
                {/* Price */}
                <div className="h-6 bg-gray-200 rounded-md mb-2 animate-pulse w-24"></div>

                {/* Address */}
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  <div className="h-4 bg-gray-200 rounded-md animate-pulse flex-1"></div>
                </div>

                {/* Property specs */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded-md animate-pulse w-12"></div>
                    <div className="h-4 bg-gray-200 rounded-md animate-pulse w-12"></div>
                    <div className="h-4 bg-gray-200 rounded-md animate-pulse w-16"></div>
                  </div>
                </div>

                {/* Agent info */}
                <div className="border-t pt-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded-md animate-pulse w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded-md animate-pulse w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <HomeIcon className="h-6 w-6" />
                <span className="text-xl font-bold">RealEstate Pro</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner in finding the perfect home.
              </p>
              <div className="flex space-x-4">
                <Phone className="h-5 w-5 text-gray-400" />
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Buy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Sell
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Rent
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Agents
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Market Reports
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Neighborhood Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Mortgage Calculator
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <div className="text-gray-400 space-y-2">
                <p>123 Main Street</p>
                <p>Toronto, ON M5V 3A8</p>
                <p>Phone: (416) 555-0123</p>
                <p>Email: info@realestatepro.com</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
