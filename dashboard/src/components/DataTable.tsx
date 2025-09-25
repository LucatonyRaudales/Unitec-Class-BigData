import { CyberAttack, FilterOptions } from '@/types/cyber';
import { Shield, AlertTriangle, Clock, Users, MapPin, Activity } from 'lucide-react';

interface DataTableProps {
  data: CyberAttack[];
  onFilter: (filters: FilterOptions) => void;
  filters: FilterOptions;
}

export function DataTable({ data, onFilter, filters }: DataTableProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Bajo': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'Medio': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'Alto': return 'bg-orange-500/20 text-orange-300 border-orange-400/30';
      case 'Crítico': return 'bg-red-500/20 text-red-300 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getAttackTypeColor = (type: string) => {
    const colors = [
      'bg-red-500/20 text-red-300 border-red-400/30',
      'bg-blue-500/20 text-blue-300 border-blue-400/30',
      'bg-purple-500/20 text-purple-300 border-purple-400/30',
      'bg-green-500/20 text-green-300 border-green-400/30',
      'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
      'bg-pink-500/20 text-pink-300 border-pink-400/30',
      'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
      'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
    ];
    const index = type.length % colors.length;
    return colors[index];
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl">
            <Activity className="h-6 w-6 text-green-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Registros de Ataques</h3>
            <p className="text-white/60 text-sm">{data.length.toLocaleString()} registros encontrados</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Shield className="h-4 w-4" />
            <span>Datos enmascarados</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/20">
              <tr>
                <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">ID</th>
                <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Timestamp</th>
                <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Tipo</th>
                <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">IP Origen</th>
                <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">IP Destino</th>
                <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">País</th>
                <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Severidad</th>
                <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Puntuación</th>
                <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Duración</th>
                <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Usuarios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.slice(0, filters.limit).map((attack, index) => (
                <tr 
                  key={attack.id} 
                  className="hover:bg-white/5 transition-all duration-200 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">#{attack.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-white/60" />
                      <span className="text-white/80 text-sm">
                        {formatTimestamp(attack.timestamp)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getAttackTypeColor(attack.attack_type)}`}>
                      {attack.attack_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-white/80 text-sm bg-white/10 px-2 py-1 rounded">
                      {attack.source_ip}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-white/80 text-sm bg-white/10 px-2 py-1 rounded">
                      {attack.target_ip}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-white/60" />
                      <span className="text-white/80 text-sm">{attack.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(attack.severity)}`}>
                      {attack.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${(attack.severity_score / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white/80 text-sm font-semibold">
                        {attack.severity_score}/10
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/80 text-sm">
                      {formatDuration(attack.duration_minutes)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-white/60" />
                      <span className="text-white/80 text-sm">
                        {attack.affected_users.toLocaleString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-white/5 border-t border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span>Mostrando {Math.min(data.length, filters.limit)} de {data.length.toLocaleString()} registros</span>
              {data.length > filters.limit && (
                <span className="text-blue-300">Usa filtros para ver más</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm">Datos enmascarados para privacidad</span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white/60" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No se encontraron registros</h3>
          <p className="text-white/60">Intenta ajustar los filtros para ver más datos</p>
        </div>
      )}
    </div>
  );
}