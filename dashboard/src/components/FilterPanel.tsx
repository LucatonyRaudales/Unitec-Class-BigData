import { CyberAttack, FilterOptions } from '../types/cyber';
import { Search, Filter, RotateCcw, Eye } from 'lucide-react';

interface FilterPanelProps {
  data: CyberAttack[];
  onFilter: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export function FilterPanel({ data, onFilter, currentFilters }: FilterPanelProps) {
  // Get unique values for filter options
  const attackTypes = [...new Set(data.map(item => item.attack_type))].sort();
  const severities = [...new Set(data.map(item => item.severity))].sort();
  const countries = [...new Set(data.map(item => item.country))].sort();

  const handleFilterChange = (key: keyof FilterOptions, value: string | number) => {
    const newFilters = { ...currentFilters, [key]: value };
    onFilter(newFilters);
  };

  const clearFilters = () => {
    onFilter({
      attack_type: '',
      severity: '',
      country: '',
      limit: 100
    });
  };

  const getFilteredCount = () => {
    let filtered = data;
    if (currentFilters.attack_type) {
      filtered = filtered.filter(item => item.attack_type === currentFilters.attack_type);
    }
    if (currentFilters.severity) {
      filtered = filtered.filter(item => item.severity === currentFilters.severity);
    }
    if (currentFilters.country) {
      filtered = filtered.filter(item => item.country === currentFilters.country);
    }
    return filtered.length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
            <Filter className="h-5 w-5 text-blue-300" />
          </div>
          <h3 className="text-lg font-bold text-white">Filtros Activos</h3>
        </div>
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-white/80 hover:text-white text-sm"
        >
          <RotateCcw className="h-4 w-4" />
          Limpiar
        </button>
      </div>

      {/* Results Counter */}
      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4 border border-green-400/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Eye className="h-5 w-5 text-green-300" />
          </div>
          <div>
            <p className="text-green-200 text-sm">Resultados mostrados</p>
            <p className="text-white font-bold text-lg">{getFilteredCount().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Attack Type Filter */}
      <div className="space-y-3">
        <label className="block text-white font-semibold text-sm">
          Tipo de Ataque
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <select
            value={currentFilters.attack_type}
            onChange={(e) => handleFilterChange('attack_type', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200 backdrop-blur-sm"
          >
            <option value="">Todos los tipos</option>
            {attackTypes.map((type) => (
              <option key={type} value={type} className="bg-gray-800 text-white">
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Severity Filter */}
      <div className="space-y-3">
        <label className="block text-white font-semibold text-sm">
          Nivel de Severidad
        </label>
        <div className="grid grid-cols-2 gap-2">
          {severities.map((severity) => {
            const isSelected = currentFilters.severity === severity;
            const getSeverityColor = (sev: string) => {
              switch (sev) {
                case 'Bajo': return 'from-green-500/20 to-green-600/20 border-green-400/30 text-green-300';
                case 'Medio': return 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30 text-yellow-300';
                case 'Alto': return 'from-orange-500/20 to-red-500/20 border-orange-400/30 text-orange-300';
                case 'Crítico': return 'from-red-500/20 to-red-600/20 border-red-400/30 text-red-300';
                default: return 'from-gray-500/20 to-gray-600/20 border-gray-400/30 text-gray-300';
              }
            };
            
            return (
              <button
                key={severity}
                onClick={() => handleFilterChange('severity', severity)}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  isSelected 
                    ? `bg-gradient-to-r ${getSeverityColor(severity)} shadow-lg scale-105` 
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
              >
                <span className={`text-sm font-semibold ${isSelected ? getSeverityColor(severity).split(' ')[2] : 'text-white/80'}`}>
                  {severity}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Country Filter */}
      <div className="space-y-3">
        <label className="block text-white font-semibold text-sm">
          País
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <select
            value={currentFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-200 backdrop-blur-sm"
          >
            <option value="">Todos los países</option>
            {countries.map((country) => (
              <option key={country} value={country} className="bg-gray-800 text-white">
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Limit Filter */}
      <div className="space-y-3">
        <label className="block text-white font-semibold text-sm">
          Límite de Resultados
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[50, 100, 200, 500].map((limit) => (
            <button
              key={limit}
              onClick={() => handleFilterChange('limit', limit)}
              className={`p-3 rounded-xl border transition-all duration-200 ${
                currentFilters.limit === limit
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 text-blue-300 shadow-lg scale-105'
                  : 'bg-white/5 border-white/20 hover:bg-white/10 text-white/80'
              }`}
            >
              <span className="text-sm font-semibold">{limit}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(currentFilters.attack_type || currentFilters.severity || currentFilters.country) && (
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30">
          <h4 className="text-white font-semibold text-sm mb-3">Filtros Aplicados:</h4>
          <div className="flex flex-wrap gap-2">
            {currentFilters.attack_type && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold border border-blue-400/30">
                {currentFilters.attack_type}
              </span>
            )}
            {currentFilters.severity && (
              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-semibold border border-orange-400/30">
                {currentFilters.severity}
              </span>
            )}
            {currentFilters.country && (
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold border border-green-400/30">
                {currentFilters.country}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}