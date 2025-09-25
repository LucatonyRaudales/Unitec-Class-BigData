import { AttackStats } from '@/types/cyber';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface ChartsProps {
  stats: AttackStats;
}

export function Charts({ stats }: ChartsProps) {
  // Prepare data for charts
  const attackTypeData = Object.entries(stats.attack_types)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const severityData = Object.entries(stats.severity_distribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const countryData = Object.entries(stats.top_countries)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Color palettes
  const attackTypeColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const severityColors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const countryColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color?: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-white/20">
          <p className="font-bold text-gray-800">{label}</p>
          <p className="text-sm text-gray-600">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: payload[0].color }}></span>
            {payload[0].name}: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Attack Types Bar Chart */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
            <BarChart3 className="h-6 w-6 text-blue-300" />
          </div>
          <h3 className="text-xl font-bold text-white">Tipos de Ataque</h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attackTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity duration-200"
              >
                {attackTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={attackTypeColors[index % attackTypeColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Severity Distribution Pie Chart */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl">
              <PieChartIcon className="h-6 w-6 text-green-300" />
            </div>
            <h3 className="text-xl font-bold text-white">Distribución de Severidad</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                     label={(props: any) => {
                       const { name, percent } = props;
                       return `${name} ${(percent * 100).toFixed(0)}%`;
                     }}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={severityColors[index % severityColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Countries Bar Chart */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-purple-300" />
            </div>
            <h3 className="text-xl font-bold text-white">Países Más Afectados</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  type="number"
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <YAxis 
                  dataKey="name" 
                  type="category"
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]}
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  {countryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={countryColors[index % countryColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-blue-300" />
            </div>
            <h4 className="text-lg font-bold text-white">Tendencia</h4>
          </div>
          <p className="text-blue-200 text-sm">
            Análisis de patrones de ataque en tiempo real
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <BarChart3 className="h-6 w-6 text-green-300" />
            </div>
            <h4 className="text-lg font-bold text-white">Datos</h4>
          </div>
          <p className="text-green-200 text-sm">
            {stats.total_attacks.toLocaleString()} registros analizados
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <PieChartIcon className="h-6 w-6 text-purple-300" />
            </div>
            <h4 className="text-lg font-bold text-white">Cobertura</h4>
          </div>
          <p className="text-purple-200 text-sm">
            {Object.keys(stats.attack_types).length} tipos de amenazas identificadas
          </p>
        </div>
      </div>
    </div>
  );
}