import { supabase } from "./supabase";

export type Barberia = {
    id: string
    nombre: string 
    slug: string
    owner_id: string
    email: string
    telefono: string | null
    direccion: string | null
    ciudad: string | null
    logo_url: string | null
    color_primario: string
    tipo_plan: 'free' | 'pro' | 'enterprise'
    activo: boolean
    created_at: string
}
export async function getBarberiaPorSlug(slug: string): Promise<Barberia | null> {
    const { data, error } = await supabase
        .from('barberias')
        .select('*')
        .eq('slug', slug)
        .eq('activo', true)
        .single()

    if (error || !data) return null
    return data
}

export async function getBarberiaPorOwner(userId: string): Promise<Barberia | null> {
    const { data, error } = await supabase
        .from('barberias')
        .select('*')
        .eq('owner_id', userId)
        .single()

    if ( error || !data) return null
    return data
}