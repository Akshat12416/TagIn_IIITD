import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import VerifyProduct from './pages/VerifyProduct';
import UserLogin from './pages/UserLogin';
import TransferHistory from './pages/TransferHistory';
import Inventory from './pages/Inventory';

function App() {

  //login functionality
  const [userAddress, setUserAddress] = useState(null);

  return (
  
      <div className='min-h-screen w-full bg-bluebg'>
        <nav className='p-4 flex justify-between items-center text-white'>
          <Link className='text-xl font-bold text-blue-200' to="/">Verify Product</Link>
          <div className='space-x-4'>
            <Link to="/login" className='text-blue-300 hover:underline'>User Login</Link>
          </div>
        </nav>

        {/* routings */}
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
