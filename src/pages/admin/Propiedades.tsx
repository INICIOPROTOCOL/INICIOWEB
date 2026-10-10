import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';
import {Plus,Edit2,Trash2,MapPin,Home,Camera,DollarSign,Tag,Save,X,Building,Bath,Car,Bed,Upload,Image as ImageIcon,Smile} from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { uploadImageToSupabase } from '@/lib/uploadImage';
import { capitalizeAndFixAccent } from '@/utils/capitalize';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface TipoOperacion {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface OperacionPropiedad {
  id: number;
  propiedad_id: number;
  tipo_operacion_id: number;
  precio: number;
  moneda: string;
  disponible: boolean;
  tipo_operacion?: TipoOperacion;
}

interface Propiedad {
  id: number;
  tokko_id?: number | null;
  slug?: string;
  origen?: string;
  titulo: string;
  descripcion?: string;
  area_construida?: number;
  area_total?: number;
  habitaciones?: number;
  banos?: number;
  garages?: number;
  direccion: string;
  latitud?: number;
  longitud?: number;
  estado_propiedad?: string;
  agente_id: number;
  tipo_propiedad_id: number;
  ubicacion_id: number;
  superficie_lote?: number;
  frente?: number;
  fondo?: number;
  tipos_propiedad?: { id: number; nombre: string };
  ubicaciones?: { id: number; pais: string; provincia: string; ciudad: string; barrio?: string };
  operaciones_propiedad?: OperacionPropiedad[];
  imagenes_propiedad?: { id: number; url_imagen: string; es_principal: boolean; orden: number }[];
  propiedades_caracteristicas?: { caracteristicas: { id: number; nombre: string } }[];
  destacada?: boolean;
}

interface TipoPropiedad {
  id: number;
  nombre: string;
}

interface Ubicacion {
  id: number;
  pais: string;
  provincia: string;
  ciudad: string;
  barrio?: string;
  codigo_postal?: string;
}

interface Caracteristica {
  id: number;
  nombre: string;
  tipo_id: number;
}

interface TipoCaracteristica {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface PropiedadForm {
  titulo: string;
  descripcion: string;
  area_construida: string;
  area_total: string;
  habitaciones: string;
  banos: string;
  garages: string;
  direccion: string;
  latitud: string;
  longitud: string;
  estado_propiedad: string;
  tipo_propiedad_id: string;
  ubicacion_id: string;
  superficie_lote: string;
  frente: string;
  fondo: string;
  caracteristicas: number[];
  operaciones: { tipo_operacion_id: string; precio: string; moneda: string; disponible: boolean }[];
  imagenes: File[];
  imagenesExistentes: string[];
  destacada?: boolean;
}

const Propiedades: React.FC = () => {
  // Hook de autenticación debe ir aquí
  const { user: authUser } = useAuth();
  const [propiedades, setPropiedades] = useState<Propiedad[]>(() => {
    const cached = localStorage.getItem('admin_propiedades');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { showToast } = useToast();

  // Estado para el agente actual (id de la tabla usuarios)
  const [agenteActual, setAgenteActual] = useState<number | null>(null);

  // Obtener el usuario logueado de Supabase Auth y buscar su id en la tabla usuarios
  useEffect(() => {
    const fetchAgenteId = async () => {
      try {
        // Obtener email del usuario autenticado desde el contexto
        const email = authUser?.email;
        if (!email) {
          return;
        }
        // Consultar el id en la tabla usuarios (backend debe exponer este endpoint)
        const url = `${API_URL}/usuarios/by-email?email=${encodeURIComponent(email)}`;
        const res = await axios.get(url);
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setAgenteActual(res.data[0].id);
        } else if (res.data && res.data.id) {
          setAgenteActual(res.data.id);
        } else {
        }
      } catch (err) {
      }
    };
    fetchAgenteId();
  }, [authUser?.email]);
  
  // Estado para drag & drop
  const [isDragging, setIsDragging] = useState(false);

  // Estado para selector de emojis
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Cerrar emoji picker al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showEmojiPicker && !target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  // Estados para filtros
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroOperacion, setFiltroOperacion] = useState<string>('todas');
  const [filtroDestacada, setFiltroDestacada] = useState<string>('todas'); // ⭐ Nuevo filtro
  const [busqueda, setBusqueda] = useState<string>('');

  // Datos auxiliares
  const [tiposPropiedad, setTiposPropiedad] = useState<TipoPropiedad[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
  const [tiposCaracteristica, setTiposCaracteristica] = useState<TipoCaracteristica[]>([]);
  const [tiposOperacion, setTiposOperacion] = useState<TipoOperacion[]>([]);

  // Mover imagen en el array
  const moveImagen = (from: number, to: number) => {
    if (to < 0 || to >= form.imagenes.length) return;
    setForm(prev => {
      const arr = [...prev.imagenes];
      const temp = arr[from];
      arr.splice(from, 1);
      arr.splice(to, 0, temp);
      return { ...prev, imagenes: arr };
    });
  };

  // Formulario
  const [form, setForm] = useState<PropiedadForm>({
    titulo: '',
    descripcion: '',
    area_construida: '',
    area_total: '',
    habitaciones: '',
    banos: '',
    garages: '',
    direccion: '',
    latitud: '',
    longitud: '',
    estado_propiedad: 'disponible',
    tipo_propiedad_id: '',
    ubicacion_id: '',
    superficie_lote: '',
    frente: '',
    fondo: '',
    caracteristicas: [],
    operaciones: [{ tipo_operacion_id: '', precio: '', moneda: 'USD', disponible: true }],
  imagenes: [],
  imagenesExistentes: [],
  destacada: false
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [propsRes, tiposRes, ubicRes, caracRes] = await Promise.all([
          axios.get(`${API_URL}/propiedades`),
          axios.get(`${API_URL}/tipos`),
          axios.get(`${API_URL}/ubicaciones`),
          axios.get(`${API_URL}/caracteristicas`)
        ]);
        let tiposOpRes;
        try {
          tiposOpRes = await axios.get(`${API_URL}/tipos-operacion`);
        } catch (error1) {
          try {
            tiposOpRes = await axios.get(`${API_URL}/operaciones`);
          } catch (error2) {
            tiposOpRes = { data: [] };
          }
        }
        setPropiedades(propsRes.data || []);
        localStorage.setItem('admin_propiedades', JSON.stringify(propsRes.data || []));
        setTiposPropiedad(tiposRes.data || []);
        setUbicaciones(ubicRes.data || []);
        setCaracteristicas(caracRes.data || []);
        setTiposOperacion(tiposOpRes.data || []);
        try {
          const tiposCaracRes = await axios.get(`${API_URL}/tipos-caracteristica`);
          setTiposCaracteristica(tiposCaracRes.data || []);
        } catch (error) {
          setTiposCaracteristica([
            { id: 1, nombre: 'Comodidades', descripcion: 'Características de comfort y comodidad' },
            { id: 2, nombre: 'Servicios', descripcion: 'Servicios disponibles en la propiedad' },
            { id: 3, nombre: 'Seguridad', descripcion: 'Características de seguridad' },
            { id: 4, nombre: 'Ubicación', descripcion: 'Características de ubicación y acceso' }
          ]);
        }
      } catch (error) {
        setPropiedades([]);
        localStorage.removeItem('admin_propiedades');
        setTiposPropiedad([]);
        setUbicaciones([]);
        setCaracteristicas([]);
        setTiposOperacion([]);
        setTiposCaracteristica([
          { id: 1, nombre: 'Comodidades', descripcion: 'Características de comfort y comodidad' },
          { id: 2, nombre: 'Servicios', descripcion: 'Servicios disponibles en la propiedad' },
          { id: 3, nombre: 'Seguridad', descripcion: 'Características de seguridad' },
          { id: 4, nombre: 'Ubicación', descripcion: 'Características de ubicación y acceso' }
        ]);
      }
      setLoadingData(false);
    };
    loadData();
  }, []); // Solo ejecutar una vez al montar

  // Limpiar formulario
  const resetForm = () => {
    setForm({
      titulo: '',
      descripcion: '',
      area_construida: '',
      area_total: '',
      habitaciones: '',
      banos: '',
      garages: '',
      direccion: '',
      latitud: '',
      longitud: '',
      estado_propiedad: 'disponible',
      tipo_propiedad_id: '',
      ubicacion_id: '',
      superficie_lote: '',
      frente: '',
      fondo: '',
      caracteristicas: [],
      operaciones: [{ tipo_operacion_id: '', precio: '', moneda: 'USD', disponible: true }],
      imagenes: [],
      imagenesExistentes: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Manejar cambios en inputs
  const handleInputChange = (field: keyof PropiedadForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Insertar emoji en la descripción
  const insertEmoji = (emoji: string) => {
    setForm(prev => ({
      ...prev,
      descripcion: prev.descripcion + emoji
    }));
    setShowEmojiPicker(false);
  };

  // Emojis predeterminados para inmuebles
  const realEstateEmojis = [
    { emoji: '🏠', label: 'Casa' },
    { emoji: '🏡', label: 'Casa con jardín' },
    { emoji: '🏢', label: 'Edificio' },
    { emoji: '🏘️', label: 'Barrio' },
    { emoji: '🏙️', label: 'Ciudad' },
    { emoji: '🏗️', label: 'Construcción' },
    { emoji: '🏰', label: 'Castillo/Mansión' },
    { emoji: '🏟️', label: 'Estadio' },
    { emoji: '🏞️', label: 'Parque Nacional' },
    { emoji: '🏖️', label: 'Playa' },
    { emoji: '🏔️', label: 'Montaña' },
    { emoji: '🏕️', label: 'Camping' },
    { emoji: '🏊‍♂️', label: 'Piscina' },
    { emoji: '🏊‍♀️', label: 'Piscina' },
    { emoji: '🚗', label: 'Cochera' },
    { emoji: '🚙', label: 'SUV/Parking' },
    { emoji: '🔑', label: 'Llaves' },
    { emoji: '🗝️', label: 'Llave antigua' },
    { emoji: '📍', label: 'Ubicación' },
    { emoji: '🌟', label: 'Destacado' },
    { emoji: '✨', label: 'Nuevo/Brillante' },
    { emoji: '💎', label: 'Premium/Lujo' },
    { emoji: '💰', label: 'Precio' },
    { emoji: '💳', label: 'Financiación' },
    { emoji: '🌳', label: 'Jardín/Árbol' },
    { emoji: '🌲', label: 'Bosque' },
    { emoji: '🌺', label: 'Flora/Jardín' },
    { emoji: '🌅', label: 'Amanecer/Vista' },
    { emoji: '🌄', label: 'Vista montaña' },
    { emoji: '📱', label: 'Contacto' },
    { emoji: '📞', label: 'Teléfono' },
    { emoji: '🔥', label: 'Oferta caliente' },
    { emoji: '⚡', label: 'Rápido/Urgente' },
    { emoji: '✅', label: 'Disponible' },
    { emoji: '❤️', label: 'Favorito' },
    { emoji: '👨‍👩‍👧‍👦', label: 'Familiar' },
    { emoji: '🛏️', label: 'Dormitorio' },
    { emoji: '🛁', label: 'Baño' },
    { emoji: '🍽️', label: 'Comedor' },
    { emoji: '📺', label: 'Living/TV' },
    { emoji: '🔒', label: 'Seguridad' },
    { emoji: '🚪', label: 'Entrada' },
    { emoji: '🪟', label: 'Ventana' },
    { emoji: '🏺', label: 'Antigüedad' },
    { emoji: '🆕', label: 'Nuevo' },
    { emoji: '🔝', label: 'Top/Mejor' }
  ];

  // Filtrar propiedades
  const propiedadesFiltradas = (Array.isArray(propiedades) ? propiedades : []).filter(propiedad => {
    // Filtro por tipo de propiedad
    if (filtroTipo && filtroTipo !== 'todos' && propiedad.tipo_propiedad_id?.toString() !== filtroTipo) {
      return false;
    }
    // Filtro por tipo de operación
    if (filtroOperacion && filtroOperacion !== 'todas') {
      const tieneOperacion = Array.isArray(propiedad.operaciones_propiedad) && propiedad.operaciones_propiedad.some(
        op => op.tipo_operacion_id?.toString() === filtroOperacion
      );
      if (!tieneOperacion) return false;
    }
    // ⭐ Nuevo: Filtro por destacada
    if (filtroDestacada && filtroDestacada !== 'todas') {
      const esDestacada = propiedad.destacada === true;
      if (filtroDestacada === 'destacadas' && !esDestacada) return false;
      if (filtroDestacada === 'no-destacadas' && esDestacada) return false;
    }
    // Filtro por búsqueda de texto
    if (busqueda) {
      const textoBusqueda = busqueda.toLowerCase();
      const coincide =
        propiedad.titulo?.toLowerCase().includes(textoBusqueda) ||
        propiedad.descripcion?.toLowerCase().includes(textoBusqueda) ||
        propiedad.direccion?.toLowerCase().includes(textoBusqueda) ||
        propiedad.ubicaciones?.ciudad?.toLowerCase().includes(textoBusqueda) ||
        propiedad.ubicaciones?.provincia?.toLowerCase().includes(textoBusqueda);
      if (!coincide) return false;
    }
    return true;
  });

  // Agrupar características por tipo
  const caracteristicasAgrupadas = () => {
    const grupos: { [key: string]: { tipo: TipoCaracteristica; caracteristicas: Caracteristica[] } } = {};
    
    caracteristicas.forEach(caracteristica => {
      const tipo = tiposCaracteristica.find(t => t.id === caracteristica.tipo_id);
      if (tipo) {
        if (!grupos[tipo.id]) {
          grupos[tipo.id] = { tipo, caracteristicas: [] };
        }
        grupos[tipo.id].caracteristicas.push(caracteristica);
      }
    });
    
    return Object.values(grupos);
  };

  // Manejar características
  const handleCaracteristicaChange = (caracteristicaId: number, checked: boolean) => {
    setForm(prev => ({
      ...prev,
      caracteristicas: checked 
        ? [...prev.caracteristicas, caracteristicaId]
        : prev.caracteristicas.filter(id => id !== caracteristicaId)
    }));
  };

  // Manejar operaciones
  const handleOperacionChange = (index: number, field: string, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
  operaciones: (Array.isArray(prev.operaciones) ? prev.operaciones : []).map((op, i) => 
        i === index ? { ...op, [field]: value } : op
      )
    }));
  };

  const addOperacion = () => {
    setForm(prev => ({
      ...prev,
      operaciones: [...prev.operaciones, { tipo_operacion_id: '', precio: '', moneda: 'USD', disponible: true }]
    }));
  };

  const removeOperacion = (index: number) => {
    setForm(prev => ({
      ...prev,
      operaciones: prev.operaciones.filter((_, i) => i !== index)
    }));
  };

  // Manejar imágenes
  const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, ...files]
    }));
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      setForm(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...files]
      }));
    }
  };

  const removeImagen = (index: number) => {
    setForm(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  const removeImagenExistente = (index: number) => {
    setForm(prev => ({
      ...prev,
      imagenesExistentes: prev.imagenesExistentes.filter((_, i) => i !== index)
    }));
  };

  const moveImagenExistente = (from: number, to: number) => {
    if (to < 0 || to >= form.imagenesExistentes.length) return;
    setForm(prev => {
      const arr = [...prev.imagenesExistentes];
      const temp = arr[from];
      arr.splice(from, 1);
      arr.splice(to, 0, temp);
      return { ...prev, imagenesExistentes: arr };
    });
  };


  // Guardar propiedad (flujo: crear -> subir imágenes -> actualizar)
  const handleSave = async () => {
    if (!form.titulo || !form.direccion || !form.tipo_propiedad_id || !form.ubicacion_id) {
      showToast('Completa los campos obligatorios', 'error');
      return;
    }

    setLoading(true);
    try {
      if (!agenteActual) {
        showToast('No se pudo identificar el agente actual', 'error');
        setLoading(false);
        return;
      }
      // 1. Armar operaciones para el backend
      const operacionesPayload = form.operaciones
        .filter(op => op.tipo_operacion_id && op.precio)
        .map(op => ({
          tipo_operacion_id: parseInt(op.tipo_operacion_id),
          precio: parseFloat(op.precio),
          moneda: op.moneda || 'USD'
        }));

      // 2. Crear propiedad sin imágenes
      let propiedadId = editingId;
      let response;
      const basePayload = {
        titulo: form.titulo,
        descripcion: form.descripcion || null,
        area_construida: form.area_construida ? parseFloat(form.area_construida) : null,
        area_total: form.area_total ? parseFloat(form.area_total) : null,
        habitaciones: form.habitaciones ? parseInt(form.habitaciones) : null,
        banos: form.banos ? parseInt(form.banos) : null,
        garages: form.garages ? parseInt(form.garages) : null,
        direccion: form.direccion,
        tipo_propiedad_id: parseInt(form.tipo_propiedad_id),
        ubicacion_id: parseInt(form.ubicacion_id),
        agente_id: agenteActual,
        caracteristicas_ids: form.caracteristicas || [],
        operaciones: operacionesPayload,
        destacada: form.destacada || false,
        // Campos específicos para lotes/terrenos
        superficie_lote: form.superficie_lote ? parseFloat(form.superficie_lote) : null,
        frente: form.frente ? parseFloat(form.frente) : null,
        fondo: form.fondo ? parseFloat(form.fondo) : null
      };


      if (!editingId) {
        response = await axios.post(`${API_URL}/propiedades`, basePayload);
        propiedadId = response.data?.id;
      } else {
        response = await axios.put(`${API_URL}/propiedades/${editingId}`, basePayload);
      }

      // 3. Subir imágenes a Supabase con el ID real
      const imagenesPayload = [];
      if (form.imagenes.length > 0 && propiedadId) {
        for (let i = 0; i < form.imagenes.length; i++) {
          const file = form.imagenes[i];
          const url = await uploadImageToSupabase(file, propiedadId);
          imagenesPayload.push({
            url: url,
            esPrincipal: i === 0,
            orden: i
          });
        }
      }
      // Si hay imágenes existentes (en edición), agregarlas al payload
      if (form.imagenesExistentes && form.imagenesExistentes.length > 0) {
        form.imagenesExistentes.forEach((url, idx) => {
          imagenesPayload.push({
            url: url,
            esPrincipal: imagenesPayload.length === 0 && idx === 0,
            orden: imagenesPayload.length + idx
          });
        });
      }

      // 4. Actualizar propiedad con imágenes si corresponde
      if (imagenesPayload.length > 0 && propiedadId) {
        await axios.put(`${API_URL}/propiedades/${propiedadId}`, {
          ...basePayload,
          imagenes: imagenesPayload
        });
      }

      showToast(editingId ? 'Propiedad actualizada correctamente' : 'Propiedad creada correctamente', 'success');
      // Recargar lista
      const res = await axios.get(`${API_URL}/propiedades`);
      setPropiedades(res.data || []);
      resetForm();
    } catch (error) {
      showToast('Error al guardar propiedad', 'error');
    }
    setLoading(false);
  };

  // El flujo de imágenes ahora está integrado en handleSave
  // (subirImagenes eliminado)

  // Editar propiedad
  const handleEdit = (propiedad: Propiedad) => {
    setForm({
      titulo: propiedad.titulo || '',
      descripcion: propiedad.descripcion || '',
      area_construida: propiedad.area_construida?.toString() || '',
      area_total: propiedad.area_total?.toString() || '',
      habitaciones: propiedad.habitaciones?.toString() || '',
      banos: propiedad.banos?.toString() || '',
      garages: propiedad.garages?.toString() || '',
      direccion: propiedad.direccion || '',
      latitud: propiedad.latitud?.toString() || '',
      longitud: propiedad.longitud?.toString() || '',
      estado_propiedad: propiedad.estado_propiedad || 'disponible',
      tipo_propiedad_id: propiedad.tipo_propiedad_id?.toString() || '',
      ubicacion_id: propiedad.ubicacion_id?.toString() || '',
      superficie_lote: propiedad.superficie_lote?.toString() || '',
      frente: propiedad.frente?.toString() || '',
      fondo: propiedad.fondo?.toString() || '',
      caracteristicas: Array.isArray(propiedad.propiedades_caracteristicas)
        ? propiedad.propiedades_caracteristicas.map(pc => pc.caracteristicas?.id).filter(Boolean)
        : [],
      operaciones: Array.isArray(propiedad.operaciones_propiedad)
        ? propiedad.operaciones_propiedad.map(op => ({
            tipo_operacion_id: op.tipo_operacion_id?.toString() || '',
            precio: op.precio?.toString() || '',
            moneda: op.moneda || 'USD',
            disponible: op.disponible ?? true
          }))
        : [{ tipo_operacion_id: '', precio: '', moneda: 'USD', disponible: true }],
      imagenes: [],
      imagenesExistentes: Array.isArray(propiedad.imagenes_propiedad)
        ? propiedad.imagenes_propiedad.map(img => img.url_imagen)
        : [],
      destacada: propiedad.destacada ?? false
    });
    setEditingId(propiedad.id);
    setShowForm(true);
  };

  // Eliminar propiedad
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta propiedad?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/propiedades/${id}`);
      showToast('Propiedad eliminada correctamente', 'success');
      setPropiedades(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      showToast('Error al eliminar propiedad', 'error');
    }
    setLoading(false);
  };

  // ⭐ Toggle destacada usando el nuevo endpoint del backend
  const handleToggleDestacada = async (propiedad: Propiedad) => {
    if (!propiedad.tokko_id) {
      showToast('Solo propiedades de Tokko pueden ser destacadas', 'error');
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Obtener estado actual
      const estadoActual = propiedad.destacada || false;
      
      // 2️⃣ Invertir el estado actual
      const nuevoEstado = !estadoActual;
      
      console.log(`🔄 Toggling destacada - Tokko ID: ${propiedad.tokko_id}, Estado actual: ${estadoActual}, Nuevo estado: ${nuevoEstado}`);
      
      // 3️⃣ Enviar el NUEVO estado al backend
      const response = await axios.patch(
        `${API_URL}/propiedades/tokko/${propiedad.tokko_id}/destacada`,
        { destacada: nuevoEstado }
      );
      
      showToast(response.data.message, 'success');
      
      // 4️⃣ Actualizar con la respuesta del backend (no calcular localmente)
      setPropiedades(prev => 
        prev.map(p => 
          p.id === propiedad.id 
            ? { ...p, destacada: response.data.propiedad.destacada }
            : p
        )
      );
      
      console.log(`✅ Destacada actualizada a: ${response.data.propiedad.destacada}`);
    } catch (error) {
      console.error('❌ Error al actualizar destacada:', error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      const errorMessage = axiosError.response?.data?.error || 'Error al actualizar destacada';
      showToast(errorMessage, 'error');
    }
    setLoading(false);
  };

  if (loadingData || loading) {
    return <Loader text={loadingData ? 'Cargando datos...' : 'Guardando propiedad...'} color="#ec520b" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#022550]">Gestión de Propiedades</h1>
          <p className="text-gray-600 mt-1">Administra todas las propiedades del sistema</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#ec520b] hover:bg-[#ff6b1a] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Propiedad
        </Button>
      </div>

      {/* Filtros de Búsqueda */}
      {!showForm && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="busqueda">Buscar</Label>
                <Input
                  id="busqueda"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Título o dirección..."
                />
              </div>
              <div>
                <Label htmlFor="filtroTipo">Tipo de Propiedad</Label>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {(Array.isArray(tiposPropiedad) ? tiposPropiedad : [])
                      .filter(tipo => tipo.id !== 1)
                      .map(tipo => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          {capitalizeAndFixAccent(tipo.nombre)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filtroOperacion">Tipo de Operación</Label>
                <Select value={filtroOperacion} onValueChange={setFiltroOperacion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las operaciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {(Array.isArray(tiposOperacion) ? tiposOperacion : [])
                      .filter(tipo => tipo.id !== 1)
                      .map(tipo => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          {capitalizeAndFixAccent(tipo.nombre)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              {/* ⭐ Nuevo filtro de destacadas */}
              <div>
                <Label htmlFor="filtroDestacada">Destacadas</Label>
                <Select value={filtroDestacada} onValueChange={setFiltroDestacada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="destacadas">⭐ Solo destacadas</SelectItem>
                    <SelectItem value="no-destacadas">Sin destacar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setBusqueda('');
                    setFiltroTipo('');
                    setFiltroOperacion('');
                    setFiltroDestacada('todas'); // ⭐ Resetear filtro destacada
                  }}
                  className="w-full"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulario Modal */}
      {showForm && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-[#ec520b]/10 to-[#022550]/10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl text-[#022550]">
                {editingId ? 'Editar Propiedad' : 'Nueva Propiedad'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#022550] flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={form.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    placeholder="Ej: Casa moderna en Villa Allende"
                  />
                </div>
                <div>
                  <Label htmlFor="tipo_propiedad_id">Tipo de Propiedad *</Label>
                  <Select value={form.tipo_propiedad_id} onValueChange={(value) => handleInputChange('tipo_propiedad_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(tiposPropiedad) ? tiposPropiedad : [])
                        .filter(tipo => tipo.id !== 1)
                        .map(tipo => (
                          <SelectItem key={tipo.id} value={tipo.id.toString()}>
                            {capitalizeAndFixAccent(tipo.nombre)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Campo Estado comentado temporalmente */}
                {/* <div>
                  <Label htmlFor="estado_propiedad">Estado</Label>
                  <Select value={form.estado_propiedad} onValueChange={(value) => handleInputChange('estado_propiedad', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="vendido">Vendido</SelectItem>
                      <SelectItem value="alquilado">Alquilado</SelectItem>
                      <SelectItem value="reservado">Reservado</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <div className="relative emoji-picker-container">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-[#ec520b] border-[#ec520b] hover:bg-[#ec520b] hover:text-white"
                      >
                        <Smile className="h-4 w-4 mr-1" />
                        Emojis
                      </Button>
                      {showEmojiPicker && (
                        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-80 max-h-60 overflow-y-auto">
                          <div className="text-sm font-medium text-gray-700 mb-3">Selecciona un emoji:</div>
                          <div className="grid grid-cols-8 gap-2">
                            {realEstateEmojis.map((item, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => insertEmoji(item.emoji)}
                                className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                                title={item.label}
                              >
                                {item.emoji}
                              </button>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowEmojiPicker(false)}
                              className="w-full text-gray-500 hover:text-gray-700"
                            >
                              Cerrar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Textarea
                    id="descripcion"
                    value={form.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    placeholder="Descripción detallada de la propiedad... 🏠✨"
                    rows={8}
                  />
                </div>
              </div>
            </div>

            {/* Características Físicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#022550] flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Características Físicas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="area_construida">Superficie Construida (m²)</Label>
                  <Input
                    id="area_construida"
                    type="number"
                    value={form.area_construida}
                    onChange={(e) => handleInputChange('area_construida', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="area_total">Superficie Total (m²)</Label>
                  <Input
                    id="area_total"
                    type="number"
                    value={form.area_total}
                    onChange={(e) => handleInputChange('area_total', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="habitaciones" className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    Habitaciones
                  </Label>
                  <Input
                    id="habitaciones"
                    type="number"
                    value={form.habitaciones}
                    onChange={(e) => handleInputChange('habitaciones', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="banos" className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    Baños
                  </Label>
                  <Input
                    id="banos"
                    type="number"
                    step="0.5"
                    value={form.banos}
                    onChange={(e) => handleInputChange('banos', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="garages" className="flex items-center">
                    <Car className="h-4 w-4 mr-1" />
                    Cochera
                  </Label>
                  <Input
                    id="garages"
                    type="number"
                    value={form.garages}
                    onChange={(e) => handleInputChange('garages', e.target.value)}
                  />
                </div>
                
                {/* Campos específicos para Terrenos (tipo_propiedad_id = 4) */}
                {form.tipo_propiedad_id === '4' && (
                  <>
                    <div>
                      <Label htmlFor="superficie_lote">Superficie Lote (m²) *</Label>
                      <Input
                        id="superficie_lote"
                        type="number"
                        value={form.superficie_lote}
                        onChange={(e) => handleInputChange('superficie_lote', e.target.value)}
                        placeholder="400"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="frente">Frente (m)</Label>
                      <Input
                        id="frente"
                        type="number"
                        value={form.frente}
                        onChange={(e) => handleInputChange('frente', e.target.value)}
                        placeholder="12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fondo">Fondo (m)</Label>
                      <Input
                        id="fondo"
                        type="number"
                        value={form.fondo}
                        onChange={(e) => handleInputChange('fondo', e.target.value)}
                        placeholder="30"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#022550] flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Ubicación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ubicacion_id">Ubicación *</Label>
                  <Select value={form.ubicacion_id} onValueChange={(value) => handleInputChange('ubicacion_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(ubicaciones) ? ubicaciones : [])
                        .filter(ubicacion => ubicacion.id !== 1)
                        .map(ubicacion => (
                          <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                            {ubicacion.ciudad}, {ubicacion.provincia}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Campos de coordenadas comentados temporalmente */}
                {/* <div>
                  <Label htmlFor="latitud">Latitud</Label>
                  <Input
                    id="latitud"
                    type="number"
                    step="any"
                    value={form.latitud}
                    onChange={(e) => handleInputChange('latitud', e.target.value)}
                    placeholder="-31.4201"
                  />
                </div>
                <div>
                  <Label htmlFor="longitud">Longitud</Label>
                  <Input
                    id="longitud"
                    type="number"
                    step="any"
                    value={form.longitud}
                    onChange={(e) => handleInputChange('longitud', e.target.value)}
                    placeholder="-64.1888"
                  />
                </div> */}
                <div className="md:col-span-3">
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input
                    id="direccion"
                    value={form.direccion}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    placeholder="Calle Falsa 123, Villa Allende"
                  />
                </div>
              </div>
            </div>

            {/* Operaciones (Venta/Alquiler) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#022550] flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Operaciones
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOperacion}
                  className="text-[#ec520b] border-[#ec520b] hover:bg-[#ec520b] hover:text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
              {(Array.isArray(form.operaciones) ? form.operaciones : []).map((operacion, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-gray-50">
                  <div>
                    <Label>Tipo de Operación</Label>
                    <Select 
                      value={operacion.tipo_operacion_id} 
                      onValueChange={(value) => handleOperacionChange(index, 'tipo_operacion_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Array.isArray(tiposOperacion) ? tiposOperacion : [])
                          .filter(tipo => tipo.id !== 1)
                          .map(tipo => (
                            <SelectItem key={tipo.id} value={tipo.id.toString()}>
                              {capitalizeAndFixAccent(tipo.nombre)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Precio</Label>
                    <Input
                      type="number"
                      value={operacion.precio}
                      onChange={(e) => handleOperacionChange(index, 'precio', e.target.value)}
                      placeholder="150000"
                    />
                  </div>
                  <div>
                    <Label>Moneda</Label>
                    <Select 
                      value={operacion.moneda} 
                      onValueChange={(value) => handleOperacionChange(index, 'moneda', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="ARS">ARS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`disponible-${index}`}
                      checked={operacion.disponible}
                      onCheckedChange={(checked) => handleOperacionChange(index, 'disponible', checked as boolean)}
                    />
                    <Label htmlFor={`disponible-${index}`} className="text-sm">
                      Disponible
                    </Label>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOperacion(index)}
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Características */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#022550] flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Características
              </h3>
              <div className="space-y-6">
                {caracteristicasAgrupadas().map(grupo => (
                  <div key={grupo.tipo.id} className="space-y-3">
                    <h4 className="text-md font-medium text-[#022550] border-b border-gray-200 pb-2">
                      {grupo.tipo.nombre}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pl-4">
                      {(Array.isArray(grupo.caracteristicas) ? grupo.caracteristicas : []).map(caracteristica => (
                        <div key={caracteristica.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`caracteristica-${caracteristica.id}`}
                            checked={form.caracteristicas.includes(caracteristica.id)}
                            onCheckedChange={(checked) => handleCaracteristicaChange(caracteristica.id, checked as boolean)}
                          />
                          <Label htmlFor={`caracteristica-${caracteristica.id}`} className="text-sm">
                            {capitalizeAndFixAccent(caracteristica.nombre)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Imágenes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#022550] flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Imágenes
              </h3>
              
              {/* Área de carga de imágenes */}
              <div className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging 
                      ? 'border-[#ec520b] bg-[#ec520b]/10' 
                      : 'border-gray-300 hover:border-[#ec520b]'
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="imagenes"
                    multiple
                    accept="image/*"
                    onChange={handleImagenesChange}
                    className="hidden"
                  />
                  <label htmlFor="imagenes" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Arrastra imágenes aquí o haz clic para seleccionar</p>
                    <p className="text-sm text-gray-400">PNG, JPG, GIF hasta 10MB</p>
                  </label>
                </div>

                {/* Imágenes existentes */}
                {form.imagenesExistentes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Imágenes actuales</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(Array.isArray(form.imagenesExistentes) ? form.imagenesExistentes : []).map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImagenExistente(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            {index + 1}
                          </div>
                          {/* Botones para ordenar imágenes existentes */}
                          <div className="absolute bottom-1 right-1 flex gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => moveImagenExistente(index, index - 1)}
                              className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs hover:bg-gray-300 disabled:opacity-50"
                            >↑</button>
                            <button
                              type="button"
                              disabled={index === form.imagenesExistentes.length - 1}
                              onClick={() => moveImagenExistente(index, index + 1)}
                              className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs hover:bg-gray-300 disabled:opacity-50"
                            >↓</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nuevas imágenes seleccionadas */}
                {form.imagenes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Nuevas imágenes</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(Array.isArray(form.imagenes) ? form.imagenes : []).map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImagen(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                          </div>
                          {/* Botones para ordenar imágenes */}
                          <div className="absolute bottom-1 right-1 flex gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => moveImagen(index, index - 1)}
                              className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs hover:bg-gray-300 disabled:opacity-50"
                            >↑</button>
                            <button
                              type="button"
                              disabled={index === form.imagenes.length - 1}
                              onClick={() => moveImagen(index, index + 1)}
                              className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs hover:bg-gray-300 disabled:opacity-50"
                            >↓</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            {/* Checkbox destacada */}
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="destacada"
                checked={form.destacada}
                onChange={e => setForm(prev => ({ ...prev, destacada: e.target.checked }))}
                className="h-4 w-4 text-[#ec520b] focus:ring-[#022550] border-gray-300 rounded"
              />
              <label htmlFor="destacada" className="ml-2 block text-sm text-gray-700">Propiedad destacada</label>
            </div>
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={loading}
                className="bg-[#ec520b] hover:bg-[#ff6b1a] text-white"
              >
                {loading ? (
                  <Loader color="#fff" size={18} className="mr-2" text="" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {editingId ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Propiedades */}
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {propiedades.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay propiedades registradas
                </h3>
                <p className="text-gray-500 mb-4">
                  Comienza creando la primera propiedad.
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-[#ec520b] hover:bg-[#ff6b1a] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Propiedad
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : propiedadesFiltradas.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron propiedades
                </h3>
                <p className="text-gray-500 mb-4">
                  Intenta cambiar los filtros de búsqueda.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setBusqueda('');
                    setFiltroTipo('todos');
                    setFiltroOperacion('todas');
                  }}
                >
                  Limpiar filtros
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          (Array.isArray(propiedadesFiltradas) ? propiedadesFiltradas : []).map(propiedad => {
            const primeraImagen = propiedad.imagenes_propiedad?.[0]?.url_imagen;
            const tipoPropiedad = propiedad.tipos_propiedad?.nombre || 'Sin tipo';
            const ubicacion = propiedad.ubicaciones?.ciudad || 'Sin ubicación';
            const operacionPrincipal = propiedad.operaciones_propiedad?.[0];
            
            // Agrupar características de la propiedad por tipo
            const caracteristicasPorTipo: Record<string, string[]> = {};
            if (Array.isArray(propiedad.propiedades_caracteristicas)) {
              propiedad.propiedades_caracteristicas.forEach(pc => {
                // Buscar el tipo de característica por id
                const caracteristica = caracteristicas.find(c => c.id === pc.caracteristicas.id);
                const tipo = caracteristica
                  ? tiposCaracteristica.find(t => t.id === caracteristica.tipo_id)
                  : undefined;
                const tipoNombre = tipo?.nombre || 'Otros';
                if (!caracteristicasPorTipo[tipoNombre]) caracteristicasPorTipo[tipoNombre] = [];
                caracteristicasPorTipo[tipoNombre].push(pc.caracteristicas.nombre);
              });
            }

            return (
              <div 
                key={propiedad.id} 
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-[#ec520b]/30 transition-all duration-200"
              >
                {/* Imagen miniatura */}
                <div className="h-48 bg-gray-100 overflow-hidden relative">
                  {primeraImagen ? (
                    <img 
                      src={primeraImagen} 
                      alt={propiedad.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <Home className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Badge de Destacada */}
                  {propiedad.destacada && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      ⭐ Destacada
                    </div>
                  )}

                  {/* Badge de origen Tokko */}
                  {propiedad.tokko_id && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Tokko
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[#022550] truncate">
                        {propiedad.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{propiedad.direccion}</p>
                    </div>
                    <div className="flex gap-1 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity duration-200 ml-2">
                      {/* Botón Toggle Destacada (solo para propiedades Tokko) */}
                      {propiedad.tokko_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleDestacada(propiedad)}
                          className={`h-8 w-8 p-0 ${
                            propiedad.destacada 
                              ? 'text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600' 
                              : 'text-gray-400 hover:bg-gray-100 hover:text-yellow-500'
                          }`}
                          title={propiedad.destacada ? 'Desmarcar destacada' : 'Marcar como destacada'}
                        >
                          <span className="text-lg">{propiedad.destacada ? '⭐' : '☆'}</span>
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(propiedad)}
                        className="h-8 w-8 p-0 text-[#022550] hover:bg-[#022550] hover:text-white"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(propiedad.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Info básica */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      {capitalizeAndFixAccent(tipoPropiedad)} • {ubicacion}
                    </div>
                    
                    {(propiedad.habitaciones || propiedad.banos) && (
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {propiedad.habitaciones && (
                          <span className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            {propiedad.habitaciones}
                          </span>
                        )}
                        {propiedad.banos && (
                          <span className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {propiedad.banos}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Precio/Operación */}
                  {operacionPrincipal && (
                    <div className="mb-3">
                      <Badge 
                        variant="outline" 
                        className="text-[#ec520b] border-[#ec520b] bg-[#ec520b]/10"
                      >
                        {capitalizeAndFixAccent(operacionPrincipal.tipo_operacion?.nombre)}: {operacionPrincipal.moneda} {operacionPrincipal.precio?.toLocaleString()}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Propiedades;
