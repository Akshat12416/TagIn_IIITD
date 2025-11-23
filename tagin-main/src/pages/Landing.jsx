import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import SubscriptionPlans from './SubscriptionPlans';
import Footer from '../components/Footer';
import Mission from '../components/Mission';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white bg-[linear-gradient(90deg,#f3f4f6_1px,transparent_1px),linear-gradient(180deg,#f3f4f6_1px,transparent_1px)] bg-[length:40px_40px] bg-fixed">
      
      {/* Topbar */}
      <div className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex items-center h-16 px-8">
          <div className="text-2xl font-extrabold tracking-wide text-[x/]">
            TAG<span className="text-[#1F2937]">.</span>IN
          </div>
          <div className="flex-1" />
          <Link 
            to="/login" 
            className="px-6 py-2 rounded-full font-bold text-white bg-gray-800 shadow hover:brightness-110 hover:-translate-y-0.5 transform transition"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center py-28">
        <div className="max-w-4xl mx-auto px-8">
          <div className="inline-block px-5 py-2 mb-6 rounded-full border-2 border-[#6aa9ff] bg-[#eaf3ff] font-bold">
            TAG-IN NFC Anti-Counterfeit
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1F2937] leading-tight mb-6">
            Authenticate any{''}
            <RotatingTextWithBorder 
              texts={["Sneakers", "Handbag", "Watch"]} 
              rotationInterval={2500} 
            />{' '}
            with just a Tap.
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Embed an NFC chip, link it to tamper-proof blockchain records, and give buyers instant trust from their phone—no app required.
          </p>

          <div className="flex justify-center gap-5">
            <Link 
              to="/login" 
              className="px-8 py-3 rounded-full font-bold text-white bg-gray-800 shadow hover:brightness-110 hover:-translate-y-0.5 transform transition"
            >
              Get Started
            </Link>
            <a 
              href="#how" 
              className="px-8 py-3 rounded-full font-bold text-[#1F2937] border-2 border-gray-800 bg-transparent hover:bg-[#eaf3ff] transition"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-8">
          {features.map((f, i) => (
            <div 
              key={i}
              className="bg-gradient-to-b from-white to-[#f0f4fa] border border-[#e3eaf5] rounded-2xl shadow-md p-8 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="font-bold text-lg text-[#1F2937] mb-3">
                {f.title}
              </div>
              <div className="text-[#7a8ca5] leading-relaxed">
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto p-6 md:py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <a href="/" className="flex items-center space-x-3">
            
            <span className="text-xl font-semibold text-[#1F2937]">TAG.IN</span>
          </a>
          <ul className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500">
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Licensing</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <div className="border-t border-gray-200 text-center text-sm text-gray-500 py-4">
          © 2023 TAG.IN. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
