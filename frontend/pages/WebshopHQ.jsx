import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import WebshopHQ from "../pages/WebshopHQ";
import WebshopRegional from "../pages/WebshopRegional";
import "./WebshopHQ.css";
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
    <div className="app-container">
      <header className="app-header">
    <div className="header-content">
      <Database size={32} color="#0062cc" />
      <h1 className="header-title">Advanced DBMS Project Admin</h1>
    </div>
    
    <div className={`header-status ${status.includes('Error') ? 'status-error' : 'status-online'}`}>
      <AlertCircle size={18} />
      <span>{status}</span>
    </div>
  </header>

      <nav className="nav-bar">
        <button 
          onClick={() => setView('products')} 
          className={`nav-button ${view === 'products' ? 'active' : ''}`}
        >
          <ShoppingCart size={18} /> Products
        </button>
        <button 
          onClick={() => setView('customers')} 
          className={`nav-button ${view === 'customers' ? 'active' : ''}`}
        >
          <Users size={18} />Customers 
        </button>
        <button 
          onClick={() => setView('order')} 
          className={`nav-button ${view === 'order' ? 'active' : ''}`}
        >
          <PackageCheck size={18} /> New Order
        </button>
        <button 
          onClick={() => setView('history')} 
          className={`nav-button ${view === 'history' ? 'active' : ''}`}
        >
          <RefreshCw size={18} /> Order History
        </button>
        <button 
          onClick={() => setView('logs')} 
          className={`nav-button ${view === 'logs' ? 'active' : ''}`}
        >
          <Database size={18} /> Audit Logs
        </button>
        <button 
          onClick={() => setView('dashboard')} 
          className={`nav-button ${view === 'dashboard' ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>
        <button 
          onClick={fetchData} 
          className="nav-button refresh-button"
        >
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
                  <th className="table-cell">ID</th>
                  <th className="table-cell">Name</th>
                  <th className="table-cell">Price</th>
                  <th className="table-cell">Stock</th>
                  <th className="table-cell">Last Update</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.productID} style={{ borderBottom: '1px solid #eee' }}>
                    <td className="table-cell">{p.productID}</td>
                    <td className="table-cell">{p.productName}</td>
                    <td className="table-cell">{p.price} USD</td>
                    <td className="table-cell">{p.stockLevel} db</td>
                    <td className="table-cell">
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
                  <th className="table-cell">ID</th>
                  <th className="table-cell">Name</th>
                  <th className="table-cell">City</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.customerID} style={{ borderBottom: '1px solid #eee' }}>
                    <td className="table-cell">{c.customerID}</td>
                    <td className="table-cell">{c.fullName}</td>
                    <td className="table-cell" style={{ color: (c.city === 'budapst' || c.city === 'vszprem') ? 'red' : 'inherit' }}>
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
                className="input-field"
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
                className="input-field"
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
              <input type="number" className="input-field" value={order.quantity} min="1" onChange={e => setOrder({...order, quantity: e.target.value})} required />

              <button type="submit" className="nav-button" style={{ backgroundColor: '#28a745', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
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
                    <th className="table-cell">Order ID</th>
                    <th className="table-cell">Date</th>
                    <th className="table-cell">Amount</th>
                    <th className="table-cell">Status</th>
                    <th className="table-cell">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.orderID} style={{ borderBottom: '1px solid #eee' }}>
                      <td className="table-cell">#{o.orderID}</td>
                      <td className="table-cell">{new Date(o.orderDate).toLocaleString('hu-HU')}</td>
                      <td className="table-cell">${o.totalAmount}</td>
                      <td className="table-cell">
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
                      <td className="table-cell">
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
            <h2 className="section-title">System Audit Logs (Logging)</h2>
            <div style={{ marginTop: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    <th className="table-cell">Date</th>
                    <th className="table-cell">Event Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[...auditLogs].reverse().map(log => ( 
                    <tr key={log.logId || log.logID} style={{ borderBottom: '1px solid #eee' }}>
                      <td className="table-cell" style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap' }}>
                        {new Date(log.eventDate).toLocaleString('hu-HU')}
                      </td>
                      <td 
                        className="table-cell" 
                        style={{ 
                          color: log.eventDescription?.includes('FAILED') ? '#d32f2f' : '#2e7d32',
                          fontWeight: 'bold' 
                        }}
                      >
                        {log.eventDescription}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {/* Dashboard view */}
        {view === 'dashboard' && (
        <section>
          <h2 style={{ color: '#0062cc', marginBottom: '20px' }}>Business Intelligence Dashboard</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            
            {/* Total revenue */}
            <div className="stat-card card-blue">
              <h3>Total Revenue</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${stats.totalRevenue.toLocaleString()}</p>
            </div>

            {/* Orders placed */}
            <div className="stat-card card-green">
              <h3>Orders Placed</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalOrders}</p>
            </div>

            {/* Best seller */}
            <div className="stat-card card-orange">
              <h3>Best Seller</h3>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{stats.bestSellingProduct}</p>
            </div>

            {/* Failed attempts */}
            <div className="stat-card card-red">
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

export default App;
