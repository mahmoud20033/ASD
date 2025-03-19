import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import CreateTaskPage from '../TaskManagement/CreateTaskPage'

const Jobs = () => {
    return (
        <div className=' absolute pt-3 top-0 left-0 w-screen'>
            <CreateTaskPage />
            <Outlet />
        </div>
    )
}

export default Jobs