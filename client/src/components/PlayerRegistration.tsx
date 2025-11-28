import React, { useState } from 'react'
import { api } from '../api'

export default function PlayerRegistration(){
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [role, setRole] = useState('')
  const [batting, setBatting] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [paymentSim, setPaymentSim] = useState<'paid'|'pending'>('paid')
  const [msg, setMsg] = useState('')

  async function submit(e: React.FormEvent){
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', name)
    fd.append('age', age)
    fd.append('role', role)
    fd.append('batting', batting)
    fd.append('payment', paymentSim)
    if(photo) fd.append('photo', photo)
    try{
      const r = await api.register(fd)
      setMsg(`Registered (id ${r.data.player.id}) — payment ${r.data.player.paymentStatus}`)
      setName(''); setAge(''); setRole(''); setBatting(''); setPhoto(null)
    }catch(err: any){
      setMsg('Error: ' + (err.message || err))
    }
  }

  return (
    <div className="card">
      <h3>Player Registration</h3>
      <form onSubmit={submit}>
        <input required placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Age" value={age} onChange={e=>setAge(e.target.value)} />
        <input placeholder="Role" value={role} onChange={e=>setRole(e.target.value)} />
        <input placeholder="Batting/Bowling style" value={batting} onChange={e=>setBatting(e.target.value)} />
        <div>
          <label>Photo (optional)</label>
          <input type="file" accept="image/*" onChange={e=>setPhoto(e.target.files?.[0] ?? null)} />
        </div>
        <div>
          <label>Simulate Payment</label>
          <select value={paymentSim} onChange={e=>setPaymentSim(e.target.value as any)}>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <button type="submit">Register & Pay</button>
      </form>
      <p>{msg}</p>
    </div>
  )
}
