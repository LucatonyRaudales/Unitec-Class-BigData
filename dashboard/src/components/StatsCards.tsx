import { AttackStats } from '../types/cyber';
import { Shield, AlertTriangle, Users, Target, TrendingUp, Activity } from 'lucide-react';

interface StatsCardsProps {
  stats: AttackStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Ataques',
      value: stats.total_attacks.toLocaleString(),
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      bgColor: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-400/30',
      textColor: 'text-red-300',
      description: 'Amenazas detectadas',
      trend: '+12%',
      trendColor: 'text-red-400'
    },
    {
      title: 'Severidad Promedio',
      value: stats.avg_severity_score.toFixed(1),
      icon: AlertTriangle,
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'from-orange-500/20 to-yellow-500/20',
      borderColor: 'border-orange-400/30',
      textColor: 'text-orange-300',
      description: 'Nivel de riesgo',
      trend: '+5%',
      trendColor: 'text-orange-400'
    },
    {
      title: 'Usuarios Afectados',
      value: stats.total_affected_users.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-400/30',
      textColor: 'text-blue-300',
      description: 'Impacto total',
      trend: '+8%',
      trendColor: 'text-blue-400'
    },
    {
      title: 'Tipos de Ataque',
      value: Object.keys(stats.attack_types).length.toString(),
      icon: Target,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-500/20 to-indigo-500/20',
      borderColor: 'border-purple-400/30',
      textColor: 'text-purple-300',
      description: 'Categorías únicas',
      trend: '+3%',
      trendColor: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="group relative overflow-hidden bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>

            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${card.trendColor} flex items-center gap-1`}>
                    <TrendingUp className="h-3 w-3" />
                    {card.trend}
                  </div>
                  <div className="text-xs text-white/60">vs mes anterior</div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className={`text-3xl font-black ${card.textColor} group-hover:text-white transition-colors duration-300`}>
                  {card.value}
                </h3>
                <p className="text-white/80 font-semibold text-lg">
                  {card.title}
                </p>
                <p className="text-white/60 text-sm">
                  {card.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: `${Math.min((parseFloat(card.value.replace(/,/g, '')) / 10000) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Hover effect border */}
              <div className={`absolute inset-0 rounded-2xl border-2 ${card.borderColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-500"></div>
          </div>
        );
      })}
    </div>
  );
}