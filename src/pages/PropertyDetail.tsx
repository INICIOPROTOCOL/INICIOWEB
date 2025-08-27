import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PropertyDetail = () => {
  const { id } = useParams();
  const [propiedad, setPropiedad] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOne = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/propiedades/${id}`);
        setPropiedad(res.data);
      } catch {
        setPropiedad(null);
      }
      setLoading(false);
    };
    fetchOne();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-40"><span className="animate-spin h-8 w-8 border-4 border-[#ec520b] border-t-transparent rounded-full inline-block" /></div>;
  if (!propiedad) return <div className="text-center text-gray-500">Propiedad no encontrada</div>;

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#022550] mb-4">{propiedad.titulo}</h1>
      {/* Galería de imágenes, info completa, características, ubicación, etc. */}
      <div className="mb-6">
        <img src={propiedad.imagenes_propiedad?.[0]?.url_imagen || '/placeholder.svg'} alt={propiedad.titulo} className="w-full h-72 object-cover rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="text-lg font-semibold mb-2">Descripción</div>
          <div className="text-gray-700 whitespace-pre-line">{propiedad.descripcion}</div>
        </div>
        <div>
          <div className="text-lg font-semibold mb-2">Características</div>
          <ul className="list-disc pl-5 text-gray-700">
            {propiedad.caracteristicas?.map((c: any) => <li key={c.id}>{c.nombre}</li>)}
          </ul>
        </div>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Ubicación</div>
        <div className="text-gray-700">{propiedad.ubicaciones?.ciudad}, {propiedad.ubicaciones?.provincia}</div>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Info adicional</div>
        <div className="text-gray-700 whitespace-pre-line">{propiedad.info_adicional}</div>
      </div>
    </section>
  );
};

export default PropertyDetail;
