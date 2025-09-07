import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage'
import {Toaster} from 'react-hot-toast'


const App = () => {
  return (
    <div className="min-h-screen bg-[#282c34]">
      <Toaster 
      position="top-right"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:id" element={<EditorPage />} />
      </Routes>

    </div>
  )
}

export default App