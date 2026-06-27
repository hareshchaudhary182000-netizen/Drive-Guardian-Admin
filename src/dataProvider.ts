import { supabaseDataProvider } from 'ra-supabase';
import { supabaseClient, supabaseUrl, supabaseAnonKey } from './supabase';

/**
 * react-admin data provider backed by Supabase (PostgREST). It reads/writes the
 * same tables the mobile app uses. Row access is governed by the database RLS
 * policies — to see every user's data here, an admin SELECT policy must be in
 * place (see supabase-admin-setup.sql).
 */
export const dataProvider = supabaseDataProvider({
  instanceUrl: supabaseUrl,
  apiKey: supabaseAnonKey,
  supabaseClient,
});
