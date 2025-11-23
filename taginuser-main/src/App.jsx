import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VerifyProduct from './pages/VerifyProduct';
import UserLogin from './pages/UserLogin';
import TransferHistory from './pages/TransferHistory';
import Inventory from './pages/Inventory';

function App() {
  const [userAddress, setUserAddress] = useState(null);

  return (
    <div className="min-h-screen w-full bg-white"
      style={{
        backgroundImage:
          "linear-gradient(90deg, #f7f7f7 1px, transparent 1px), linear-gradient(180deg, #f7f7f7 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Navbar */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-gray-200 bg-white shadow-sm">
        <Link className="text-xl font-bold text-gray-800 hover:text-black transition" to="/">
          Verify Product
        </Link>
        <div className="space-x-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-900 transition font-medium"
          >
            User Login
          </Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<VerifyProduct userAddress={userAddress} />} />
        <Route path="/login" element={<UserLogin setUserAddress={setUserAddress} />} />
        <Route path="/inventory" element={<Inventory userAddress={userAddress} />} />
        <Route path="/history/:tokenId" element={<TransferHistory userAddress={userAddress} />} />
      </Routes>
    </div>
  );
}

export default App;
