import React, { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';
import { Plus, Edit2, Trash2, Tag, Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Caracteristica {
  id: number;
  nombre: string;
  tipo_id: number;
  tipos_caracteristica?: { id: number; nombre: string };
}

interface TipoCaracteristica {
  id: number;
  nombre: string;
}

const Caracteristicas: React.FC = () => {
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
  const [tiposCaracteristica, setTiposCaracteristica] = useState<TipoCaracteristica[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: '', tipo_id: '' });
  const { showToast } = useToast();

  // Agrupar características por tipo
  const caracteristicasAgrupadas = () => {
    const grupos: { [key: string]: { tipo: TipoCaracteristica; caracteristicas: Caracteristica[] } } = {};
    
    caracteristicas.forEach(caracteristica => {
      const tipoId = caracteristica.tipo_id;
      const tipo = tiposCaracteristica.find(t => t.id === tipoId) || { id: tipoId, nombre: 'Sin tipo' };
      
      if (!grupos[tipoId]) {
        grupos[tipoId] = { tipo, caracteristicas: [] };
      }
      grupos[tipoId].caracteristicas.push(caracteristica);
    });
    
    return Object.values(grupos).sort((a, b) => a.tipo.nombre.localeCompare(b.tipo.nombre));
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Cargar características y tipos de características desde el backend
      const [caracRes, tiposRes] = await Promise.all([
        axios.get(`${API_URL}/caracteristicas`),
        axios.get(`${API_URL}/tipos-caracteristica`)
      ]);
      
      setCaracteristicas(caracRes.data || []);
      setTiposCaracteristica(tiposRes.data || []);
      
      console.log('📦 Características cargadas:', caracRes.data?.length || 0);
      console.log('📦 Tipos de características cargados:', tiposRes.data?.length || 0);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showToast('Error al cargar datos', 'error');
      
      // Valores por defecto en caso de error
      setCaracteristicas([]);
      setTiposCaracteristica([
        { id: 1, nombre: 'Comodidades' },
        { id: 2, nombre: 'Servicios' },
        { id: 3, nombre: 'Seguridad' },
        { id: 4, nombre: 'Ubicación' }
      ]);
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setForm({ nombre: '', tipo_id: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.nombre.trim() || !form.tipo_id) {
      showToast('Completa todos los campos', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nombre: form.nombre,
        tipo_id: parseInt(form.tipo_id)
      };

      if (editingId) {
        await axios.put(`${API_URL}/caracteristicas/${editingId}`, payload);
        showToast('Característica actualizada correctamente', 'success');
      } else {
        await axios.post(`${API_URL}/caracteristicas`, payload);
        showToast('Característica creada correctamente', 'success');
      }
      
      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error al guardar:', error);
      showToast('Error al guardar característica', 'error');
    }
    setLoading(false);
  };

  const handleEdit = (caracteristica: Caracteristica) => {
    setForm({ 
      nombre: caracteristica.nombre, 
      tipo_id: caracteristica.tipo_id.toString() 
    });
    setEditingId(caracteristica.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta característica?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/caracteristicas/${id}`);
      showToast('Característica eliminada correctamente', 'success');
      await fetchData();
    } catch (error) {
      console.error('Error al eliminar:', error);
      showToast('Error al eliminar característica', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#022550]">Gestión de Características</h1>
          <p className="text-gray-600 mt-1">Administra las características de las propiedades</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#ec520b] hover:bg-[#ff6b1a] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Característica
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <Card className="max-w-md mx-auto">
          <CardHeader className="bg-gradient-to-r from-[#ec520b]/10 to-[#022550]/10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-[#022550]">
                {editingId ? 'Editar Característica' : 'Nueva Característica'}
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
                placeholder="ej: Piscina, Aire acondicionado"
              />
            </div>
            <div>
              <Label htmlFor="tipo_id">Tipo de Característica *</Label>
              <Select value={form.tipo_id} onValueChange={(value) => setForm(prev => ({ ...prev, tipo_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {(Array.isArray(tiposCaracteristica) ? tiposCaracteristica : []).map(tipo => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* Lista de características agrupadas */}
      <div className="space-y-6">
        {loading && !showForm ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-[#ec520b]" />
            <span className="ml-2 text-gray-600">Cargando...</span>
          </div>
        ) : caracteristicas.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay características</h3>
              <p className="text-gray-600 text-center mb-4">
                Comienza agregando características como piscina, garage, etc.
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-[#ec520b] hover:bg-[#ff6b1a] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Característica
              </Button>
            </CardContent>
          </Card>
        ) : (
          caracteristicasAgrupadas().map(grupo => (
            <Card key={grupo.tipo.id} className="overflow-hidden shadow-sm">
              <CardHeader className="bg-gradient-to-r from-[#022550]/5 to-[#ec520b]/5 border-b py-3">
                <CardTitle className="text-lg text-[#022550] flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-[#ec520b]" />
                  {grupo.tipo.nombre}
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {grupo.caracteristicas.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {grupo.caracteristicas.map(caracteristica => (
                    <div 
                      key={caracteristica.id} 
                      className="group bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg hover:border-[#ec520b]/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 truncate pr-2">
                          {caracteristica.nombre}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(caracteristica)}
                            className="h-7 w-7 p-0 text-[#022550] hover:bg-[#022550] hover:text-white"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(caracteristica.id)}
                            className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                            disabled={loading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Caracteristicas;
