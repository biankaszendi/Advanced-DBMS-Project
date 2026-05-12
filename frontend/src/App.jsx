import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, ShoppingCart, Users, RefreshCw, AlertCircle, PackageCheck, Eraser } from 'lucide-react';

function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [view, setView] = useState('products');
  const [status, setStatus] = useState('Loading...');
  
  const [order, setOrder] = useState({ customerID: '', productID: '', quantity: 1 });

  const API_BASE = 'http://localhost:5050/api'; 
  const fetchData = async () => {
    try {
      setStatus('Fetching data...');
      const resProd = await axios.get(`${API_BASE}/products`);
      setProducts(resProd.data);
      
      const resCust = await axios.get(`${API_BASE}/customers`);
      setCustomers(resCust.data);
      
      setStatus('System online');
    } catch (err) {
      console.error("Error:", err);
      setStatus('Error: Backend is not available');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePlaceOrder = async (e) => {
  e.preventDefault();
  console.log("Aktuális order state:", order); 

  const cID = parseInt(order.customerID);
  const pID = parseInt(order.productID);
  const qty = parseInt(order.quantity);
  if (!cID || !pID) {
    alert("Please select a customer and a product!");
    return;
  }

  try {
    setStatus('Sending order...');
    const selectedProd = products.find(p => p.productID === pID);
    const total = selectedProd ? selectedProd.price * qty : 0;

    await axios.post(`${API_BASE}/orders`, {
      customerID: cID,
      productID: pID,
      quantity: qty,
      totalAmount: parseFloat(total.toFixed(2)) 
    });

    alert("Successfully placed order!");
    fetchData(); 
    setOrder({ customerID: '', productID: '', quantity: 1 }); 
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    alert("Error: " + msg);
    setStatus('Order error');
  }
};

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '15px 25px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Database size={32} color="#0062cc" />
          <h1 style={{ marginLeft: '15px', fontSize: '24px', color: '#333' }}>Advanced DBMS Project Admin</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: status.includes('Error') ? 'red' : 'green' }}>
          <AlertCircle size={18} />
          <span>{status}</span>
        </div>
      </header>

      <nav style={{ margin: '25px 0', display: 'flex', gap: '15px' }}>
        <button onClick={() => setView('products')} style={navButtonStyle(view === 'products')}>
          <ShoppingCart size={18} /> Products
        </button>
        <button onClick={() => setView('customers')} style={navButtonStyle(view === 'customers')}>
          <Users size={18} /> Editing Customers 
        </button>
        <button onClick={() => setView('order')} style={navButtonStyle(view === 'order')}>
          <PackageCheck size={18} /> New Order
        </button>
        <button onClick={fetchData} style={{ ...navButtonStyle(false), marginLeft: 'auto' }}>
          <RefreshCw size={18} /> Refresh
        </button>
      </nav>

      <main style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        
        {/* Products view */}
        {view === 'products' && (
          <section>
            <h2 style={{ color: '#0062cc' }}>Products list</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                  <th style={tStyle}>ID</th>
                  <th style={tStyle}>Name</th>
                  <th style={tStyle}>Price</th>
                  <th style={tStyle}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.productID} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tStyle}>{p.productID}</td>
                    <td style={{ ...tStyle, fontWeight: 'bold' }}>{p.productName}</td>
                    <td style={tStyle}>{p.price} USD</td>
                    <td style={tStyle}>{p.stockLevel} db</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {view === 'customers' && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#0062cc' }}>Customer Data</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                  <th style={tStyle}>ID</th>
                  <th style={tStyle}>Name</th>
                  <th style={tStyle}>City</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.customerID} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tStyle}>{c.customerID}</td>
                    <td style={tStyle}>{c.fullName}</td>
                    <td style={{ ...tStyle, color: (c.city === 'budapst' || c.city === 'vszprem') ? 'red' : 'inherit' }}>
                      {c.city}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {/* Order placement view */}
        {view === 'order' && (
          <section style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ color: '#0062cc', textAlign: 'center' }}>Placing new order</h2>
            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <label>Select Customer:</label>
              <select 
                style={inputStyle} 
                value={order.customerID} 
                onChange={e => setOrder({...order, customerID: e.target.value})} 
                required
              >
                <option value="">Select...</option>
                {customers.map(c => (
                  <option key={c.customerId || c.customerID} value={c.customerId || c.customerID}>
                    {c.fullName}
                  </option>
                ))}
              </select>

              <label>Select product:</label>
              <select 
                style={inputStyle} 
                value={order.productID} 
                onChange={e => setOrder({...order, productID: e.target.value})} 
                required
              >
                <option value="">Select...</option>
                {products.map(p => (
                  <option key={p.productId || p.productID} value={p.productId || p.productID}>
                    {p.productName}
                  </option>
                ))}
              </select>

              <label>Quantity:</label>
              <input type="number" style={inputStyle} value={order.quantity} min="1" onChange={e => setOrder({...order, quantity: e.target.value})} required />

              <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                Place Order (Stored Procedure)
              </button>
            </form>
          </section>
        )}

      </main>
    </div>
  );
}

const tStyle = { padding: '12px' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd' };

const navButtonStyle = (active) => ({
  padding: '12px 20px',
  backgroundColor: active ? '#0062cc' : 'white',
  color: active ? 'white' : '#333',
  border: active ? 'none' : '1px solid #ddd',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  fontWeight: '600',
  transition: '0.2s'
});

export default App;