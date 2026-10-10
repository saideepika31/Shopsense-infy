import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Forgotpwd from "./pages/Forgotpwd";
import Vendor from "./pages/Vendor";
import Vendorprofile from "./pages/Vendorprofile";
import Products from "./pages/Products";
import Admin from "./pages/Admin";
import { Routes, Route } from "react-router-dom";


function App() {

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* VENDOR REGISTRATION */}
      <Route
        path="/register"
        element={<Registration />}
      />

      {/* FORGOT PASSWORD */}
      <Route
        path="/forgot-password"
        element={<Forgotpwd />}
      />

      {/* VENDOR DASHBOARD */}
      <Route
        path="/Vendordashboard"
        element={<Vendor />}
      />

      {/* VENDOR PROFILE */}
      <Route
        path="/Vendorprofile"
        element={<Vendorprofile />}
      />

      {/* PRODUCTS */}
      <Route
        path="/products"
        element={<Products />}
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={<Admin />}
      />
      {/*Vendor Profile*/
        <Route
          path="/Vendorprofile"
          element={<Vendorprofile />}
        />}
    </Routes>
  );
}


export default App;