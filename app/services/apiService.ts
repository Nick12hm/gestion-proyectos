import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3004'; // Reemplaza con la URL de tu API

const getAuthToken = () => {
    const gre = Cookies.get('auth-token');
    return gre;
};

export const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Error en la autenticación');
    }

    return response.json();
};

export const getData = async (complemento: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}${complemento}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener los proyectos');
    }

    return response.json();
};

// export const getUsers = async () => {
//     const token = getAuthToken();
//     const response = await fetch(`${API_URL}/users`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });

//     if (!response.ok) {
//         throw new Error('Error al obtener los usuarios');
//     }

//     return response.json();
// };