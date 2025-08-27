import { supabase } from './supabaseClient';

export async function uploadImageToSupabase(file: File, propiedadId: string | number) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${propiedadId}/${Date.now()}.${fileExt}`;
  const filePath = `propiedades/${fileName}`;

  const { data, error } = await supabase.storage
    .from('propiedades-inmobiliaria')
    .upload(filePath, file);

  if (error) throw error;

  // Obtener URL pública
  const { data: publicUrlData } = supabase
    .storage
    .from('propiedades-inmobiliaria')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}