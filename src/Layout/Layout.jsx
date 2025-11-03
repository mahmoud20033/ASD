import React from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import Login from '../Login/Login'
import Create from '../Login/Create'
import Forgot from '../Login/Forgot'
import Main from '../Home/Main'
import Suppliers from '../Sidebar/Suppliers'
import Scrapstore from '../Sidebar/Scrapstore'
import Rawmaterial from '../Sidebar/Rawmaterial'
import Sidebar from '../Home/Sidebar'
import { UserProvider } from '../context/UserContext';
import Clients from '../Sidebar/Clients'
import Logout from '../Login/Logout'
import Store_Supervisor from '../Sidebar/Employees/ٍStore_Supervisor'
import Foreman_Supervisor from '../Sidebar/Employees/Foreman_Supervisor'
import Workers from '../Sidebar/Employees/Workers'
import Manager from '../Sidebar/Employees/Manager'
import Footer from '../Home/Footer'
import Pouvoirs from '../Sidebar/Pouvoirs'
const ProtectedLayout = () => (
  <div className='flex w-full h-screen'>
    <div className='flex-col overflow-auto'>
      <Sidebar />
    </div>
    <div className="flex-1 flex-col overflow-auto">
      <div className='overflow-auto h-screen'>
        <Outlet />
      </div>
      <Footer />
    </div>
  </div>
)

const Layout = () => {
  return (
    <div className='w-full h-screen'>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Create" element={<Create />} />
            <Route path="/Forgot" element={<Forgot />} />
            <Route element={<ProtectedLayout />}>
              {/* Protected routes with navbar */}
              <Route path="/Main" element={<Main />} />
              <Route path="/Store_Supervisor" element={<Store_Supervisor />} />
              <Route path="/Foreman_Supervisor" element={<Foreman_Supervisor />} />
              <Route path="/Workers" element={<Workers />} />
              <Route path="/Rawmaterial" element={<Rawmaterial />} />
              <Route path="/Scrapstore" element={<Scrapstore />} />
              <Route path="/Suppliers" element={<Suppliers />} />
              <Route path="/Clients" element={<Clients />} />
              <Route path="/Logout" element={<Logout />} />
              <Route path="/Manager" element={<Manager />} />
              <Route path="/permissions" element={<Pouvoirs />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  )
}

export default Layout