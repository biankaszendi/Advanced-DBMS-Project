import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Database,
  ShoppingCart,
  Users,
  RefreshCw,
  AlertCircle,
  PackageCheck,
  Eraser,
} from "lucide-react";

const WebshopRegional = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [view, setView] = useState("products");
  const [status, setStatus] = useState("Loading...");

  const [order, setOrder] = useState({
    customerID: "",
    productID: "",
    quantity: 1,
  });

  const API_BASE = "http://localhost:5050/api/regional";
  const fetchData = async () => {
    try {
      setStatus("Fetching data...");
      const resProd = await axios.get(`${API_BASE}/products`);
      setProducts(resProd.data);

      const resCust = await axios.get(`${API_BASE}/customers`);
      setCustomers(resCust.data);

      setStatus("System online");
    } catch (err) {
      console.error("Error:", err);
      setStatus("Error: Backend is not available");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div
      style={{
        fontFamily: "Segoe UI, sans-serif",
        padding: "30px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          padding: "15px 25px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Database size={32} color="#0062cc" />
          <h1 style={{ marginLeft: "15px", fontSize: "24px", color: "#333" }}>
            Webshop_Regional
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: status.includes("Error") ? "red" : "green",
          }}
        >
          <AlertCircle size={18} />
          <span>{status}</span>
        </div>
      </header>

      <nav style={{ margin: "25px 0", display: "flex", gap: "15px" }}>
        <button
          onClick={() => setView("products")}
          style={navButtonStyle(view === "products")}
        >
          <ShoppingCart size={18} /> Products
        </button>
        <button
          onClick={() => setView("customers")}
          style={navButtonStyle(view === "customers")}
        >
          <Users size={18} />Customers
        </button>
        <button
          onClick={fetchData}
          style={{ ...navButtonStyle(false), marginLeft: "auto" }}
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </nav>

      <main
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Products view */}
        {view === "products" && (
          <section>
            <h2 style={{ color: "#0062cc" }}>Products list</h2>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8f9fa",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  <th style={tStyle}>ID</th>
                  <th style={tStyle}>Name</th>
                  <th style={tStyle}>Price</th>
                  <th style={tStyle}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.productID}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td style={tStyle}>{p.productId}</td>
                    <td style={{ ...tStyle, fontWeight: "bold" }}>
                      {p.productName}
                    </td>
                    <td style={tStyle}>{p.price} USD</td>
                    <td style={tStyle}>{p.stockLevel} db</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {view === "customers" && (
          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ color: "#0062cc" }}>Customer Data</h2>
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8f9fa",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  <th style={tStyle}>ID</th>
                  <th style={tStyle}>Name</th>
                  <th style={tStyle}>City</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr
                    key={c.customerID}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td style={tStyle}>{c.customerID}</td>
                    <td style={tStyle}>{c.fullName}</td>
                    <td
                      style={{
                        ...tStyle,
                        color:
                          c.city === "budapst" || c.city === "vszprem"
                            ? "red"
                            : "inherit",
                      }}
                    >
                      {c.city}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
};

const tStyle = { padding: "12px" };

const navButtonStyle = (active) => ({
  padding: "12px 20px",
  backgroundColor: active ? "#0062cc" : "white",
  color: active ? "white" : "#333",
  border: "1px solid #ddd",
  borderRadius: "8px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  fontWeight: "600",
  transition: "0.2s",
});

export default WebshopRegional;
