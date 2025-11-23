import { useState } from "react";
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import Landing from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Registerproduct from "./pages/Registerproduct";
import TransferOwnership from "./pages/TransferOwnership";
import { MdFactory } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics"; 

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  const navItems = [
    { name: "Register Product", path: "/Registerproduct" },
    { name: "Dashboard", path: "/Dashboard" },
    { name: "Transfer Ownership", path: "/transfer" },
    { name: "Reports", path: "/reports" },
    { name: "Analytics", path: "/analytics" }, 
  ];

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
              setUserAddress={setUserAddress}
            />
          }
        />

        {/* Protected routes (require login) */}
        {isLoggedIn ? (
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-[#f6f8fc]">
                {/* Navbar */}
                <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                  <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <div className="flex items-center justify-between h-16 py-10">
                      {/* Logo section */}
                      <div className="flex items-center gap-3">
                        <MdFactory size={32} className="text-black" />
                        <h1 className="text-2xl font-extrabold tracking-wide text-black">
                          Manufacturer
                        </h1>
                      </div>

                      {/* Desktop Navigation links */}
                      <div className="hidden md:flex items-center gap-3">
                        <ul className="flex items-center gap-2">
                          {navItems.map((item, index) => (
                            <li key={index}>
                              <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                  `block px-5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                                    isActive
                                      ? "bg-black text-white shadow-xl"
                                      : "text-black hover:bg-gray-50"
                                  }`
                                }
                              >
                                {item.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>

                        {/* User Address Display (Desktop) */}
                        {userAddress && (
                          <div className="ml-2">
                            <div className="px-6 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono text-black transition-all">
                              {userAddress.slice(0, 6)}...
                              {userAddress.slice(-4)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mobile menu button */}
                      <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-black p-2 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                      </button>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {mobileMenuOpen && (
                      <div className="md:hidden py-4 border-t border-gray-100">
                        <ul className="space-y-2">
                          {navItems.map((item, index) => (
                            <li key={index}>
                              <NavLink
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                  `block px-6 py-3 rounded-2xl text-base font-medium transition-all ${
                                    isActive
                                      ? "bg-black text-white shadow-xl"
                                      : "text-black hover:bg-gray-50"
                                  }`
                                }
                              >
                                {item.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>

                        {/* User Address Display (Mobile) */}
                        {userAddress && (
                          <div className="mt-4 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-mono text-black text-center">
                            {userAddress.slice(0, 10)}...
                            {userAddress.slice(-8)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </nav>

                {/* Main Content */}
                <div className="min-h-[calc(100vh-5rem)]">
                  <Routes>
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route
                      path="/Registerproduct"
                      element={<Registerproduct />}
                    />
                    <Route path="/transfer" element={<TransferOwnership />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/analytics" element={<Analytics />} />{" "}
                    {/* 👈 NEW */}
                    <Route path="*" element={<Navigate to="/Dashboard" />} />
                  </Routes>
                </div>
              </div>
            }
          />
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
