import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  gradient,
  description
}) => {
  return (
    <Card className={`${gradient} border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-medium opacity-90">
          {title}
          <Icon className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {description && (
          <p className="text-xs opacity-80">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;