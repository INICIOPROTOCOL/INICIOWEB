import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Home,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface TipoPropiedad {
  id: number;
  nombre: string;
}

interface TipoPropiedadForm {
  nombre: string;
}

const TiposPropiedad: React.FC = () => {
  const [tipos, setTipos] = useState<TipoPropiedad[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { showToast } = useToast();

  const [form, setForm] = useState<TipoPropiedadForm>({
    nombre: ''
  });

  // Cargar tipos de propiedad
  useEffect(() => {
    const loadTipos = async () => {
      setLoadingData(true);
      try {
        const response = await axios.get(`${API_URL}/tipos`);
        setTipos(response.data || []);
      } catch (error) {
        console.error('Error al cargar tipos de propiedad:', error);
        showToast('Error al cargar tipos de propiedad', 'error');
        setTipos([]);
      }
      setLoadingData(false);
    };
    loadTipos();
  }, [showToast]);

  // Limpiar formulario
  const resetForm = () => {
    setForm({
      nombre: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Manejar cambios en inputs
  const handleInputChange = (field: keyof TipoPropiedadForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Crear o actualizar tipo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.nombre.trim()) {
      showToast('El nombre es requerido', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nombre: form.nombre.trim()
      };

      if (editingId) {
        // Actualizar
        await axios.put(`${API_URL}/tipos/${editingId}`, payload);
        setTipos(prev => prev.map(tipo => 
          tipo.id === editingId ? { ...tipo, ...payload } : tipo
        ));
        showToast('Tipo de propiedad actualizado exitosamente', 'success');
      } else {
        // Crear
        const response = await axios.post(`${API_URL}/tipos`, payload);
        setTipos(prev => [...prev, response.data]);
        showToast('Tipo de propiedad creado exitosamente', 'success');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error al guardar tipo de propiedad:', error);
      showToast('Error al guardar tipo de propiedad', 'error');
    }
    setLoading(false);
  };

  // Editar tipo
  const handleEdit = (tipo: TipoPropiedad) => {
    setForm({
      nombre: tipo.nombre
    });
    setEditingId(tipo.id);
    setShowForm(true);
  };

  // Eliminar tipo
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este tipo de propiedad?')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/tipos/${id}`);
      setTipos(prev => prev.filter(tipo => tipo.id !== id));
      showToast('Tipo de propiedad eliminado exitosamente', 'success');
    } catch (error) {
      console.error('Error al eliminar tipo de propiedad:', error);
      showToast('Error al eliminar tipo de propiedad', 'error');
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
            <Home className="h-7 w-7 mr-3 text-[#ec520b]" />
            Tipos de Propiedad
          </h1>
          <p className="text-gray-600 mt-1">Administra los tipos de propiedades disponibles</p>
        </div>
        
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#ec520b] hover:bg-[#ff6b1a] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Tipo
          </Button>
        )}
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-[#022550]">
              {editingId ? 'Editar Tipo de Propiedad' : 'Nuevo Tipo de Propiedad'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  placeholder="Ej: Casa, Departamento, Oficina..."
                  required
                />
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
        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tipos.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-8 text-center">
                  <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay tipos de propiedad registrados
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Comienza creando el primer tipo de propiedad.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-[#ec520b] hover:bg-[#ff6b1a] text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Tipo
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            (Array.isArray(tipos) ? tipos : [])
              .filter(tipo => tipo.id !== 1)
              .map(tipo => (
                <div 
                  key={tipo.id} 
                  className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-[#ec520b]/30 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[#022550] truncate">
                        {tipo.nombre}
                      </h3>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(tipo)}
                        className="h-8 w-8 p-0 text-[#022550] hover:bg-[#022550] hover:text-white"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tipo.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default TiposPropiedad;
