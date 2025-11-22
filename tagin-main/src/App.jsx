import { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Registerproduct from './pages/Registerproduct';
import TransferOwnership from "./pages/TransferOwnership";
import { MdFactory } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";
import { TiDeviceDesktop } from "react-icons/ti";
import { BsArrowLeftShort } from "react-icons/bs";

function App() {
  const [open, setOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  const navItems = [
    { name: 'Register Product', path: '/Registerproduct' },
    { name: 'Dashboard', path: '/' },
    { name: 'Transfer Ownership', path: '/transfer' },
  ];

  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} setUserAddress={setUserAddress} />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className={`bg-purple-100 border-r transition-all ${open ? 'w-72' : 'w-20'} relative`}>
        <BsArrowLeftShort
          className={`absolute -right-3 top-6 bg-purple-400 rounded-full text-xl cursor-pointer border border-purple-700 z-10 transition-transform ${open ? '' : 'rotate-180'}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex items-center gap-4 p-4">
          <MdFactory size={24} />
          {open && <h1 className="text-xl font-bold">Manufacturer</h1>}
        </div>
        <ul className="px-4">
          {navItems.map((item, index) => (
            <li key={index} className="my-4">
              {open && <Link to={item.path} className="hover:bg-purple-400 px-2 py-1 rounded-md">{item.name}</Link>}
            </li>
          ))}
        </ul>
      </nav>

      {/* Routings */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Registerproduct" element={<Registerproduct />} />
          <Route path="/transfer" element={<TransferOwnership />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
