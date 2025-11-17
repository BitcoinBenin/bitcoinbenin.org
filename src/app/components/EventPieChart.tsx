"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const eventData = [
  { name: 'Meet-ups', value: 18 },
  { name: 'Conférences', value: 4 },
  { name: 'Ateliers', value: 2 },
];

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b']; // sky-500, emerald-500, amber-500

export default function EventPieChart() {
  return (
    <div className="animate-fade-in-left">
      <h3 className="text-xl font-semibold mb-4 text-center">Répartition des Événements</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={eventData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ percent }) => `${((percent as number || 0) * 100).toFixed(0)}%`}
            >
              {eventData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                borderColor: '#4b5563',
                borderRadius: '0.75rem'
              }}
              cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
            />
            <Legend wrapperStyle={{ fontSize: '0.9rem' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}