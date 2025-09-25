'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttackStats } from '@/types/cyber';
import { Shield, AlertTriangle, Users, Bug } from 'lucide-react';

interface StatsCardsProps {
  stats: AttackStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Ataques',
      value: stats.total_attacks.toLocaleString(),
      icon: AlertTriangle,
      gradient: 'from-red-500 to-pink-600',
      bgGradient: 'from-red-50 to-pink-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      valueColor: 'text-red-700'
    },
    {
      title: 'Severidad Promedio',
      value: stats.avg_severity_score.toString(),
      icon: Shield,
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      valueColor: 'text-yellow-700'
    },
    {
      title: 'Usuarios Afectados',
      value: stats.total_affected_users.toLocaleString(),
      icon: Users,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-700'
    },
    {
      title: 'Tipos de Ataque',
      value: Object.keys(stats.attack_types).length.toString(),
      icon: Bug,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-green-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={index} 
            className={`relative overflow-hidden ${card.bgGradient} ${card.borderColor} border-2 hover:shadow-2xl transition-all duration-500 hover:scale-105 group`}
          >
            {/* Background gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
            
            {/* Animated border */}
            <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg`}></div>
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className={`text-3xl font-bold ${card.valueColor} group-hover:scale-105 transition-transform duration-300`}>
                {card.value}
              </div>
              <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors duration-300">
                Última actualización
              </div>
            </CardContent>
            
            {/* Decorative corner */}
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${card.gradient} opacity-10 rounded-bl-full`}></div>
          </Card>
        );
      })}
    </div>
  );
}
