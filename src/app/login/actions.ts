'use server';

import { redirect } from 'next/navigation';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = createServerActionClient({ cookies });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login failed:', error.message);
    return {
      error: 'Login fehlgeschlagen. Bitte überprüfe deine Eingaben.',
    };
  }

  if (data?.session) {
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  }

  const { data: adminData, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', data.user.id)
    .eq('active', true)
    .single();

  if (adminError || !adminData) {
    return {
      error: 'Kein aktiver Adminzugang gefunden.',
    };
  }

  redirect('/admin/dashboard');
}

