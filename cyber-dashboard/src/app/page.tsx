'use client';

import { useState, useEffect } from 'react';
import { CyberAttack, AttackStats, FilterOptions } from '@/types/cyber';
import { fetchCyberData, calculateStats } from '@/lib/data';
import { StatsCards } from '@/components/StatsCards';
import { Charts } from '@/components/Charts';
import { FilterPanel } from '@/components/FilterPanel';
import { DataTable } from '@/components/DataTable';
import { Shield, AlertCircle, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<CyberAttack[]>([]);
  const [filteredData, setFilteredData] = useState<CyberAttack[]>([]);
  const [stats, setStats] = useState<AttackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    attack_type: '',
    severity: '',
    country: '',
    limit: 100
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const cyberData = await fetchCyberData();
        setData(cyberData);
        setFilteredData(cyberData);
        setStats(calculateStats(cyberData));
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = data;

    if (filters.attack_type) {
      filtered = filtered.filter(attack => attack.attack_type === filters.attack_type);
    }
    if (filters.severity) {
      filtered = filtered.filter(attack => attack.severity === filters.severity);
    }
    if (filters.country) {
      filtered = filtered.filter(attack => attack.country === filters.country);
    }

    setFilteredData(filtered);
  }, [data, filters]);

  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando datos de ciberseguridad...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-700/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                  🛡️ Dashboard de Ciberseguridad
                </h1>
                <p className="text-blue-100 font-medium">
                  Proyecto Final - Universidad Unitec
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/90 text-sm font-medium">
                {new Date().toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-blue-100 text-xs">
                Análisis en Tiempo Real
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stats && (
          <>
            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Charts */}
            <Charts stats={stats} />

            {/* Filters */}
            <FilterPanel 
              data={data} 
              onFilter={handleFilter} 
              currentFilters={filters} 
            />

            {/* Data Table */}
            <DataTable 
              data={filteredData} 
              onFilter={handleFilter} 
              filters={filters} 
            />
          </>
        )}

        {/* Security Notice */}
        <div className="mt-8 relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-200/20 rounded-full translate-y-8 -translate-x-8"></div>
          
          <div className="relative flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                🛡️ Nota de Seguridad
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong className="text-blue-900">Datos Enmascarados:</strong> Todos los datos sensibles (IPs, emails, usuarios) 
                han sido enmascarados para proteger la privacidad. Las direcciones IP se muestran como XXX.XXX.XXX.XXX, 
                los emails como ***@***.*** y los nombres de usuario como USER_***.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  🔒 Privacidad Protegida
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                  🛡️ Datos Seguros
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                  ✅ Cumplimiento GDPR
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 mt-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white">
                Dashboard de Ciberseguridad
              </h3>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Proyecto Final - Universidad Unitec | Seguridad con Grandes Volúmenes de Información
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>Desarrollado con ❤️</span>
              <span>•</span>
              <span>Next.js + TypeScript</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>Recharts</span>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full translate-y-12 -translate-x-12"></div>
      </footer>
    </div>
  );
}