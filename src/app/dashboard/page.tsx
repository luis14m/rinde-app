import { redirect } from 'next/navigation';
import React from 'react'

import { getUserAndProfile } from './actions';

export default async function Dashboard() {
  const { user, profile } = await getUserAndProfile();

  if (!user || !profile) {
    redirect('/auth/login');
  }

  if (!profile.is_admin) {
    redirect('/auth/login'); // O puedes redirigir a una página de acceso denegado
  }

  return (
    <div>Dashboard</div>
  );
}

