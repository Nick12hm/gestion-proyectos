'use client'
import { RUTAS } from "../rutas/rutas";
import { useEffect, useState } from 'react';
import Layout from '@/app/components/layout';
import { getData  } from "@/app/services/apiService";

// Definir un tipo básico para los proyectos
type Project = {
  id: number; 
  nombre: string; 
  descripcion:string;
  fecha_creacion: string;
  adminNombre:string;
};
const DashboardMain = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const rutas = RUTAS;
    useEffect(() => {
      const fetchProjects = async () => {
        try {          
          const data = await getData(rutas.proyectos.Filter);          
          setProjects(data.slice(0, 3)); // Obtener los tres últimos proyectos
        } catch (error) {
          console.error('Error fetching projects', error);
        }
      };
  
      fetchProjects();
    }, [rutas.proyectos.Filter]);

  return (
    <div className="flex  bg-gray-200">
      <Layout>
        <main className="flex-1 p-6 ">
          <h1 className="text-2xl font-bold mb-4">Bienvenido al Dashboard</h1>
          <h2 className="text-xl font-semibold mb-2">Últimos Proyectos añadidos</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <li key={project.id} className="p-4 bg-white rounded shadow">
                <h2 className="text-lg font-bold">{project.nombre}</h2>
                <p className="text-gray-600">{project.descripcion}</p>
                <p className="text-sm  text-gray-500">Fecha de creación: {new Date(project.fecha_creacion).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Administrador: {project.adminNombre}</p>
              </li>
            ))}
          </ul>
        </main>
      </Layout>

    </div>
  );
};

export default DashboardMain;