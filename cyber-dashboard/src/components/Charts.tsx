'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttackStats } from '@/types/cyber';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ChartsProps {
  stats: AttackStats;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

export function Charts({ stats }: ChartsProps) {
  // Prepare data for attack types chart
  const attackTypesData = Object.entries(stats.attack_types)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Prepare data for severity distribution chart
  const severityData = Object.entries(stats.severity_distribution)
    .map(([name, value]) => ({ name, value }));

  // Prepare data for top countries chart
  const countriesData = Object.entries(stats.top_countries)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Attack Types Chart */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/20 rounded-full -translate-y-10 translate-x-10"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600">📊</span>
            </div>
            Tipos de Ataque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attackTypesData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={11}
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Severity Distribution Chart */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/20 rounded-full -translate-y-10 translate-x-10"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600">🥧</span>
            </div>
            Distribución de Severidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Countries Chart */}
      <Card className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/20 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-emerald-200/20 rounded-full translate-y-8 -translate-x-8"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600">🌍</span>
            </div>
            Países con Más Ataques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countriesData} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" width={120} stroke="#6b7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" fill="url(#greenGradient)" radius={[0, 4, 4, 0]} />
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
