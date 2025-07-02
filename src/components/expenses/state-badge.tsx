'use client';
import React from 'react';
import { Clock, CircleCheckBig, CircleX } from 'lucide-react';
import { Badge } from "@/components/ui/badge"

interface StateBadgeProps {
  estado: string;
}

export default function StateBadge({ estado }: StateBadgeProps) {
  const getStateConfig = () => {
    switch (estado) {
      case 'Pendiente':
        return {
          icon: <Clock className="inline w-4 h-4 mr-1" />,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
          text: 'Pendiente'
        };
      case 'Aprobado':
        return {
          icon: <CircleCheckBig className="inline w-4 h-4 mr-1" />,
          className: 'bg-green-100 text-green-800 hover:bg-green-100',
          text: 'Aprobado'
        };
      case 'Rechazado':
        return {
          icon: <CircleX className="inline w-4 h-4 mr-1" />,
          className: 'bg-red-100 text-red-800 hover:bg-red-100',
          text: 'Rechazado'
        };
      default:
        return {
          icon: null,
          className: 'bg-gray-100 text-gray-800',
          text: estado
        };
    }
  };

  const { icon, className, text } = getStateConfig();

  return (
    <Badge
      variant="secondary"
      className={`inline-flex items-center ${className}`}
    >
      {icon}
      {text}
    </Badge>
  );
}
