// page.tsx
import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { Profile } from "@/types/profiles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfiles } from "./actions";
// ...otros imports

export default function ProfilePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = await getProfiles();
      setProfiles(profiles || []);
    };
    fetchProfiles();
  }, []);

  const columns = getColumns(setSelected);

  return (
    <div className="flex gap-6">
      {/* Card de tabla de usuarios */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={profiles} />
        </CardContent>
      </Card>
      {/* Card de detalle */}
      <Card className="flex-1 min-w-[300px]">
        <CardHeader>
          <CardTitle>Detalle del usuario</CardTitle>
        </CardHeader>
        <CardContent>
          {selected ? (
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Nombre: </span>{selected.name}
              </div>
              <div>
                <span className="font-semibold">Email: </span>{selected.email}
              </div>
              <div>
                <span className="font-semibold">Fecha de creación: </span>{selected.created_at}
              </div>
              {/* Agrega más campos si es necesario */}
            </div>
          ) : (
            <div className="text-muted-foreground">Selecciona un usuario para ver el detalle.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}