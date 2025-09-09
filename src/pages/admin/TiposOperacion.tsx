import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';
import { Plus, Edit2, Trash2, DollarSign, Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface TipoOperacion {
  id: number;
  nombre: string;
  descripcion?: string;
}

const TiposOperacion: React.FC = () => {
  const [tipos, setTipos] = useState<TipoOperacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const { showToast } = useToast();

  const fetchTipos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tipos-operacion`); // Usar endpoint correcto
      setTipos(response.data || []);
      console.log('📦 Tipos de operación cargados:', response.data?.length || 0);
    } catch (error) {
      console.error('Error al cargar tipos de operación:', error);
      showToast('Error al cargar tipos de operación', 'error');
    }
    setLoading(false);
  };

  // Cargar tipos de operación
  useEffect(() => {
    fetchTipos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({ nombre: '', descripcion: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) {
      showToast('El nombre es requerido', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/tipos-operacion/${editingId}`, form); // Usar endpoint correcto
        showToast('Tipo de operación actualizado correctamente', 'success');
      } else {
        await axios.post(`${API_URL}/tipos-operacion`, form); // Usar endpoint correcto
        showToast('Tipo de operación creado correctamente', 'success');
      }
      await fetchTipos();
      resetForm();
    } catch (error) {
      console.error('Error al guardar:', error);
      showToast('Error al guardar tipo de operación', 'error');
    }
    setLoading(false);
  };

  const handleEdit = (tipo: TipoOperacion) => {
    setForm({ nombre: tipo.nombre, descripcion: tipo.descripcion || '' });
    setEditingId(tipo.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este tipo de operación?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/tipos-operacion/${id}`); // Usar endpoint correcto
      showToast('Tipo de operación eliminado correctamente', 'success');
      await fetchTipos();
    } catch (error) {
      console.error('Error al eliminar:', error);
      showToast('Error al eliminar tipo de operación', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#022550] flex items-center">
            <DollarSign className="h-7 w-7 mr-3 text-[#ec520b]" />
            Tipos de Operación
          </h1>
          <p className="text-gray-600 mt-1">Gestiona los tipos de operaciones (venta, alquiler, etc.)</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#ec520b] hover:bg-[#ff6b1a] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Tipo
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <Card className="max-w-md mx-auto">
          <CardHeader className="bg-gradient-to-r from-[#ec520b]/10 to-[#022550]/10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-[#022550]">
                {editingId ? 'Editar Tipo de Operación' : 'Nuevo Tipo de Operación'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={(e) => setForm(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="ej: venta, alquiler, alquiler_temporal"
              />
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={form.descripcion}
                onChange={(e) => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Descripción del tipo de operación"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={loading}
                className="bg-[#ec520b] hover:bg-[#ff6b1a] text-white"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {editingId ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de tipos */}
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {loading && !showForm ? (
          <div className="col-span-full flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-[#ec520b]" />
            <span className="ml-2 text-gray-600">Cargando...</span>
          </div>
        ) : tipos.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <DollarSign className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay tipos de operación</h3>
                <p className="text-gray-600 text-center mb-4">
                  Comienza agregando los tipos de operación como venta, alquiler, etc.
                </p>
                <Button onClick={() => setShowForm(true)} className="bg-[#ec520b] hover:bg-[#ff6b1a] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Tipo
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          (Array.isArray(tipos) ? tipos : []).map(tipo => (
            <div 
              key={tipo.id} 
              className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-[#ec520b]/30 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[#022550] truncate">
                    {tipo.nombre}
                  </h3>
                  {tipo.descripcion && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{tipo.descripcion}</p>
                  )}
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
    </div>
  );
};

export default TiposOperacion;
