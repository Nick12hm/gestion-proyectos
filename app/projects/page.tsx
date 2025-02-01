'use client'
import { useEffect, useState  } from 'react';
import { useForm } from 'react-hook-form';
import { getData, putData, postData, deleteData } from '@/app/services/apiService';
import { RUTAS } from "../rutas/rutas";
import  Layout  from "@/app/components/layout";


/**
 * Interfaces de datos manejados en la aplicación
 */
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

interface ProjectFormData {
  nombre: string;
  descripcion: string;
  administrador_id: string | number | undefined; 
  lectorId: string | number | undefined ;
}

type ProjectCardProps = {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
};

/**
 * Esta función permite consultar la data y responder a las funcionalidades del crud de proyectos
 */
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
  
  const handleSaveProject = async (data: ProjectFormData) => {
    try {
      const {lectorId, ...dataSend}  = data;
      if (currentProject) {
        // Actualizar proyecto existente
        await putData(`${rutas.proyectos.update}${currentProject.id}`, dataSend);
      } else {
        // Crear nuevo proyecto
        await postData(rutas.proyectos.create, dataSend);
      }

      if(lectorId){
        console.log('se registra nuevo dato en asociasión de usuarios - proyectos');
                
      }
      // Refrescar la lista de proyectos
      const updatedProjects = await getData(rutas.proyectos.getAll);
      setProjects(updatedProjects);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving project', error);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      await deleteData(`${rutas.proyectos.delete}${projectId}`);
      // Refrescar la lista de proyectos
      const updatedProjects = await getData(rutas.proyectos.getAll);
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error deleting project', error);
    }
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
            <ProjectCard key={project.id} project={project} onEdit={handleEdit} onDelete = {handleDeleteProject}/>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <ProjectModal project={currentProject} onClose={handleCloseModal} onSave={handleSaveProject} />
      )}
    </Layout>  
  );
} 

/**
 * Esta función crea Cards dinámicamente para mostrar la información de los proyectos
 * @param onEdit Permite abrir modal de registro con Id de dato 
 * @param onDelete Borrar información
 * @returns Vialización de proyectos
 */
function ProjectCard({ project, onEdit, onDelete  }: ProjectCardProps) {
  const handleEdit = () => {
    onEdit(project);
  };

  const handleDelete = () => {
    onDelete(project.id);
  };

  return (
    <div className="border p-4 rounded shadow bg-gray-200">
      <h2 className="text-xl font-bold">{project.nombre}</h2>
      <p>{project.descripcion}</p>
      <p className="text-sm text-gray-500">Fecha de creación: {new Date(project.fecha_creacion).toLocaleDateString()}</p>
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

/**
 * Crea un modal de formaralio para editar o eliminar información
 * @param project Información con la que se  va a trabajar
 * @param onClose Función para cerrar modal
 * @param onSave Función para guardar información y emitir 
 * @returns onSave Con data registrada o editada
 */

function ProjectModal({ project, onClose, onSave }: { project: Project | null; onClose: () => void; onSave: (data:ProjectFormData ) => void }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      nombre: project ? project.nombre : '',
      descripcion: project ? project.descripcion : '',
      administrador_id: project ? project.administrador_id : '',
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
        administrador_id: project.administrador_id,
        lectorId: project.lector_id,
      });
    }
  }, [project, reset, isLoading]);

  const onSubmit = (data: ProjectFormData) => {

    onSave(data);
  };

  if (isLoading) {
    return <div>Cargando...</div>; 
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
            <label className="block text-gray-700">Administrador *</label>
            <select {...register('administrador_id', { required: true })} className="w-full p-2 border rounded">
              <option value="">Selecciona un administrador</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>{admin.nombre}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Colaboradores</label>
            <select {...register('lectorId')} className="w-full p-2 border rounded">
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