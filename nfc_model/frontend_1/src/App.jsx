import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import SneakerForm from "./pages/SneakerForm";

function App() {
  const [userAddress, setUserAddress] = useState(null);
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        backgroundImage:
          "linear-gradient(90deg, #f7f7f7 1px, transparent 1px), linear-gradient(180deg, #f7f7f7 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      {/* Decorative top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 8,
          background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
          zIndex: 20,
        }}
      />

      {/* Navigation */}
      <div className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex items-center h-16 px-8">
          <div className="text-2xl font-extrabold tracking-wide text-[#6aa9ff]">
            TAG<span className="text-[#1F2937]">.</span>in
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Link to="http://localhost:5174/" className={`px-2 py-2 font-bold text-[#1F2937] bg-transparent transition hover:scale-105 transform ${location.pathname === '/sneaker-form' ? 'border-b-2 border-blue-500' : ''}`}>
              Verify Product
            </Link>

            <Link to="/" className={`px-2 py-2 font-bold text-[#1F2937] bg-transparent transition-link hover:scale-105 transform ${location.pathname === '/' ? 'border-b-2 border-blue-500' : ''}`}>
              Resell
            </Link>

            
            <Link to="http://localhost:5174/login" className={`px-6 py-2 rounded-full font-bold text-white bg-black hover:bg-white hover:text-black hover:border-2 transition ${location.pathname === '/login' ? 'border-b-2 border-blue-500' : ''}`}>              User Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "24px 16px",
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "100%",
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 4px 24px rgba(37,99,235,0.06)",
            border: "1.5px solid #e2e8f0",
            padding: "20px",
            minHeight: "400px",
          }}
        >
          <Routes>
          {/* <Route path="/" element={<VerifyProduct />} /> */}
          <Route path="/" element={<SneakerForm />} />
          {/* <Route path="/login" element={<UserLogin setUserAddress={setUserAddress} />} /> */}
        </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto p-6 md:py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-semibold text-[#1F2937]">SNEAKER.PREDICT</span>
          </div>
          <div className="text-sm text-gray-500">
            © 2025 Sneaker Price Prediction. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Global styles */}
      <style>{`
        .nav-link {
          font-size: 1rem;
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 8px;
          background: #f1f5fb;
          text-align: center;
          flex: 1 1 auto;
          min-width: 140px;
        }

        .login-link {
          color: #fff;
          background: #2563eb;
          box-shadow: 0 2px 8px rgba(37,99,235,0.08);
        }

        .container {
          max-width: 1400px !important;
        }

        @media (max-width: 768px) {
          .nav-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .nav-link {
            width: 100%;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .logo {
            font-size: 1.5rem !important;
          }
          .nav-link {
            font-size: 0.9rem;
            padding: 8px 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;