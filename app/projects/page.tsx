'use client'
import { useEffect, useState  } from 'react';
import { useForm } from 'react-hook-form';
import { getData } from '@/app/services/apiService';
import { RUTAS } from "../rutas/rutas";
import  Layout  from "@/app/components/layout";

interface Project {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_creacion:string;
  adminNombre:string;
  administrador_id?: number;
  lector_id?: number;
}

interface User {
  id: number;
  nombre: string;
}

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const rutas = RUTAS;

  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getData(rutas.proyectos.getAll);
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects', error);
      }
    };

    fetchProjects();
  }, [rutas.proyectos.getAll]);

  const handleCreate = () => {
    setCurrentProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
  };
   
  return (
    <Layout>
       <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Proyectos</h1>
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Crear Proyecto
        </button>
      </div>
      <div className="overflow-auto max-h-[80vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onEdit={handleEdit} />
          ))}
        </div>
      </div>
      {isModalOpen && (
        <ProjectModal project={currentProject} onClose={handleCloseModal} />
      )}
    </Layout>  )
} 

type ProjectCardProps = {
  project: Project;
  onEdit: (project: Project) => void;
};

function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const handleEdit = () => {
    onEdit(project);
  };

  const handleDelete = () => {
    // Lógica para eliminar el proyecto
    console.log('Eliminar proyecto:', project.id);
  };

  return (
    <div className="border p-4 rounded shadow  bg-gray-200">
      <h2 className="text-xl font-bold">{project.nombre}</h2>
      <p>{project.descripcion}</p>
      <p className="text-sm  text-gray-500">Fecha de creación: {new Date(project.fecha_creacion).toLocaleDateString()}</p>
      <p className="text-sm text-gray-500">Administrador: {project.adminNombre}</p>
      <div className="mt-4 flex justify-between">
      <button
          onClick={handleEdit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      nombre: project ? project.nombre : '',
      descripcion: project ? project.descripcion : '',
      adminId: project ? project.administrador_id : '',
      lectorId: project ? project.lector_id : '',
    },
  });

  const [admins, setAdmins] = useState<User[]>([]);
  const [lectores, setLectores] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const adminData = await getData(RUTAS.usuarios.getUsersAdm); 
        const lectorData = await getData(RUTAS.usuarios.getUsersreed); 
        setAdmins(adminData);
        setLectores(lectorData);
        setIsLoading(false); // Datos cargados, ya no está cargando
      } catch (error) {
        console.error('Error fetching users', error);
        setIsLoading(false); // En caso de error, también dejamos de cargar

      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!isLoading && project) {
      reset({
        nombre: project.nombre,
        descripcion: project.descripcion,
        adminId: project.administrador_id,
        lectorId: project.lector_id,
      });
    }
  }, [project, reset, isLoading]);

  const onSubmit = (data: { nombre: string; descripcion: string; adminId: number; lectorId: number }) => {
    // Lógica para crear o actualizar el proyecto
    console.log('Guardar proyecto:', data);
    onClose();
  };

  if (isLoading) {
    return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
  }
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">{project ? 'Editar Proyecto' : 'Crear Proyecto'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              {...register('nombre', { required: true })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Descripción</label>
            <textarea
              {...register('descripcion', { required: true })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Administrador</label>
            <select {...register('adminId', { required: true })} className="w-full p-2 border rounded">
              <option value="">Selecciona un administrador</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>{admin.nombre}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Colaboradores</label>
            <select {...register('lectorId', { required: true })} className="w-full p-2 border rounded">
              <option value="">Selecciona un lector</option>
              {lectores.map((lector) => (
                <option key={lector.id} value={lector.id}>{lector.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Projects