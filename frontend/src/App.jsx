import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, ShoppingCart, Users, RefreshCw, AlertCircle } from 'lucide-react';

function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [view, setView] = useState('products'); 
  const [status, setStatus] = useState('Betöltés...');

  // Adatok lekérése a Backendentől
  const fetchData = async () => {
    try {
      setStatus('Adatok frissítése...');
      // Itt hívjuk meg a majdani Node.js szerveredet
      const resProd = await axios.get('http://localhost:5050/api/products');
      setProducts(resProd.data);
      
      // Ez a rész a DQS bemutatásához kell majd
      const resCust = await axios.get('http://localhost:5050/api/customers');
      setCustomers(resCust.data);
      
      setStatus('Rendszer online');
    } catch (err) {
      console.error("Hiba:", err);
      setStatus('Hiba: A backend nem elérhető');
    }
  };

  console.log(customers)
  console.log(products)

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '15px 25px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Database size={32} color="#0062cc" />
          <h1 style={{ marginLeft: '15px', fontSize: '24px', color: '#333' }}>Advanced DBMS Project Admin</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: status.includes('Hiba') ? 'red' : 'green' }}>
          <AlertCircle size={18} />
          <span>{status}</span>
        </div>
      </header>

      <nav style={{ margin: '25px 0', display: 'flex', gap: '15px' }}>
        <button onClick={() => setView('products')} style={navButtonStyle(view === 'products')}>
          <ShoppingCart size={18} /> Termékkatalógus (HQ)
        </button>
        <button onClick={() => setView('customers')} style={navButtonStyle(view === 'customers')}>
          <Users size={18} /> Vásárlókezelés (DQS)
        </button>
        <button onClick={fetchData} style={{ ...navButtonStyle(false), marginLeft: 'auto' }}>
          <RefreshCw size={18} /> Frissítés
        </button>
      </nav>

      <main style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {view === 'products' ? (
          <section>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#0062cc' }}>Központi Terméklista (WebShop_HQ)</h2>
              <p>A tábla tranzakciós replikációval szinkronizálva van a <strong>WebShop_Regional</strong> adatbázissal.</p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px' }}>ID</th>
                  <th style={{ padding: '12px' }}>Név</th>
                  <th style={{ padding: '12px' }}>Ár</th>
                  <th style={{ padding: '12px' }}>Készlet</th>
                  <th style={{ padding: '12px' }}>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? products.map(p => (
                  <tr key={p.ProductID} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{p.productId}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.productName}</td>
                    <td style={{ padding: '12px' }}>{p.price} USD</td>
                    <td style={{ padding: '12px' }}>{p.stockLevel} db</td>
                    <td style={{ padding: '12px' }}>
                      <button style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Szerkesztés</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Nincs megjeleníthető adat. Indítsd el a backendet!</td></tr>
                )}
              </tbody>
            </table>
          </section>
        ) : (
          <section>
            <h2 style={{ color: '#0062cc' }}>Vásárlói Adatok (DQS Tisztítás előtt/után)</h2>
            <p>Ez a modul a <strong>Data Quality Services</strong> tudásbázis alapú javításait szemlélteti.</p>
            <div style={{ padding: '40px', textAlign: 'center', color: '#666', border: '2px dashed #ccc' }}>
              DQS Modul feltöltés alatt...
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

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