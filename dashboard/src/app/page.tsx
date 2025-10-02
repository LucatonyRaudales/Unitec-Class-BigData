'use client';

import { useState, useEffect } from 'react';
import { CyberAttack, AttackStats, FilterOptions } from '../types/cyber';
import { fetchCyberData, calculateStats } from '../lib/data';
import { StatsCards } from '../components/StatsCards';
import { Charts } from '../components/Charts';
import { FilterPanel } from '../components/FilterPanel';
import { DataTable } from '../components/DataTable';
import { Shield, AlertCircle, Loader2, Zap, Eye, Brain, Lock } from 'lucide-react';
import './globals.css';
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-32 w-32 border-4 border-purple-500/30 mx-auto"></div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            🛡️ CyberShield
          </h2>
          <p className="text-purple-200 text-lg animate-pulse">
            Analizando datos de ciberseguridad...
          </p>
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold text-white mb-4">Error de Conexión</h2>
          <p className="text-red-200 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-24">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-lg">
                    🛡️ CyberShield
                  </h1>
                  <p className="text-purple-200 font-semibold text-lg">
                    Dashboard de Inteligencia en Ciberseguridad
                  </p>
                  <p className="text-purple-300 text-sm">
                    Proyecto Final - Universidad Unitec
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-sm font-medium">Sistema Activo</span>
                </div>
                <div className="text-white/90 text-lg font-bold">
                  {new Date().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-purple-200 text-sm">
                  Análisis en Tiempo Real
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 animate-pulse delay-1000"></div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {stats && (
            <>
              {/* Stats Cards */}
              <div className="mb-12">
                <StatsCards stats={stats} />
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-12">
                {/* Charts Section */}
                <div className="xl:col-span-3">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-500/20 rounded-xl">
                        <Brain className="h-6 w-6 text-purple-300" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Análisis Inteligente</h2>
                    </div>
                    <Charts stats={stats} />
                  </div>
                </div>
                
                {/* Filters Section */}
                <div>
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl h-fit hover:shadow-3xl transition-all duration-500">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-500/20 rounded-xl">
                        <Eye className="h-6 w-6 text-blue-300" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Filtros</h2>
                    </div>
                    <FilterPanel 
                      data={data} 
                      onFilter={handleFilter} 
                      currentFilters={filters} 
                    />
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-500/20 rounded-xl">
                    <Zap className="h-6 w-6 text-green-300" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Datos en Tiempo Real</h2>
                </div>
                <DataTable 
                  data={filteredData} 
                  onFilter={handleFilter} 
                  filters={filters} 
                />
              </div>
            </>
          )}

          {/* Security Notice */}
          <div className="mt-12 relative overflow-hidden bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:shadow-3xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 animate-pulse delay-1000"></div>
            
            <div className="relative flex items-start gap-6">
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/20">
                <Lock className="h-8 w-8 text-blue-300" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  🛡️ Nota de Seguridad
                </h3>
                <p className="text-purple-200 text-lg leading-relaxed mb-6">
                  <strong className="text-white">Datos Enmascarados:</strong> Todos los datos sensibles (IPs, emails, usuarios) 
                  han sido enmascarados para proteger la privacidad. Las direcciones IP se muestran como XXX.XXX.XXX.XXX, 
                  los emails como ***@***.*** y los nombres de usuario como USER_***.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-400/30">
                    🔒 Privacidad Protegida
                  </span>
                  <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold border border-purple-400/30">
                    🛡️ Datos Seguros
                  </span>
                  <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm font-semibold border border-pink-400/30">
                    ✅ Cumplimiento GDPR
                  </span>
                </div>
              </div>
            </div>
        </div>
      </main>

        {/* Footer */}
        <footer className="relative overflow-hidden mt-16">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/90 via-gray-800/90 to-slate-900/90 backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-white/20">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  CyberShield Dashboard
                </h3>
              </div>
              <p className="text-gray-300 text-lg mb-6">
                Proyecto Final - Universidad Unitec | Seguridad con Grandes Volúmenes de Información
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Desarrollado con ❤️
                </span>
                <span>•</span>
                <span>Next.js + TypeScript</span>
                <span>•</span>
                <span>Tailwind CSS</span>
                <span>•</span>
                <span>Recharts</span>
                <span>•</span>
                <span>Lucide Icons</span>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full translate-y-16 -translate-x-16 animate-pulse delay-1000"></div>
      </footer>
      </div>
    </div>
  );
}