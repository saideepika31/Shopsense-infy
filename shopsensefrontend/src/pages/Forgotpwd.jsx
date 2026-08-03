import React from 'react'
import './Forgotpwd.css';
import AnimatedBackground from "../Components/AnimatedBackground";
function Forgotpwd() {
  return (
    <>
    <AnimatedBackground/>
    <div className='fpwd'>
        <h1>ShopSense</h1>
        <h3>Forgot Password?</h3>
        <div className='fpwd1'>
            <label>Enter your registered Email</label>
            <input type='email'></input>
            <button>send me reset Link</button>
            <label>Remember your Password ?</label>
            <button>Login</button>
        </div>
    </div>
    </>
  )
}

export default Forgotpwd