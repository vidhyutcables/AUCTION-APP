import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function AuctionControl(){
  const [pool, setPool] = useState<any[]>([])
  const [current, setCurrent] = useState<any | null>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [bid, setBid] = useState<number>(0)
  const [history, setHistory] = useState<{amount:number,at:string}[]>([])

  useEffect(()=>{ load() }, [])
  async function load(){
    const p = await api.pool(); setPool(p.data); if(p.data[0]) { setCurrent(p.data[0]); setBid(p.data[0].basePrice ?? 5000) }
    const t = await api.teams(); setTeams(t.data)
  }
  function inc(v:number){ setBid(prev => { const n = prev + v; setHistory(h => [{amount: n, at: new Date().toISOString()}, ...h]); return n }) }
  async function finalize(teamId:number){
    if(!current) return; await api.finalize({ playerId: current.id, teamId, price: bid}); await load()
  }
  async function markUnsold(){
    if(!current) return; await api.unsold({ playerId: current.id }); await load()
  }
  function next(){
    const idx = pool.findIndex(p=>p.id===current?.id); const nxt = pool[idx+1] ?? pool[0] ?? null; setCurrent(nxt); setBid(nxt?.basePrice ?? 5000); setHistory([])
  }

  return (
    <div className="auction">
      <div className="left">
        <h3>Current Player</h3>
        {current ? (
          <div className="card">
            {current.photo && <img src={current.photo} style={{maxWidth:160}} />}
            <h4>{current.name}</h4>
            <p>{current.role} | Base ₹{current.basePrice}</p>
            <h2>₹ {bid}</h2>
            <div>
              <button onClick={()=>inc(500)}>+500</button>
              <button onClick={()=>inc(1000)}>+1000</button>
              <button onClick={()=>inc(5000)}>+5000</button>
            </div>
            <div>
              <label>Assign to Team</label>
              <select onChange={e=>finalize(Number(e.target.value))}><option value="">--Select--</option>{teams.map(t=><option key={t.id} value={t.id}>{t.name} (purse ₹{t.purse})</option>)}</select>
            </div>
            <div>
              <button onClick={markUnsold}>Mark Unsold</button>
              <button onClick={next}>Next Player</button>
              <button onClick={load}>Refresh Pool</button>
            </div>
          </div>
        ) : <p>No player selected</p>}
      </div>
      <div className="right">
        <h3>Bid History</h3>
        <ul>{history.map((h,i)=><li key={i}>₹{h.amount} @ {new Date(h.at).toLocaleTimeString()}</li>)}</ul>
      </div>
    </div>
  )
}
