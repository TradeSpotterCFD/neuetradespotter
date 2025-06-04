"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Client-seitige Weiterleitung zum Admin-Dashboard nach erfolgreichem Login
    const timer = setTimeout(() => {
      router.push('/admin/dashboard');
    }, 500); // 500ms Verzögerung hinzugefügt

    return () => clearTimeout(timer); // Cleanup-Funktion, um den Timer zu löschen

  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p>Weiterleitung zum Admin-Dashboard...</p>
    </div>
  );
}