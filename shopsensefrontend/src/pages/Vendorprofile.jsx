import React from 'react'
import './Vendorprofile.css'

function Vendorprofile() {
  return (
    <>
    <div className='vprof'>
        <h1>Vendor Profile</h1>
        <form className='fields'>
            <label>Business Name</label>
            <input type='text'></input>
            <label>Owner Name</label>
            <input type='text'></input>
            <label>Email</label>
            <input type='email'></input>
            <label>Phone number</label>
            <input type='number'></input>
            <label>GST number</label>
            <input type='number'></input>
            <label>Business Address</label>
            <input type='text'></input>
            <button type='submit'>Update Profile</button>
        </form>
    </div>
    </>
  )
}

export default Vendorprofile