import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#022550]/80 to-[#ec520b]/80">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-[#022550] text-center">Iniciar sesión</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-[#ec520b] focus:ring-[#ec520b]"
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-label="Correo electrónico"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-[#ec520b] focus:ring-[#ec520b]"
            value={password}
            onChange={e => setPassword(e.target.value)}
            aria-label="Contraseña"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-[#022550] to-[#ec520b] text-white font-semibold rounded hover:from-[#ec520b] hover:to-[#022550] transition-all"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
