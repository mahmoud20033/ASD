import React from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import Login from '../Login/Login'
import Create from '../Login/Create'
import Forgot from '../Login/Forgot'
import Navv from '../Navv'
import Main from '../Home/Main'
import Suppliers from '../Sidebar/Suppliers'
import Scrapstore from '../Sidebar/Scrapstore'
import Rawmaterial from '../Sidebar/Rawmaterial'
import Employees from '../Sidebar/Employees'
import Pouvoirs from '../Sidebar/Pouvoirs'
import Jobs from '../Sidebar/Jobs'
import Sidebar from '../Home/Sidebar'

const ProtectedLayout = () => (
  <>
    <Sidebar />
    <Outlet />
  </>
)

const Layout = () => {
  return (
    <div className='w-screen h-screen'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Create" element={<Create />} />
          <Route path="/Forgot" element={<Forgot />} />
          {/* Protected routes with navbar */}
          <Route element={<ProtectedLayout />}>
            <Route path="/Jobs" element={<Jobs />} />
            <Route path="/Jobs" element={<Jobs />} />
            <Route path="/Main" element={<Main />} />
            <Route path="/Pouvoirs" element={<Pouvoirs />} />
            <Route path="/Employees" element={<Employees />} />
            <Route path="/Rawmaterial" element={<Rawmaterial />} />
            <Route path="/Scrapstore" element={<Scrapstore />} />
            <Route path="/Suppliers" element={<Suppliers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Layout