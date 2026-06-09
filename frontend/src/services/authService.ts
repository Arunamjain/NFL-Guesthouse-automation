import { supabase } from '@/lib/supabase'
import type { Employee, Role } from '@/types'

export async function login({
  identifier,
  password,
  role,
}: {
  identifier: string
  password: string
  role: Role
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: identifier,
    password: password,
  })

  if (error) throw new Error(error.message)

  // Fetch profile to check role matches
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

  if (profileError) throw new Error('Could not fetch user profile')

  // Check if role matches what they selected on login screen
  if (profile.role !== role && role !== 'employee') {
    await supabase.auth.signOut()
    throw new Error('You do not have access as ' + role)
  }

  return { user: data.user, profile }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function getCurrentUser(): Promise<Employee | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile as Employee
}