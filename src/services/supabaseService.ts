import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Servicios para Tipos de Propiedad
export const tiposService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('tipos_propiedad')
      .select('*')
      .order('nombre');
    
    if (error) throw error;
    return { data: data || [], success: true };
  },

  create: async (tipo: { nombre: string; descripcion?: string }) => {
    const { data, error } = await supabase
      .from('tipos_propiedad')
      .insert([tipo])
      .select()
      .single();
    
    if (error) throw error;
    return { data, success: true };
  },

  update: async (id: number, tipo: { nombre: string; descripcion?: string }) => {
    const { data, error } = await supabase
      .from('tipos_propiedad')
      .update(tipo)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, success: true };
  },

  delete: async (id: number) => {
    const { error } = await supabase
      .from('tipos_propiedad')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// Servicios para Ubicaciones
export const ubicacionesService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('ubicaciones')
      .select('*')
      .order('pais, provincia, ciudad');
    
    if (error) throw error;
    return { data: data || [], success: true };
  },

  create: async (ubicacion: { pais: string; provincia: string; ciudad: string; barrio?: string; codigo_postal?: string }) => {
    const { data, error } = await supabase
      .from('ubicaciones')
      .insert([ubicacion])
      .select()
      .single();
    
    if (error) throw error;
    return { data, success: true };
  },

  update: async (id: number, ubicacion: { pais: string; provincia: string; ciudad: string; barrio?: string; codigo_postal?: string }) => {
    const { data, error } = await supabase
      .from('ubicaciones')
      .update(ubicacion)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, success: true };
  },

  delete: async (id: number) => {
    const { error } = await supabase
      .from('ubicaciones')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// Servicios para Características
export const caracteristicasService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('caracteristicas')
      .select('*')
      .order('nombre');
    
    if (error) throw error;
    return { data: data || [], success: true };
  },

  create: async (caracteristica: { nombre: string; tipo_id: number }) => {
    const { data, error } = await supabase
      .from('caracteristicas')
      .insert([caracteristica])
      .select()
      .single();
    
    if (error) throw error;
    return { data, success: true };
  },

  update: async (id: number, caracteristica: { nombre: string; tipo_id: number }) => {
    const { data, error } = await supabase
      .from('caracteristicas')
      .update(caracteristica)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, success: true };
  },

  delete: async (id: number) => {
    const { error } = await supabase
      .from('caracteristicas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// Servicios para Tipos de Operación
export const tiposOperacionService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('tipos_operacion')
      .select('*')
      .order('nombre');
    
    if (error) throw error;
    return { data: data || [], success: true };
  },

  create: async (tipo: { nombre: string; descripcion?: string }) => {
    const { data, error } = await supabase
      .from('tipos_operacion')
      .insert([tipo])
      .select()
      .single();
    
    if (error) throw error;
    return { data, success: true };
  },

  update: async (id: number, tipo: { nombre: string; descripcion?: string }) => {
    const { data, error } = await supabase
      .from('tipos_operacion')
      .update(tipo)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, success: true };
  },

  delete: async (id: number) => {
    const { error } = await supabase
      .from('tipos_operacion')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// Servicios para Propiedades
export const propiedadesService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('propiedades')
      .select(`
        *,
        tipos_propiedad(id, nombre),
        ubicaciones(id, pais, provincia, ciudad, barrio),
        operaciones_propiedad(
          id,
          tipo_operacion_id,
          precio,
          moneda,
          disponible,
          tipos_operacion(id, nombre)
        ),
        propiedades_caracteristicas(
          caracteristicas(id, nombre)
        )
      `)
      .order('fecha_creacion', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], success: true };
  },

  create: async (propiedad: Record<string, unknown>) => {
    const { data, error } = await supabase
      .from('propiedades')
      .insert([propiedad])
      .select()
      .single();
    
    if (error) throw error;
    return { data, success: true };
  },

  update: async (id: number, propiedad: Record<string, unknown>) => {
    const { data, error } = await supabase
      .from('propiedades')
      .update(propiedad)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, success: true };
  },

  delete: async (id: number) => {
    const { error } = await supabase
      .from('propiedades')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};
