import React from 'react'
import './App.css'
import Layout from './Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.css";
import { MissionProvider } from './context/MissionContext';

const App = () => {
  return (
    <MissionProvider>
      <div className='w-screen h-screen Suppliers'>
        <Layout />
      </div>
    </MissionProvider>
  )
}

export default App