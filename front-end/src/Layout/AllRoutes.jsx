import React from 'react'

import { Outlet, Route, Routes } from 'react-router-dom'
import Dashboard from '../Component/MainContent/Dashboard'
import NewRestaurant from './NewRestaurant'
import NewTable from './NewTable'

function AllRoutes() {
    return (
      <>
      <div>AllRoutes</div>
      <Routes>
          <Route path="/new-restaurant" element={<NewRestaurant />} />
          <Route path="/new-table" element={<NewTable />} />
      </Routes>
      </>
  )
}

export default AllRoutes