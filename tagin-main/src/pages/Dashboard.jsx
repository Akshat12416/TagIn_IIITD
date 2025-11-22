import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    //fetching backend data from products table
    axios.get('http://172.20.10.7:5000/api/products') 
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch data", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manufacturer Dashboard</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="overflow-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white text-sm text-left text-gray-800">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Serial Number</th>
                <th className="px-4 py-3">Model Number</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Color</th>
                <th className="px-4 py-3">Manufacture Date</th>
                <th className="px-4 py-3">Token ID</th>
                <th className="px-4 py-3">Metadata Hash</th>
                <th className="px-4 py-3">Manufacturer</th>
                <th className="px-4 py-3">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.serial}</td>
                  <td className="px-4 py-2">{product.model}</td>
                  <td className="px-4 py-2">{product.type}</td>
                  <td className="px-4 py-2">{product.color}</td>
                  <td className="px-4 py-2">{product.date}</td>
                  <td className="px-4 py-2">{product.tokenId}</td>
                  <td className="px-4 py-2 break-all">{product.metadataHash}</td>
                  <td className="px-4 py-2 break-all">{product.manufacturer}</td>
                  <td className="px-4 py-2 break-all">{product.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
