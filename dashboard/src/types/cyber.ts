export interface CyberAttack {
  id: number;
  timestamp: string;
  attack_type: string;
  source_ip: string;
  target_ip: string;
  country: string;
  severity: string;
  severity_score: number;
  duration_minutes: number;
  affected_users: number;
  username: string;
  email: string;
  description: string;
}

export interface AttackStats {
  total_attacks: number;
  attack_types: Record<string, number>;
  severity_distribution: Record<string, number>;
  top_countries: Record<string, number>;
  avg_severity_score: number;
  total_affected_users: number;
}

export interface FilterOptions {
  attack_type: string;
  severity: string;
  country: string;
  limit: number;
}
