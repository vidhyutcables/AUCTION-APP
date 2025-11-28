import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Player, Team, Bid } from './types';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for sandbox
let nextPlayerId = 1;
const players = new Map<number, Player>();
const bids: Bid[] = [];
const teams = new Map<number, Team>();

// Initial sample teams
const initialTeams: Team[] = [
  { id: 1, name: 'AMM Lions', purse: 100000 },
  { id: 2, name: 'AMM Tigers', purse: 100000 },
  { id: 3, name: 'AMM Eagles', purse: 100000 },
  { id: 4, name: 'AMM Royals', purse: 100000 }
];
initialTeams.forEach(t => teams.set(t.id, t));

// Multer (memory storage) to accept photo uploads (convenient for Codesandbox)
const upload = multer({ storage: multer.memoryStorage() });

// Register player endpoint (multipart form, photo optional)
app.post('/api/players/register', upload.single('photo'), (req, res) => {
  const { name, age, role, batting, cricheroes, payment } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const p: Player = {
    id: nextPlayerId++,
    name,
    age: age ? Number(age) : undefined,
    role,
    batting,
    cricheroes,
    photo: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null,
    basePrice: 5000,
    status: 'pending',
    paymentStatus: payment === 'paid' ? 'paid' : 'pending',
    assignedTeamId: null,
    soldPrice: null,
    unsold: false
  };
  players.set(p.id, p);
  return res.json({ ok: true, player: p });
});

// List players with simple filters
app.get('/api/players', (req, res) => {
  const filter = (req.query.filter as string) || 'all';
  let arr = Array.from(players.values());
  if (filter === 'paid') arr = arr.filter(p => p.paymentStatus === 'paid');
  if (filter === 'pending') arr = arr.filter(p => p.status === 'pending');
  if (filter === 'approved') arr = arr.filter(p => p.status === 'approved');
  if (filter === 'rejected') arr = arr.filter(p => p.status === 'rejected');
  return res.json(arr);
});

// Update player (approve/reject/edit)
app.post('/api/players/:id', upload.single('photo'), (req, res) => {
  const id = Number(req.params.id);
  const p = players.get(id);
  if (!p) return res.status(404).json({ error: 'Player not found' });
  const { action, name, age, role, batting, paymentStatus, basePrice } = req.body;
  if (action === 'approve') { p.status = 'approved'; players.set(id, p); return res.json({ ok: true, player: p }); }
  if (action === 'reject') { p.status = 'rejected'; players.set(id, p); return res.json({ ok: true, player: p }); }
  if (name) p.name = name;
  if (age) p.age = Number(age);
  if (role) p.role = role;
  if (batting) p.batting = batting;
  if (paymentStatus) p.paymentStatus = paymentStatus;
  if (basePrice) p.basePrice = Number(basePrice);
  if (req.file) p.photo = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  players.set(id, p);
  return res.json({ ok: true, player: p });
});

// Pool: approved players not assigned and not unsold
app.get('/api/pool', (req, res) => {
  const arr = Array.from(players.values()).filter(p => p.status === 'approved' && !p.assignedTeamId && !p.unsold);
  return res.json(arr);
});

// Teams list
app.get('/api/teams', (req, res) => res.json(Array.from(teams.values())));

// Bid: record and update player's displayed soldPrice
app.post('/api/bid', (req, res) => {
  const { playerId, teamId, amount } = req.body;
  const player = players.get(Number(playerId));
  const team = teams.get(Number(teamId));
  if (!player) return res.status(404).json({ error: 'Player not found' });
  if (!team) return res.status(404).json({ error: 'Team not found' });
  bids.push({ playerId: player.id, teamId: team.id, amount: Number(amount), at: new Date().toISOString() });
  player.soldPrice = Number(amount);
  players.set(player.id, player);
  return res.json({ ok: true });
});

// Finalize: assign player to team and deduct purse
app.post('/api/finalize', (req, res) => {
  const { playerId, teamId, price } = req.body;
  const player = players.get(Number(playerId));
  const team = teams.get(Number(teamId));
  if (!player || !team) return res.status(404).json({ error: 'player or team not found' });
  if (team.purse < Number(price)) return res.status(400).json({ error: 'Insufficient purse' });
  player.assignedTeamId = team.id;
  player.soldPrice = Number(price);
  player.status = 'approved';
  players.set(player.id, player);
  team.purse = team.purse - Number(price);
  teams.set(team.id, team);
  return res.json({ ok: true, player, team });
});

// Mark unsold
app.post('/api/unsold', (req, res) => {
  const { playerId } = req.body;
  const player = players.get(Number(playerId));
  if (!player) return res.status(404).json({ error: 'player not found' });
  player.unsold = true;
  player.status = 'rejected';
  players.set(player.id, player);
  return res.json({ ok: true, player });
});

// Reports summary
app.get('/api/reports/summary', (req, res) => {
  const sold = Array.from(players.values()).filter(p => p.assignedTeamId);
  const unsold = Array.from(players.values()).filter(p => p.unsold);
  const teamArr = Array.from(teams.values());
  return res.json({ sold, unsold, teams: teamArr });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
