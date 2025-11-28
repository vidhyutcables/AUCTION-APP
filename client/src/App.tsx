import React, { useState } from 'react'
import Home from './components/Home'
import PlayerRegistration from './components/PlayerRegistration'
import AdminPanel from './components/AdminPanel'
import AuctionControl from './components/AuctionControl'
import ProjectorView from './components/ProjectorView'

export default function App() {
  const [route, setRoute] = useState<'home'|'register'|'admin'|'auction'|'projector'>('home')
  return (
    <div>
      <header className="topbar">
        <h2>Agrawal Mitra Mandal — Auction (Sandbox TS)</h2>
        <nav>
          <button onClick={() => setRoute('home')}>Home</button>
          <button onClick={() => setRoute('register')}>Player Reg</button>
          <button onClick={() => setRoute('admin')}>Admin</button>
          <button onClick={() => setRoute('auction')}>Auction</button>
          <button onClick={() => setRoute('projector')}>Projector</button>
        </nav>
      </header>
      <main className="content">
        {route === 'home' && <Home />}
        {route === 'register' && <PlayerRegistration />}
        {route === 'admin' && <AdminPanel />}
        {route === 'auction' && <AuctionControl />}
        {route === 'projector' && <ProjectorView />}
      </main>
    </div>
  )
}
