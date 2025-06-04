"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { handleLogin as serverHandleLogin } from '@/app/login/actions';

export default function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    setIsMounted(true);

    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      setIsResettingPassword(true);
      setMessage('Bitte geben Sie Ihr neues Passwort ein.');
    } else {
      const paramAccessToken = searchParams.get('access_token');
      const paramRefreshToken = searchParams.get('refresh_token');

      if (paramAccessToken && paramRefreshToken) {
         setIsResettingPassword(true);
         setMessage('Bitte geben Sie Ihr neues Passwort ein.');
      }
    }

  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    console.log('>>> [LoginContent] Attempting login...');

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const result = await serverHandleLogin(formData);

    if (result?.error) {
      console.error('>>> [LoginContent] Login failed:', result.error);
      setError(result.error);
    } else {
      console.log('>>> [LoginContent] Server action handled login and redirect.');
    }

    setLoading(false);
    console.log('>>> [LoginContent] Loading set to false.');
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError('Passwörter stimmen nicht überein.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setMessage('Ihr Passwort wurde erfolgreich zurückgesetzt. Sie können sich jetzt anmelden.');
      setIsResettingPassword(false);
      setNewPassword('');
      setConfirmPassword('');

    } catch (error: unknown) {
      console.error('Error caught in handlePasswordReset:', error instanceof Error ? error.message : error);
      setError(error instanceof Error ? error.message : 'Fehler beim Zurücksetzen des Passworts.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!email) {
      setError('Bitte geben Sie Ihre E-Mail-Adresse ein, um das Passwort zurückzusetzen.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        throw error;
      }

      setMessage('Eine E-Mail zum Zurücksetzen des Passworts wurde an Ihre Adresse gesendet.');

    } catch (error: unknown) {
      console.error('Error caught in handlePasswordResetRequest:', error instanceof Error ? error.message : error);
      setError(error instanceof Error ? error.message : 'Fehler beim Anfordern des Passwort-Resets.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
        </div>

        {/* Zeigt Fehlermeldungen an */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Zeigt Erfolgsmeldungen an */}
        {message && !error && (
           <Alert variant="default" className="mb-4 bg-green-100 border-green-400 text-green-700">
             <AlertDescription>{message}</AlertDescription>
           </Alert>
        )}


        {/* Bedingte Anzeige des Formulars nur nach Hydration */}
        {isMounted && (
          isResettingPassword ? (
            // Passwort-Reset Formular
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Neues Passwort
                </label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Neues Passwort bestätigen
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#145588] hover:bg-[#0e3e66]"
                disabled={loading}
              >
                {loading ? 'Setze Passwort zurück...' : 'Passwort zurücksetzen'}
              </Button>
            </form>
          ) : (
            // Login Formular
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email" // name Attribut hinzugefügt
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  name="password" // name Attribut hinzugefügt
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#145588] hover:bg-[#0e3e66]"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Passwort vergessen Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handlePasswordResetRequest}
                  className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                  disabled={loading}
                >
                  Passwort vergessen?
                </button>
              </div>
            </form>
          )
        )}


        {/* Link zurück zur Startseite */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
