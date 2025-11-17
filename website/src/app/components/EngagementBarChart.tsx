"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const engagementData = [
  { name: 'Participation', value: 30, label: '25-35' },
  { name: 'Satisfaction', value: 95, label: '95%' },
  { name: 'Croissance', value: 35, label: '+35%' },
];

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b'];

export default function EngagementBarChart() {
  return (
    <div className="animate-fade-in-right">
      <h3 className="text-xl font-semibold mb-4 text-center">Engagement Communautaire</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={engagementData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                borderColor: '#4b5563',
                borderRadius: '0.75rem'
              }}
              cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
              formatter={(value, name, props) => [props.payload.label, name]}
            />
            <Bar dataKey="value" fill="#8884d8">
              {engagementData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}