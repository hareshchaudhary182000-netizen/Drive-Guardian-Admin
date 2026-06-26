import fakeDataProvider from 'ra-data-fakerest';
import { supabaseDataProvider } from 'ra-supabase';
import { supabaseClient, supabaseUrl, supabaseAnonKey } from './supabase';
import { mockData } from './mockData';

/**
 * The resource list pages (Feedback, Drivers, Partners, Activity, Reports, Ads)
 * run on DUMMY data so no real user data is exposed in demos. The DASHBOARD is
 * unaffected — it reads real data straight from Supabase (see dashboard/).
 *
 * To switch these pages back to live Supabase data, export `realDataProvider`
 * below as `dataProvider` instead.
 */
export const dataProvider = fakeDataProvider(structuredClone(mockData), false, 250);

/** Live Supabase data provider (kept for when you want real data back). */
export const realDataProvider = supabaseDataProvider({
  instanceUrl: supabaseUrl,
  apiKey: supabaseAnonKey,
  supabaseClient,
});
