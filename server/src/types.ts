export type PlayerStatus = 'pending' | 'approved' | 'rejected';

export interface Player {
  id: number;
  name: string;
  age?: number;
  role?: string;
  batting?: string;
  cricheroes?: string;
  photo?: string | null; // data URL
  basePrice: number;
  status: PlayerStatus;
  paymentStatus: 'paid' | 'pending';
  assignedTeamId?: number | null;
  soldPrice?: number | null;
  unsold?: boolean;
}

export interface Team {
  id: number;
  name: string;
  logo?: string | null;
  purse: number;
}

export interface Bid {
  playerId: number;
  teamId: number;
  amount: number;
  at: string;
}
