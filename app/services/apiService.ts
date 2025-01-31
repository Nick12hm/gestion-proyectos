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

export const putData = async (url: string, data: object) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}${url}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al actualizar los datos');
    }

    return response.json();
};

export const postData = async (url: string, data: object) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al registrar los datos');
    }

    return response.json();
};

export const deleteData = async (url: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}${url}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Error al eliminar los datos');
    }

    return response.json();
};