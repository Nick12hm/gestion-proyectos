'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';


function Sidebar() {
    const router = useRouter();

    const handleLogout = () => {
        // Aquí iría la lógica para cerrar sesión
        router.push('/auth/login');
    };

    return (
        <aside className="w-64 bg-gray-800 text-white h-screen p-4">
        <nav>
            <ul className="space-y-4">
            <li>
                <Link href="/dashboard">Inicio </Link>
            </li>
            <li>
                <Link href="/projects">Proyectos</Link>
            </li>
            <li>
                <Link href="/users">Usuarios</Link>
            </li>
            <li>
                <button onClick={handleLogout} className="block w-full text-left rounded hover:bg-gray-700">Cerrar sesión</button>
            </li>
            </ul>
        </nav>
    </aside>
    )
}

export default Sidebar