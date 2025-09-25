'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CyberAttack, FilterOptions } from '@/types/cyber';
import { Search, Filter, Download } from 'lucide-react';

interface DataTableProps {
  data: CyberAttack[];
  onFilter: (filters: FilterOptions) => void;
  filters: FilterOptions;
}

export function DataTable({ data, onFilter, filters }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Bajo': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Alto': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Crítico': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAttackTypeColor = (attackType: string) => {
    const criticalTypes = ['Ransomware', 'Malware'];
    const highTypes = ['DDoS', 'Brute Force'];
    
    if (criticalTypes.includes(attackType)) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (highTypes.includes(attackType)) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const filteredData = data.filter(attack => {
    const matchesSearch = 
      attack.attack_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attack.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attack.severity.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-50 border-2 border-slate-200 hover:shadow-xl transition-all duration-300">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-200/20 rounded-full -translate-y-12 translate-x-12"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gray-200/20 rounded-full translate-y-8 -translate-x-8"></div>
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
            <div className="p-2 bg-slate-100 rounded-lg">
              <span className="text-slate-600">📋</span>
            </div>
            Datos de Ataques
            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-700 border-blue-200">
              {filteredData.length} registros
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar en datos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-blue-300"
              />
            </div>
            <button className="p-2.5 text-gray-500 hover:text-gray-700 bg-white/50 hover:bg-white/80 rounded-lg transition-all duration-200 border border-gray-200">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-100 to-gray-100">
              <tr>
                <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">ID</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">Timestamp</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">Tipo</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">IP Origen</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">IP Destino</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">País</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">Severidad</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">Puntuación</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">Duración</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">Usuarios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.slice(0, filters.limit).map((attack, index) => (
                <tr 
                  key={attack.id} 
                  className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30'
                  }`}
                >
                  <td className="py-4 px-4 font-bold text-gray-900 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                      #{attack.id}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm font-mono">
                    {attack.timestamp}
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={`${getAttackTypeColor(attack.attack_type)} font-semibold px-3 py-1`}>
                      {attack.attack_type}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <code className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-mono border border-gray-200">
                      {attack.source_ip}
                    </code>
                  </td>
                  <td className="py-4 px-4">
                    <code className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-mono border border-gray-200">
                      {attack.target_ip}
                    </code>
                  </td>
                  <td className="py-4 px-4 text-gray-700 font-medium flex items-center gap-2">
                    <span className="text-lg">🌍</span>
                    {attack.country}
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={`${getSeverityColor(attack.severity)} font-semibold px-3 py-1`}>
                      {attack.severity}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            attack.severity_score <= 3 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            attack.severity_score <= 6 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${attack.severity_score * 10}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700 min-w-[20px]">
                        {attack.severity_score}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700 font-medium">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-lg text-sm font-semibold">
                      {attack.duration_minutes} min
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700 font-bold">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-sm">
                      {attack.affected_users.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
