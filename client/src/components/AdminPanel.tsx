import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function AdminPanel(){
  const [filter, setFilter] = useState('all')
  const [players, setPlayers] = useState<any[]>([])
  useEffect(()=>{ load() }, [filter])
  async function load(){ const r = await api.list(filter); setPlayers(r.data) }
  async function action(id: number, act: 'approve'|'reject'){
    const fd = new FormData(); fd.append('action', act); await api.update(id, fd); load()
  }
  return (
    <div>
      <h3>Admin Panel</h3>
      <div>
        <label>Filter</label>
        <select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select>
        <button onClick={load}>Refresh</button>
      </div>
      <table className="table">
        <thead><tr><th>ID</th><th>Name</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {players.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.paymentStatus}</td>
              <td>{p.status}</td>
              <td>
                <button onClick={()=>action(p.id,'approve')}>Approve</button>
                <button onClick={()=>action(p.id,'reject')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
