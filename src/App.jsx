import React from 'react'
import './App.css'
import Layout from './Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import "@fortawesome/fontawesome-free/css/all.css";
import { MissionProvider } from './context/MissionContext';
import { SearchProvider } from './context/SearchContext';

const App = () => {
  return (
    <SearchProvider>
      <MissionProvider>
        <div className='w-full h-screen Suppliers overflow-auto'>
          <Layout />
        </div>
      </MissionProvider>
    </SearchProvider>
  )
}

export default App