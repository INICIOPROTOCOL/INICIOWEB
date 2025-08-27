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
import { Textarea } from '@/components/ui/textarea';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface TipoPropiedad {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface TipoPropiedadForm {
  nombre: string;
  descripcion: string;
}

const TiposPropiedad: React.FC = () => {
  const [tipos, setTipos] = useState<TipoPropiedad[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { showToast } = useToast();

  const [form, setForm] = useState<TipoPropiedadForm>({
    nombre: '',
    descripcion: ''
  });

  // Cargar tipos de propiedad
  useEffect(() => {
    const loadTipos = async () => {
      setLoadingData(true);
      try {
        const response = await axios.get(`${API_URL}/tipos`);
        setTipos(response.data || []);
        console.log('📦 Tipos de propiedad cargados:', response.data?.length || 0);
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
      nombre: '',
      descripcion: ''
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
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null
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
      nombre: tipo.nombre,
      descripcion: tipo.descripcion || ''
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#022550] flex items-center">
            <Home className="h-8 w-8 mr-3" />
            Tipos de Propiedad
          </h1>
          <p className="text-gray-600 mt-2">Administra los tipos de propiedades disponibles</p>
        </div>
        
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-[#ec520b] to-[#ff6b1a] hover:from-[#d64807] hover:to-[#ec520b] text-white"
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
              
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={form.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  placeholder="Descripción opcional del tipo de propiedad..."
                  rows={3}
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
        <div className="grid gap-4">
          {tipos.length === 0 ? (
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
                  className="bg-gradient-to-r from-[#ec520b] to-[#ff6b1a] hover:from-[#d64807] hover:to-[#ec520b] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Tipo
                </Button>
              </CardContent>
            </Card>
          ) : (
            tipos.map(tipo => (
              <Card key={tipo.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#022550] mb-2">
                        {tipo.nombre}
                      </h3>
                      {tipo.descripcion && (
                        <p className="text-gray-600 mb-4">{tipo.descripcion}</p>
                      )}
                      <div className="text-sm text-gray-500">
                        ID: {tipo.id}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(tipo)}
                        className="text-[#022550] border-[#022550] hover:bg-[#022550] hover:text-white"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(tipo.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TiposPropiedad;
