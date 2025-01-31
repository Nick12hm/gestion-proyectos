'use client'
import { RUTAS } from "../rutas/rutas";

import { useEffect, useState } from 'react';
import { getData } from '@/app/services/apiService';
import  Layout  from "@/app/components/layout";

function Users() {
  const [users, setUsers] = useState([]);
  const rutas = RUTAS;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getData(rutas.usuarios.getAll);        
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, []);
  console.log(users);
  
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      {/* Aquí puedes agregar la lógica para gestionar usuarios */}
    </Layout>
  )
}

export default Users