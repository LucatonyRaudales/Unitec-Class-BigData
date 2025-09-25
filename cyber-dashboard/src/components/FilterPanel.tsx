'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CyberAttack, FilterOptions } from '@/types/cyber';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  data: CyberAttack[];
  onFilter: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export function FilterPanel({ data, onFilter, currentFilters }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get unique values for filters
  const uniqueAttackTypes = [...new Set(data.map(attack => attack.attack_type))].sort();
  const uniqueSeverities = [...new Set(data.map(attack => attack.severity))].sort();
  const uniqueCountries = [...new Set(data.map(attack => attack.country))].sort();

  const handleFilterChange = (key: keyof FilterOptions, value: string | number) => {
    onFilter({
      ...currentFilters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilter({
      attack_type: '',
      severity: '',
      country: '',
      limit: 100
    });
  };

  const hasActiveFilters = currentFilters.attack_type || currentFilters.severity || currentFilters.country;

  return (
    <Card className="mb-6 relative overflow-hidden bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-100 hover:shadow-xl transition-all duration-300">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Filter className="h-5 w-5 text-indigo-600" />
            </div>
            Filtros de Búsqueda
          </CardTitle>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 bg-white/50 rounded-lg transition-colors duration-200"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${isOpen ? 'block' : 'hidden md:grid'}`}>
          {/* Attack Type Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-red-500">🔴</span>
              Tipo de Ataque
            </label>
            <select
              value={currentFilters.attack_type}
              onChange={(e) => handleFilterChange('attack_type', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-indigo-300"
            >
              <option value="">Todos los tipos</option>
              {uniqueAttackTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-yellow-500">⚠️</span>
              Severidad
            </label>
            <select
              value={currentFilters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-indigo-300"
            >
              <option value="">Todos los niveles</option>
              {uniqueSeverities.map(severity => (
                <option key={severity} value={severity}>{severity}</option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-blue-500">🌍</span>
              País
            </label>
            <select
              value={currentFilters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-indigo-300"
            >
              <option value="">Todos los países</option>
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Limit Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-green-500">📊</span>
              Límite de Registros
            </label>
            <select
              value={currentFilters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-indigo-300"
            >
              <option value={50}>50 registros</option>
              <option value={100}>100 registros</option>
              <option value={200}>200 registros</option>
              <option value={500}>500 registros</option>
              <option value={1000}>1000 registros</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
