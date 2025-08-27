import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#022550] text-white flex flex-col py-6 px-4 hidden md:flex">
        <div className="mb-8 text-2xl font-bold tracking-wide">INICIO CMS</div>
        <nav className="flex-1 space-y-2">
          <Link to="/admin" className="block py-2 px-3 rounded hover:bg-[#ec520b] transition">Dashboard</Link>
          <Link to="/admin/propiedades" className="block py-2 px-3 rounded hover:bg-[#ec520b] transition">Propiedades</Link>
          <Link to="/admin/contactos" className="block py-2 px-3 rounded hover:bg-[#ec520b] transition">Contactos</Link>
          <Link to="/admin/citas" className="block py-2 px-3 rounded hover:bg-[#ec520b] transition">Citas</Link>
          <Link to="/admin/tipos" className="block py-2 px-3 rounded hover:bg-[#ec520b] transition">Tipos de Propiedad</Link>
          <Link to="/admin/tipos-operacion" className="block py-2 px-3 rounded hover:bg-[#ec520b] transition">Tipos de Operación</Link>
          <Link to="/admin/ubicaciones" className="block py-2 px-3 rounded hover:bg-[#ec520b] transition">Ubicaciones</Link>
          <Link to="/admin/caracteristicas" className="block py-2 px-3 rounded hover:bg-[#ec520b] transition">Características</Link>
          {/* Solo admin: usuarios */}
          {/* <Link to="/admin/usuarios" className="block py-2 px-3 rounded hover:bg-[#ec520b] transition">Usuarios</Link> */}
        </nav>
        <button
          onClick={logout}
          className="mt-8 py-2 px-4 bg-[#ec520b] rounded text-white font-semibold hover:bg-[#ff6b1a] transition"
        >
          Cerrar sesión
        </button>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="bg-white shadow flex items-center justify-between px-4 py-3 sticky top-0 z-10">
          <div className="font-bold text-[#022550] text-lg">Panel de Administración</div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{user?.email}</span>
            <button onClick={logout} className="py-1 px-3 bg-[#ec520b] rounded text-white hover:bg-[#ff6b1a] transition">Salir</button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
