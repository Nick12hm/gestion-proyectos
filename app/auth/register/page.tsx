'use client'

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = handleSubmit((data) => {
    console.log('Form data', data);
    // Aquí iría la lógica para registrar al usuario
    router.push('/login'); // Redirigir a la página de login después de registrarse
  });
  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" {...register('name', { required: 'Requerido' })} />
          {errors.name && typeof errors.name.message === 'string' && <div>{errors.name.message}</div>}
        </div>
        <div>
          <label>Email:</label>
          <input type="email" {...register('email', { required: 'Requerido' })} />
          {errors.email && typeof errors.email.message === 'string' && <div>{errors.email.message}</div>}
        </div>
        <div>
          <label>Password:</label>
          <input type="password" {...register('password', { required: 'Requerido' })} />
          {errors.password && typeof errors.password.message === 'string' && <div>{errors.password.message}</div>}
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Ya tienes una cuenta? <a href="/auth/login">Inicia sesión aquí</a></p>
    </div>
  )
}

export default RegisterPage