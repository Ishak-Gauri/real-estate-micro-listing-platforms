import React from 'react'
import Header from './_components/Header'

function Provider({ children }) {
  return (
    <div>
      <Header />

      {/* ✅ Proper spacing below fixed navbar */}
      <div className="pt-32 px-4">
        {children}
      </div>
    </div>
  )
}

export default Provider