import { useState } from 'react'
import Login from './pages/Login'
import Registration from './pages/Registration'
import { Routes, Route } from "react-router-dom";
import Forgotpwd from './pages/Forgotpwd';
import Vendor from './pages/Vendor';
import Vendorprofile from './pages/Vendorprofile';
import Products from "./Pages/Products";
function App() {


  return (
    <>
    
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/forgot-password" element={<Forgotpwd />}/>
        <Route path="/Vendordashboard" element={<Vendor/>}/>
        <Route path="/Vendorprofile" element={<Vendorprofile/>}/>
        <Route path="/products" element={<Products/>}/>
      </Routes>
    </>

  )
  }

export default App
