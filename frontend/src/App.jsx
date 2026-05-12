import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import WebshopHQ from "../pages/WebshopHQ";
import WebshopRegional from "../pages/WebshopRegional";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/">Webshop_HQ</NavLink>
        <NavLink to="/regional">Webshop_Regional</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<WebshopHQ />} />
        <Route path="/regional" element={<WebshopRegional />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
