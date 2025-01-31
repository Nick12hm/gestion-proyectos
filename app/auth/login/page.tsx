'use client'

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../services/apiService';
import Cookies from 'js-cookie';

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const onSubmit = handleSubmit  (async data => {
        try {
            const response = await loginUser(data.email, data.password);
            Cookies.set('auth-token', response.access_token); // Guardar el token en cookies
            router.push('../dashboard');

        } catch (error) {
            console.error('Error al logearse: ',error);
        }
      });
    return (
        <div className ="flex items-center justify-center min-h-screen bg-gray-900">
            <div className ="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded shadow-md">
                <h1 className ="text-2xl font-bold text-center text-white">Bienvenido</h1>
                <form onSubmit={onSubmit} className ="space-y-4">
                <div>
                    <label className ="block text-sm font-medium text-gray-300">Email:</label>
                    <input
                    type="email"
                    {...register('email', { required: 'Requerido' })}
                    className ="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                    />
                    {errors.email && typeof errors.email.message === 'string' && (
                    <div className ="mt-1 text-sm text-red-400">{errors.email.message}</div>
                    )}
                </div>
                <div>
                    <label className ="block text-sm font-medium text-gray-300">Password:</label>
                    <input
                    type="password"
                    {...register('password', { required: 'Requerido' })}
                    className ="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                    />
                    {errors.password && typeof errors.password.message === 'string' && (
                    <div className ="mt-1 text-sm text-red-400">{errors.password.message}</div>
                    )}
                </div>
                <button
                    type="submit"
                    className ="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-500"
                >
                    Login
                </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage