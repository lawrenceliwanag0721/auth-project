"use client"

import React from 'react'

function EditProfileButton() {
  const handleClick = () => {
  }

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden w-full bg-black text-white text-lg px-4 py-2 rounded-lg"
    >
      Profile
    </button>
  )
}

export default function Sidebar({ user }) {
  return (
    <div className="flex flex-col gap-4 w-64 h-fit sticky top-8">

      <div className="flex flex-col items-center gap-3 text-center">

        <div className="w-16 h-16 rounded-full border border-black/30 flex items-center justify-center text-xl text-black">
          {user.name.charAt(0)}
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-lg text-black">
            {user.name}
          </span>

          <span className="text-xs text-black/50">
            {user.handle}
          </span>
        </div>

        <p className="text-xs text-black/70">
          {user.bio}
        </p>

      </div>

      <div className="flex flex-row justify-between border-t border-black/10 pt-3">

        {user.stats.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-0.5"
          >
            <span className="text-lg text-black">
              {value}
            </span>

            <span className="text-xs text-black/50">
              {label}
            </span>
          </div>
        ))}

      </div>

      <EditProfileButton />

    </div>
  )
}