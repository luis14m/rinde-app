'use client';
import React from 'react';
import { Clock, CircleCheckBig, CircleX } from 'lucide-react';

interface StateLabelProps {
  estado: string;
}

export default function StateLabel({ estado }: StateLabelProps) {
  let icon = null;
  if (estado === "Pendiente") {
    icon = <Clock className="inline w-4 h-4 mr-1 align-middle" />;
  } else if (estado === "Aprobado") {
    icon = <CircleCheckBig className="inline w-4 h-4 mr-1 align-middle" />;
  } else if (estado === "Rechazado") {
    icon = <CircleX className="inline w-4 h-4 mr-1 align-middle" />;
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded max-w-max px-2 py-1 ${
        estado === "Pendiente"
          ? "bg-yellow-200 text-yellow-800"
          : estado === "Aprobado"
          ? "bg-green-200 text-green-800"
          : estado === "Rechazado"
          ? "bg-red-200 text-red-800"
          : ""
      }`}
    >
      {icon}
      <span className="truncate">{estado}</span>
    </span>
  );
}


 
 
 