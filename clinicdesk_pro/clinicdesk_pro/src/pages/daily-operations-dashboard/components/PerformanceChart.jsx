import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';

const PerformanceChart = ({ 
  data, 
  title, 
  type = 'line', 
  dataKey, 
  color = '#2563EB',
  unit = '',
  onViewDetails 
}) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-medium p-3">
          <p className="text-sm font-medium text-popover-foreground mb-1">{label}</p>
          <p className="text-sm text-muted-foreground">
            {`${payload?.[0]?.value}${unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatYAxisTick = (value) => {
    if (value >= 1000) {
      return `${(value / 1000)?.toFixed(1)}k`;
    }
    return value;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 min-h-[320px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">Last 7 days</p>
          </div>
        </div>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <Icon name="ExternalLink" size={16} />
          </button>
        )}
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxisTick}
              />
              <Tooltip content={<CustomTooltip active={true} payload={[]} label="" />} />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxisTick}
              />
              <Tooltip content={<CustomTooltip active={true} payload={[]} label="" />} />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Average</span>
            <p className="font-semibold text-foreground">
              {Math.round(data?.reduce((sum, item) => sum + item?.[dataKey], 0) / data?.length)}{unit}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Peak</span>
            <p className="font-semibold text-foreground">
              {Math.max(...data?.map(item => item?.[dataKey]))}{unit}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Trend</span>
            <div className="flex items-center space-x-1">
              <Icon name="TrendingUp" size={14} className="text-success" />
              <span className="font-semibold text-success">+12%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;