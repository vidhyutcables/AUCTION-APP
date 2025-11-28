import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function ProjectorView(){
  const [current, setCurrent] = useState<any | null>(null)
  useEffect(()=>{
    let mounted = true
    async function tick(){
      const p = await api.pool()
      if(!mounted) return
      if(p.data.length === 0){ setCurrent(null); return }
      setCurrent(p.data[ Math.floor(Math.random()*p.data.length) ])
    }
    tick()
    const t = setInterval(tick, 4000)
    return ()=>{ mounted=false; clearInterval(t) }
  },[])
  return (
    <div className="projector fullscreen">
      {current ? (
        <div className="player-card">
          <h1 style={{fontSize:72}}>₹ {current.soldPrice ?? current.basePrice}</h1>
          {current.photo && <img src={current.photo} style={{width:320}} />}
          <h2>{current.name}</h2>
          <p>{current.role}</p>
        </div>
      ) : <h2>No player in pool</h2>}
    </div>
  )
}
