import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [userAddress, setUserAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const user = accounts[0];
        setUserAddress(user);

        const res = await axios.get("http://172.20.10.7:5000/api/products");
        const allProducts = res.data;

        const ownedProducts = allProducts.filter(product => product.owner.toLowerCase() === user.toLowerCase());
        setProducts(ownedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="min-h-screen bg-bluebg text-white p-8">
      <h2 className="text-3xl font-semibold mb-6">Your Inventory</h2>

      {products.length === 0 ? (
        <p>No products owned by you yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.tokenId} className="bg-white text-black p-4 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p><strong>Token ID:</strong> {product.tokenId}</p>
              <p><strong>Model:</strong> {product.model}</p>
              <p><strong>Serial:</strong> {product.serial}</p>

              <button
                className="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
                onClick={() => navigate(`/history/${product.tokenId}`)}
              >
                View Transfer History
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Inventory;
