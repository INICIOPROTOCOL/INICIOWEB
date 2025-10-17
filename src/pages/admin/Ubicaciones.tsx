import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Ubicacion {
  id: number;
  pais: string;
  provincia: string;
  ciudad: string;
  barrio?: string;
  codigo_postal?: string;
}

interface UbicacionForm {
  pais: string;
  provincia: string;
  ciudad: string;
  barrio: string;
  codigo_postal: string;
}

const Ubicaciones: React.FC = () => {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { showToast } = useToast();

  const [form, setForm] = useState<UbicacionForm>({
    pais: 'Argentina',
    provincia: 'Córdoba',
    ciudad: '',
    barrio: '',
    codigo_postal: ''
  });

  // Cargar ubicaciones
  useEffect(() => {
    const loadUbicaciones = async () => {
      setLoadingData(true);
      try {
        const response = await axios.get(`${API_URL}/ubicaciones`);
        setUbicaciones(response.data || []);
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error);
        showToast('Error al cargar ubicaciones', 'error');
        setUbicaciones([]);
      }
      setLoadingData(false);
    };
    loadUbicaciones();
  }, [showToast]);

  // Limpiar formulario
  const resetForm = () => {
    setForm({
      pais: 'Argentina',
      provincia: 'Córdoba',
      ciudad: '',
      barrio: '',
      codigo_postal: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Manejar cambios en inputs
  const handleInputChange = (field: keyof UbicacionForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Crear o actualizar ubicación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.ciudad.trim()) {
      showToast('La ciudad es requerida', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        pais: form.pais.trim(),
        provincia: form.provincia.trim(),
        ciudad: form.ciudad.trim(),
        barrio: form.barrio.trim() || null,
        codigo_postal: form.codigo_postal.trim() || null
      };

      if (editingId) {
        // Actualizar país, provincia, ciudad y barrio
        const updatePayload = {
          pais: payload.pais,
          provincia: payload.provincia,
          ciudad: payload.ciudad,
          barrio: payload.barrio,
          codigo_postal: payload.codigo_postal
        };
        const response = await axios.put(`${API_URL}/ubicaciones/${editingId}`, updatePayload);
        showToast('Ubicación actualizada exitosamente', 'success');
      } else {
        // Crear nueva ubicación completa
        console.log('[POST] Crear ubicación:', {
          url: `${API_URL}/ubicaciones`,
          payload
        });
        const response = await axios.post(`${API_URL}/ubicaciones`, payload);
        console.log('[POST] Respuesta backend:', response);
        setUbicaciones(prev => [...prev, response.data]);
        showToast('Ubicación creada exitosamente', 'success');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error al guardar ubicación:', error);
      if (error?.response) {
        console.error('Backend response:', error.response.data);
        showToast(error.response.data?.message || 'Error al guardar ubicación', 'error');
      } else {
        showToast('Error al guardar ubicación', 'error');
      }
    }
    setLoading(false);
  };

  // Editar ubicación (solo ciudad y barrio)
  const handleEdit = (ubicacion: Ubicacion) => {
    setForm({
      pais: ubicacion.pais,
      provincia: ubicacion.provincia,
      ciudad: ubicacion.ciudad,
      barrio: ubicacion.barrio || '',
      codigo_postal: ubicacion.codigo_postal || ''
    });
    setEditingId(ubicacion.id);
    setShowForm(true);
  };

  // Eliminar ubicación
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta ubicación?')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/ubicaciones/${id}`);
      setUbicaciones(prev => prev.filter(ubicacion => ubicacion.id !== id));
      showToast('Ubicación eliminada exitosamente', 'success');
    } catch (error) {
      console.error('Error al eliminar ubicación:', error);
      showToast('Error al eliminar ubicación', 'error');
    }
    setLoading(false);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#022550]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#022550] flex items-center">
            <MapPin className="h-7 w-7 mr-3 text-[#ec520b]" />
            Ubicaciones
          </h1>
          <p className="text-gray-600 mt-1">Administra las ubicaciones de las propiedades</p>
        </div>
        
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#ec520b] hover:bg-[#ff6b1a] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Ubicación
          </Button>
        )}
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-[#022550]">
              {editingId ? 'Editar Ubicación' : 'Nueva Ubicación'}
            </CardTitle>
            {editingId && (
              <p className="text-sm text-gray-600">
                Solo puedes editar la ciudad y el barrio. País y provincia son fijos.
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pais">País</Label>
                  <Input
                    id="pais"
                    type="text"
                    value={form.pais}
                    onChange={(e) => handleInputChange('pais', e.target.value)}
                    disabled={editingId !== null}
                    className={editingId ? 'bg-gray-100' : ''}
                  />
                </div>
                
                <div>
                  <Label htmlFor="provincia">Provincia</Label>
                  <Input
                    id="provincia"
                    type="text"
                    value={form.provincia}
                    onChange={(e) => handleInputChange('provincia', e.target.value)}
                    disabled={editingId !== null}
                    className={editingId ? 'bg-gray-100' : ''}
                  />
                </div>
                
                <div>
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Input
                    id="ciudad"
                    type="text"
                    value={form.ciudad}
                    onChange={(e) => handleInputChange('ciudad', e.target.value)}
                    placeholder="Ej: Villa Allende, Córdoba Capital..."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="barrio">Barrio</Label>
                  <Input
                    id="barrio"
                    type="text"
                    value={form.barrio}
                    onChange={(e) => handleInputChange('barrio', e.target.value)}
                    placeholder="Ej: Centro, Barrio Norte..."
                  />
                </div>
                
                {!editingId && (
                  <div className="md:col-span-2">
                    <Label htmlFor="codigo_postal">Código Postal</Label>
                    <Input
                      id="codigo_postal"
                      type="text"
                      value={form.codigo_postal}
                      onChange={(e) => handleInputChange('codigo_postal', e.target.value)}
                      placeholder="Ej: 5000, X5105..."
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline" onClick={resetForm} type="button">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-[#022550] to-[#033366] hover:from-[#033366] hover:to-[#044477] text-white"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {editingId ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {ubicaciones.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay ubicaciones registradas
                </h3>
                <p className="text-gray-500 mb-4">
                  Comienza creando la primera ubicación.
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-[#ec520b] to-[#ff6b1a] hover:from-[#d64807] hover:to-[#ec520b] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Ubicación
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {(Array.isArray(ubicaciones) ? ubicaciones : []).map(ubicacion => (
                <div 
                  key={ubicacion.id} 
                  className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-[#ec520b]/30 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[#022550] truncate">
                        {ubicacion.ciudad}
                      </h3>
                      {ubicacion.barrio && (
                        <p className="text-sm text-gray-600 truncate">{ubicacion.barrio}</p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(ubicacion)}
                        className="h-8 w-8 p-0 text-[#022550] hover:bg-[#022550] hover:text-white"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(ubicacion.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-2 text-[#ec520b] flex-shrink-0" />
                      <span className="truncate">{ubicacion.provincia}, {ubicacion.pais}</span>
                    </div>
                    {ubicacion.codigo_postal && (
                      <p className="text-xs text-gray-500 ml-5">CP: {ubicacion.codigo_postal}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Ubicaciones;
