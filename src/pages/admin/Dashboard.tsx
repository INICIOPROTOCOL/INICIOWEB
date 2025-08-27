import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Dashboard: React.FC = () => {
  const [total, setTotal] = useState(0);
  const [enVenta, setEnVenta] = useState(0);
  const [enAlquiler, setEnAlquiler] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/propiedades`);
        const propiedades = res.data.data || [];
        setTotal(propiedades.length);
        setEnVenta(propiedades.filter((p: any) => p.operaciones_propiedad?.some((op: any) => op.tipo_operacion?.nombre === 'venta')).length);
        setEnAlquiler(propiedades.filter((p: any) => p.operaciones_propiedad?.some((op: any) => op.tipo_operacion?.nombre === 'alquiler')).length);
      } catch {
        setTotal(0);
        setEnVenta(0);
        setEnAlquiler(0);
      }
      setLoading(false);
    };
    getData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#022550]">Dashboard</h2>
      {loading ? (
        <div className="text-gray-500">Cargando métricas...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl font-bold text-[#ec520b]">{total}</div>
            <div className="text-gray-700 mt-2">Propiedades totales</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl font-bold text-[#022550]">{enVenta}</div>
            <div className="text-gray-700 mt-2">En venta</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl font-bold text-[#022550]">{enAlquiler}</div>
            <div className="text-gray-700 mt-2">En alquiler</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
