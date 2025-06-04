'use server';

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export async function createSupabaseServerClient() { // Funktion als async markiert
  return createServerComponentClient({ cookies });
}
