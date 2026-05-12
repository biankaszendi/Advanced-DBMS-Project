import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import WebshopHQ from "../pages/WebshopHQ";
import WebshopRegional from "../pages/WebshopRegional";
import "./App.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, ShoppingCart, Users, RefreshCw, AlertCircle, PackageCheck, Eraser, LayoutDashboard} from 'lucide-react';

function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [view, setView] = useState('products');
  const [status, setStatus] = useState('Loading...');
  const [auditLogs, setAuditLogs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, bestSellingProduct: '', failedAttempts: 0 });
  
  const [order, setOrder] = useState({ customerID: '', productID: '', quantity: 1 });

  const API_BASE = 'http://localhost:5050/api'; 

  const fetchData = async () => {
    try {
      setStatus('Fetching data...');
      const resProd = await axios.get(`${API_BASE}/products`);
      setProducts(resProd.data);
      
      const resCust = await axios.get(`${API_BASE}/customers`);
      setCustomers(resCust.data);

      const resLogs = await axios.get(`${API_BASE}/auditlogs`);
      setAuditLogs(resLogs.data);

      const resStats = await axios.get(`${API_BASE}/dashboard`);
      setStats(resStats.data);

      const resOrders = await axios.get(`${API_BASE}/orders`);
      setOrders(resOrders.data);

      setStatus('System online');
    } catch (err) {
      console.error("Error:", err);
      setStatus('Error: Backend is not available');
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

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
    const selectedProd = products.find(p => p.productId === pID);
    const unitPrice = selectedProd ? selectedProd.price : 0;
    const total = unitPrice * qty;

    if (total === 0) {
        alert("Error: Total amount is 0. Check product selection!");
        return;
      }
      
    await axios.post(`${API_BASE}/orders`, {
      customerID: cID,
      productID: pID,
      quantity: qty,
      totalAmount: parseFloat(total.toFixed(2)) 
    });

    alert("Successfully placed order!");
    await fetchData(); 
    setOrder({ customerID: '', productID: '', quantity: 1 }); 
    } catch (err) {
    const serverErrorMessage = err.response?.data?.message || err.response?.data;
    
    if (serverErrorMessage) {
      alert("Error during order placement: " + serverErrorMessage);
    } else {
      alert("Network error or the server is not responding.");
    }

    await fetchData();
  
    setStatus('Order error');
    console.error("Details:", err);
  }
};

const handleShipOrder = async (orderId) => {
  try {
    await axios.patch(`${API_BASE}/orders/${orderId}/ship`);
    alert("Order shipped!");
    fetchData(); 
  } catch (err) {
    alert("Error updating order status.");
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
          <Users size={18} />Customers 
        </button>
        <button onClick={() => setView('order')} style={navButtonStyle(view === 'order')}>
          <PackageCheck size={18} /> New Order
        </button>
        <button onClick={() => setView('history')} style={navButtonStyle(view === 'history')}>
          <RefreshCw size={18} /> Order History
        </button>
        <button onClick={() => setView('logs')} style={navButtonStyle(view === 'logs')}>
          <Database size={18} /> Audit Logs
        </button>
        <button onClick={() => setView('dashboard')} style={navButtonStyle(view === 'dashboard')}>
          <LayoutDashboard size={18} /> Dashboard
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
                  <th style={tStyle}>Last Update</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.productID} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tStyle}>{p.productID}</td>
                    <td style={{ ...tStyle, fontWeight: 'bold' }}>{p.productName}</td>
                    <td style={tStyle}>{p.price} USD</td>
                    <td style={tStyle}>{p.stockLevel} db</td>
                    <td style={{ ...tStyle,}}>
                      {p.lastUpdated ? new Date(p.lastUpdated).toLocaleTimeString('hu-HU') : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {/* Customers view */}
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
        {/* Order history view */}
        {view === 'history' && (
          <section>
            <h2 style={{ color: '#0062cc' }}>Order Management</h2>
            <div style={{ marginTop: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    <th style={tStyle}>Order ID</th>
                    <th style={tStyle}>Date</th>
                    <th style={tStyle}>Amount</th>
                    <th style={tStyle}>Status</th>
                    <th style={tStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.orderID} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={tStyle}>#{o.orderID}</td>
                      <td style={tStyle}>{new Date(o.orderDate).toLocaleString('hu-HU')}</td>
                      <td style={tStyle}>${o.totalAmount}</td>
                      <td style={tStyle}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          backgroundColor: o.status === 'Shipped' ? '#e8f5e9' : '#fff3e0',
                          color: o.status === 'Shipped' ? '#2e7d32' : '#e65100'
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={tStyle}>
                        {o.status === 'Pending' && (
                          <button 
                            onClick={() => handleShipOrder(o.orderID)}
                            style={{ 
                              backgroundColor: '#28a745', 
                              color: 'white', 
                              border: 'none', 
                              padding: '6px 12px', 
                              borderRadius: '4px', 
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Ship Order
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {/* Audit logs view */}
        {view === 'logs' && (
          <section>
            <h2 style={{ color: '#0062cc' }}>System Audit Logs (Logging)</h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #dee2e6', position: 'sticky', top: 0 }}>
                    <th style={tStyle}>Date</th>
                    <th style={tStyle}>Event Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[...auditLogs].reverse().map(log => ( 
                    <tr key={log.logID} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ ...tStyle, fontSize: '12px', color: '#666', whiteSpace: 'nowrap' }}>
                        {new Date(log.eventDate).toLocaleString('hu-HU')}
                      </td>
                      <td style={{ 
                        ...tStyle, 
                        color: log.eventDescription.includes('FAILED') ? '#d32f2f' : '#2e7d32',
                        fontWeight: 'bold' 
                      }}>
                        {log.eventDescription}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {view === 'dashboard' && (
        <section>
          <h2 style={{ color: '#0062cc', marginBottom: '20px' }}>Business Intelligence Dashboard</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            
            {/* Total revenue */}
            <div style={cardStyle('#e3f2fd', '#0d47a1')}>
              <h3>Total Revenue</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${stats.totalRevenue.toLocaleString()}</p>
            </div>

            {/* Orders placed */}
            <div style={cardStyle('#f1f8e9', '#1b5e20')}>
              <h3>Orders Placed</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalOrders}</p>
            </div>

            {/* Best seller */}
            <div style={cardStyle('#fff3e0', '#e65100')}>
              <h3>Best Seller</h3>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{stats.bestSellingProduct}</p>
            </div>

            {/* Failed attempts */}
            <div style={cardStyle('#ffeea1', '#b71c1c')}>
              <h3 style={{color: stats.failedAttempts > 0 ? '#b71c1c' : 'inherit'}}>Failed Attempts</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.failedAttempts}</p>
            </div>
            
          </div>
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

const cardStyle = (bg, color) => ({
  backgroundColor: bg,
  color: color,
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  textAlign: 'center'
});

export default App;
