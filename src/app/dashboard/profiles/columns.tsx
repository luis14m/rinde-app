// columns.tsx
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Profile } from "@/types/profiles";

export function getColumns(onView: (profile: Profile) => void): ColumnDef<Profile>[] {
  return [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "created_at",
      header: "Fecha de creación",
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => onView(row.original)}
        >
          <span className="sr-only">Ver detalles</span>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}