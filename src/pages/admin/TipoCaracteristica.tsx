import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface TipoCaracteristica {
  id: number;
  nombre: string;
}

const TipoCaracteristicaPage: React.FC = () => {
  const [tipos, setTipos] = useState<TipoCaracteristica[]>([]);
  const [nombre, setNombre] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const getTipos = async () => {
      try {
        const res = await axios.get(`${API_URL}/tipos-caracteristica`);
        setTipos(res.data.data || []);
      } catch {
        showToast('Error al cargar tipos de característica', 'error');
      }
    };
    getTipos();
  }, [showToast]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    try {
      await axios.post(`${API_URL}/tipos-caracteristica`, { nombre });
      setNombre('');
      showToast('Tipo de característica creado', 'success');
      const res = await axios.get(`${API_URL}/tipos-caracteristica`);
      setTipos(res.data.data || []);
    } catch {
      showToast('Error al crear tipo de característica', 'error');
    }
  };

  const handleEdit = async (id: number, nombre: string) => {
    try {
      await axios.put(`${API_URL}/tipos-caracteristica/${id}`, { nombre });
      showToast('Tipo de característica actualizado', 'success');
      const res = await axios.get(`${API_URL}/tipos-caracteristica`);
      setTipos(res.data.data || []);
    } catch {
      showToast('Error al editar tipo de característica', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este tipo de característica?')) return;
    try {
      await axios.delete(`${API_URL}/tipos-caracteristica/${id}`);
      showToast('Tipo de característica eliminado', 'success');
      setTipos(tipos.filter(t => t.id !== id));
    } catch {
      showToast('Error al eliminar tipo de característica', 'error');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#022550]">Tipos de Característica</h2>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="border rounded px-3 py-2 focus:border-[#ec520b] focus:ring-[#ec520b]"
          placeholder="Nuevo tipo de característica"
        />
        <button type="submit" className="bg-[#ec520b] text-white px-4 py-2 rounded hover:bg-[#ff6b1a] transition">Agregar</button>
      </form>
      <ul className="bg-white rounded shadow divide-y">
        {tipos.map(tipo => (
          <li key={tipo.id} className="px-4 py-2 flex items-center justify-between gap-2">
            <input
              type="text"
              value={tipo.nombre}
              onChange={e => handleEdit(tipo.id, e.target.value)}
              className="border rounded px-2 py-1 w-2/3 focus:border-[#ec520b]"
            />
            <button onClick={() => handleDelete(tipo.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TipoCaracteristicaPage;
