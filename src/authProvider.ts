import type { AuthProvider } from 'react-admin';
import { supabaseClient } from './supabase';

/**
 * Email/password auth on top of Supabase Auth. Only users whose `profiles.role`
 * is 'admin' are allowed in — a regular driver who signs in is rejected, so the
 * panel can't be opened with an ordinary app account.
 */
async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabaseClient
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  return data?.role === 'admin';
}

export const authProvider: AuthProvider = {
  async login({ username, password }) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: username,
      password,
    });
    if (error) throw new Error(error.message);
    const uid = data.user?.id;
    if (!uid || !(await isAdmin(uid))) {
      await supabaseClient.auth.signOut();
      throw new Error('This account does not have admin access.');
    }
  },

  async logout() {
    await supabaseClient.auth.signOut();
  },

  async checkAuth() {
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session) throw new Error();
  },

  async checkError(error) {
    const status = (error as { status?: number })?.status;
    if (status === 401 || status === 403) throw new Error();
  },

  async getIdentity() {
    const { data } = await supabaseClient.auth.getUser();
    const user = data.user;
    if (!user) throw new Error();
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', user.id)
      .maybeSingle();
    return {
      id: user.id,
      fullName: profile?.name || 'Admin',
      avatar: profile?.avatar_url || undefined,
    };
  },

  async getPermissions() {
    const { data } = await supabaseClient.auth.getUser();
    if (!data.user) return null;
    return (await isAdmin(data.user.id)) ? 'admin' : 'user';
  },
};
