import { supabase, type PosterRow } from './supabase'

export type Poster = {
  id: string
  title: string
  description: string
  category: string
  price: number
  image_url: string
  tag: string
  created_at: string
}

function mapRow(row: PosterRow): Poster {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    category: row.category,
    price: Number(row.price),
    image_url: row.image_url,
    tag: row.tag || '',
    created_at: row.created_at,
  }
}

export async function fetchPosters(): Promise<Poster[]> {
  const { data, error } = await supabase
    .from('posters')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posters:', error)
    return []
  }

  return (data || []).map(mapRow)
}

export async function addPoster(input: {
  title: string
  description?: string
  category: string
  price: number
  image_url: string
  tag?: string
}): Promise<Poster | null> {
  const { data, error } = await supabase
    .from('posters')
    .insert({
      title: input.title,
      description: input.description || '',
      category: input.category,
      price: input.price,
      image_url: input.image_url,
      tag: input.tag || '',
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding poster:', error)
    return null
  }

  return data ? mapRow(data) : null
}

export async function updatePoster(
  id: string,
  updates: Partial<Pick<Poster, 'title' | 'description' | 'category' | 'price' | 'image_url' | 'tag'>>,
): Promise<boolean> {
  const { error } = await supabase.from('posters').update(updates).eq('id', id)

  if (error) {
    console.error('Error updating poster:', error)
    return false
  }

  return true
}

export async function deletePoster(id: string): Promise<boolean> {
  const { error } = await supabase.from('posters').delete().eq('id', id)

  if (error) {
    console.error('Error deleting poster:', error)
    return false
  }

  return true
}

export async function uploadPosterImage(file: File): Promise<string | null> {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabase.storage
    .from('poster-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('poster-images').getPublicUrl(data.path)

  return publicUrl
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}
