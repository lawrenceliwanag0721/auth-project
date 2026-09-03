"use client"

import React from 'react'

export default function Tabs({ active, setActive }) {

  const tabs = ["For You", "Following"]

  return (
    <div className="flex flex-row w-full sticky top-0 bg-white z-10">

      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`flex-1 py-3 text-lg transition-colors border-b ${
            active === tab
              ? "text-black border-black"
              : "text-black/40 border-black/10 hover:text-black/70"
          }`}
        >
          {tab}
        </button>
      ))}

    </div>
  )
}